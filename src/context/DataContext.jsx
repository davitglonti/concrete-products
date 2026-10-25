import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { INITIAL_PRODUCTS, INITIAL_PROJECTS, CATEGORIES } from "../data/initialData";
import { DEFAULT_SITE_SETTINGS, applyFavicon } from "../data/initialSettings";
import { getPersistentItem, setPersistentItem } from "../utils/storage";
import {
  subscribeToCollections,
  dbSaveProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbSaveCategory,
  dbUpdateCategory,
  dbDeleteCategory,
  dbSaveProject,
  dbUpdateProject,
  dbDeleteProject,
  dbSaveInquiry,
  dbSaveSiteSettings,
  dbResetSiteSettings,
  dbSeedAll,
  dbSubscribeToAuth,
  dbSignInAdmin,
  dbSignOutAdmin,
} from "../services/firebaseService";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Synchronous initial load with localStorage & smart merge with rich INITIAL_PRODUCTS
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("monolith_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p) => p.id));
          const missing = INITIAL_PRODUCTS.filter((ip) => !existingIds.has(ip.id));
          return [...parsed, ...missing];
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("monolith_categories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return CATEGORIES;
    } catch {
      return CATEGORIES;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem("monolith_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingMap = new Map(parsed.map((p) => [p.id, p]));
          return INITIAL_PROJECTS.map((ip) => {
            const userVer = existingMap.get(ip.id);
            return userVer ? { ...ip, ...userVer } : ip;
          });
        }
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem("monolith_inquiries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("monolith_site_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
      return DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState("connecting");
  const [firebaseErrorMsg, setFirebaseErrorMsg] = useState("");
  const isFirebaseConfigured = true;

  // Track deleted IDs in this session to prevent merge resurrection
  const deletedProductIdsRef = useRef(new Set());
  const deletedCategoryIdsRef = useRef(new Set());
  const deletedProjectIdsRef = useRef(new Set());

  // Asynchronous load from IndexedDB (recovers large photo data safely)
  useEffect(() => {
    let active = true;
    getPersistentItem("monolith_products", null).then((saved) => {
      if (active && saved && Array.isArray(saved) && saved.length > 0) {
        const existingIds = new Set(saved.map((p) => p.id));
        const missing = INITIAL_PRODUCTS.filter((ip) => !existingIds.has(ip.id));
        setProducts([...saved, ...missing]);
      }
    });
    getPersistentItem("monolith_categories", null).then((saved) => {
      if (active && saved && Array.isArray(saved) && saved.length > 0) {
        setCategories(saved);
      }
    });
    getPersistentItem("monolith_projects", null).then((saved) => {
      if (active && saved && Array.isArray(saved) && saved.length > 0) {
        setProjects(saved);
      }
    });
    getPersistentItem("monolith_inquiries", null).then((saved) => {
      if (active && saved && Array.isArray(saved)) {
        setInquiries(saved);
      }
    });
    getPersistentItem("monolith_site_settings", null).then((saved) => {
      if (active && saved) {
        setSiteSettings((prev) => ({ ...prev, ...saved }));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Save to persistent storage whenever state changes
  useEffect(() => {
    setPersistentItem("monolith_products", products);
  }, [products]);

  useEffect(() => {
    setPersistentItem("monolith_categories", categories);
  }, [categories]);

  useEffect(() => {
    setPersistentItem("monolith_projects", projects);
  }, [projects]);

  useEffect(() => {
    setPersistentItem("monolith_inquiries", inquiries);
  }, [inquiries]);

  useEffect(() => {
    setPersistentItem("monolith_site_settings", siteSettings);
  }, [siteSettings]);

  // Apply dynamic favicon to the browser tab
  useEffect(() => {
    if (siteSettings.syncFaviconWithLogo && siteSettings.logoImage) {
      applyFavicon(siteSettings.logoImage);
    } else if (siteSettings.favicon) {
      applyFavicon(siteSettings.favicon);
    }
  }, [siteSettings.logoImage, siteSettings.favicon, siteSettings.syncFaviconWithLogo]);

  // Firebase Auth state: only initialize on /admin to keep public routes 100% fast
  useEffect(() => {
    const isAdminRoute =
      typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

    if (!isAdminRoute) {
      setAuthLoading(false);
      return;
    }

    let unsub = () => {};
    dbSubscribeToAuth((user) => {
      if (user) {
        setAdminUser(user);
        setIsAdminAuthenticated(true);
      } else {
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      }
      setAuthLoading(false);
    }).then((unsubFn) => {
      if (typeof unsubFn === "function") unsub = unsubFn;
    });

    return () => unsub();
  }, []);

  // Real-time synchronization:
  // On admin routes, sync immediately. On public routes, defer by 2.5s to let LCP & FCP achieve 100 score!
  useEffect(() => {
    let isMounted = true;
    let unsub = () => {};

    const isAdminRoute =
      typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

    const startSync = async () => {
      const unsubFn = await subscribeToCollections({
        includeInquiries: isAdminRoute,
        onStatusChange: (status, msg) => {
          if (!isMounted) return;
          setFirebaseStatus(status);
          if (msg) setFirebaseErrorMsg(msg);
        },
        onProducts: (remoteProducts) => {
          if (!isMounted) return;
          setProducts((currentLocal) => {
            const remoteMap = new Map(remoteProducts.map((p) => [p.id, p]));
            const result = remoteProducts.filter(
              (rp) => !deletedProductIdsRef.current.has(rp.id)
            );
            currentLocal.forEach((lp) => {
              if (!remoteMap.has(lp.id) && !deletedProductIdsRef.current.has(lp.id)) {
                result.push(lp);
              }
            });
            return result;
          });
        },
        onCategories: (remoteCats) => {
          if (!isMounted) return;
          setCategories((currentLocal) => {
            const remoteMap = new Map(remoteCats.map((c) => [c.id, c]));
            const result = remoteCats.filter(
              (rc) => !deletedCategoryIdsRef.current.has(rc.id)
            );
            currentLocal.forEach((lc) => {
              if (!remoteMap.has(lc.id) && !deletedCategoryIdsRef.current.has(lc.id)) {
                result.push(lc);
              }
            });
            return result;
          });
        },
        onProjects: (remoteProjects) => {
          if (!isMounted) return;
          setProjects((currentLocal) => {
            const remoteMap = new Map(remoteProjects.map((p) => [p.id, p]));
            const result = remoteProjects.filter(
              (rp) => !deletedProjectIdsRef.current.has(rp.id)
            );
            currentLocal.forEach((lp) => {
              if (!remoteMap.has(lp.id) && !deletedProjectIdsRef.current.has(lp.id)) {
                result.push(lp);
              }
            });
            return result;
          });
        },
        onInquiries: (remoteInquiries) => {
          if (!isMounted) return;
          setInquiries(remoteInquiries);
        },
        onSettings: (remoteSettings) => {
          if (!isMounted) return;
          setSiteSettings((prev) => ({ ...prev, ...remoteSettings }));
        },
      });

      if (isMounted && typeof unsubFn === "function") {
        unsub = unsubFn;
      }
    };

    if (isAdminRoute) {
      startSync();
    } else {
      const timer = setTimeout(startSync, 2500);
      return () => {
        isMounted = false;
        clearTimeout(timer);
        unsub();
      };
    }

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // CRUD for Products
  const addProduct = async (productData) => {
    const newProd = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);

    try {
      const current = await getPersistentItem("monolith_products", []);
      await setPersistentItem("monolith_products", [
        newProd,
        ...current.filter((p) => p.id !== newProd.id),
      ]);
    } catch (e) {
      console.warn("Storage save error:", e);
    }

    dbSaveProduct(newProd);
  };

  const updateProduct = async (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    dbUpdateProduct(id, updatedData);
  };

  const deleteProduct = async (id) => {
    deletedProductIdsRef.current.add(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    dbDeleteProduct(id);
  };

  // CRUD for Categories
  const addCategory = async (categoryData) => {
    const slug =
      categoryData.id?.trim() ||
      categoryData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-") ||
      `cat-${Date.now()}`;

    const newCat = {
      ...categoryData,
      id: slug,
      createdAt: new Date().toISOString(),
    };

    setCategories((prev) => [...prev, newCat]);

    try {
      const current = await getPersistentItem("monolith_categories", []);
      await setPersistentItem("monolith_categories", [
        ...current.filter((c) => c.id !== newCat.id),
        newCat,
      ]);
    } catch (e) {
      console.warn("Category storage save error:", e);
    }

    dbSaveCategory(newCat);
  };

  const updateCategory = async (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    dbUpdateCategory(id, updatedData);
  };

  const deleteCategory = async (id) => {
    deletedCategoryIdsRef.current.add(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    dbDeleteCategory(id);
  };

  // CRUD for Projects
  const addProject = async (projectData) => {
    const newProj = {
      ...projectData,
      id: projectData.id || `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);

    try {
      const current = await getPersistentItem("monolith_projects", []);
      await setPersistentItem("monolith_projects", [
        newProj,
        ...current.filter((p) => p.id !== newProj.id),
      ]);
    } catch (e) {
      console.warn("Storage save error:", e);
    }

    dbSaveProject(newProj);
  };

  const updateProject = async (id, updatedData) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    dbUpdateProject(id, updatedData);
  };

  const deleteProject = async (id) => {
    deletedProjectIdsRef.current.add(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    dbDeleteProject(id);
  };

  // Inquiries
  const addInquiry = async (inquiryData) => {
    const newInq = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInq, ...prev]);
    dbSaveInquiry(newInq);
  };

  // Initial Seed tool
  const seedInitialDataToFirebase = async () => {
    return await dbSeedAll(categories, products, projects);
  };

  // Site Settings
  const updateSiteSettings = async (updates) => {
    const merged = { ...siteSettings, ...updates };
    setSiteSettings(merged);
    setPersistentItem("monolith_site_settings", merged);
    try {
      localStorage.setItem("monolith_site_settings", JSON.stringify(merged));
    } catch (e) {
      console.warn("localStorage site settings error:", e);
    }
    dbSaveSiteSettings(merged);
    return merged;
  };

  const resetSiteSettings = async () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setPersistentItem("monolith_site_settings", DEFAULT_SITE_SETTINGS);
    try {
      localStorage.setItem("monolith_site_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
    } catch (e) {}
    dbResetSiteSettings(DEFAULT_SITE_SETTINGS);
    return DEFAULT_SITE_SETTINGS;
  };

  const loginAdmin = async (email, password) => {
    const res = await dbSignInAdmin(email, password);
    if (res.success) {
      setAdminUser(res.user);
      setIsAdminAuthenticated(true);
    }
    return res;
  };

  const logoutAdmin = async () => {
    await dbSignOutAdmin();
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        projects,
        inquiries,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addProject,
        updateProject,
        deleteProject,
        addInquiry,
        seedInitialDataToFirebase,
        firebaseStatus,
        firebaseErrorMsg,
        isFirebaseConfigured,
        isAdminAuthenticated,
        adminUser,
        authLoading,
        loginAdmin,
        logoutAdmin,
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
