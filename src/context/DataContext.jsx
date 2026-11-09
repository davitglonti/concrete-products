import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { INITIAL_PRODUCTS, INITIAL_PROJECTS, CATEGORIES } from "../data/initialData";
import { DEFAULT_SITE_SETTINGS, applyFavicon } from "../data/initialSettings";
import { getPersistentItem, setPersistentItem } from "../utils/storage";
import { isFirebaseConfigured } from "../config/firebaseEnv";
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

const mergeSiteSettings = (base, incoming) => {
  if (!incoming) return base || DEFAULT_SITE_SETTINGS;
  return {
    ...base,
    ...incoming,
    calculator: {
      ...(base?.calculator || DEFAULT_SITE_SETTINGS.calculator),
      ...(incoming.calculator || {}),
      stepModels:
        Array.isArray(incoming.calculator?.stepModels) && incoming.calculator.stepModels.length > 0
          ? incoming.calculator.stepModels
          : base?.calculator?.stepModels || DEFAULT_SITE_SETTINGS.calculator.stepModels,
      paverSizes:
        Array.isArray(incoming.calculator?.paverSizes) && incoming.calculator.paverSizes.length > 0
          ? incoming.calculator.paverSizes
          : base?.calculator?.paverSizes || DEFAULT_SITE_SETTINGS.calculator.paverSizes,
      stepLengths:
        Array.isArray(incoming.calculator?.stepLengths) && incoming.calculator.stepLengths.length > 0
          ? incoming.calculator.stepLengths
          : base?.calculator?.stepLengths || DEFAULT_SITE_SETTINGS.calculator.stepLengths,
      stepDepths:
        Array.isArray(incoming.calculator?.stepDepths) && incoming.calculator.stepDepths.length > 0
          ? incoming.calculator.stepDepths
          : base?.calculator?.stepDepths || DEFAULT_SITE_SETTINGS.calculator.stepDepths,
    },
    seo: {
      ...(base?.seo || DEFAULT_SITE_SETTINGS.seo),
      ...(incoming.seo || {}),
      pageMeta: {
        ...(base?.seo?.pageMeta || DEFAULT_SITE_SETTINGS.seo.pageMeta),
        ...(incoming.seo?.pageMeta || {}),
      },
    },
  };
};

export const DataProvider = ({ children }) => {
  // Synchronous initial load with localStorage & smart fallback
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
        return mergeSiteSettings(DEFAULT_SITE_SETTINGS, parsed);
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
        setSiteSettings((prev) => mergeSiteSettings(prev, saved));
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
    const iconToApply =
      siteSettings?.syncFaviconWithLogo && siteSettings?.logoImage
        ? siteSettings.logoImage
        : siteSettings?.favicon || "/favicon.svg";
    applyFavicon(iconToApply);
  }, [siteSettings?.logoImage, siteSettings?.favicon, siteSettings?.syncFaviconWithLogo]);

  // Global Firebase Auth state subscription (reliable across all routes)
  useEffect(() => {
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
    })
      .then((unsubFn) => {
        if (typeof unsubFn === "function") unsub = unsubFn;
      })
      .catch(() => {
        setAuthLoading(false);
      });

    return () => unsub();
  }, []);

  // Real-time synchronization: starts immediately in the background
  useEffect(() => {
    let isMounted = true;
    let unsub = () => {};

    const startSync = async () => {
      setIsSyncing(true);
      const unsubFn = await subscribeToCollections({
        includeInquiries: true,
        onStatusChange: (status, msg) => {
          if (!isMounted) return;
          setFirebaseStatus(status);
          if (msg) setFirebaseErrorMsg(msg);
          setIsSyncing(false);
          setIsLoading(false);
        },
        onProducts: (remoteProducts) => {
          if (!isMounted) return;
          if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
            const clean = remoteProducts.filter(
              (rp) => !deletedProductIdsRef.current.has(rp.id)
            );
            setProducts(clean);
            setPersistentItem("monolith_products", clean);
          }
          setIsSyncing(false);
          setIsLoading(false);
        },
        onCategories: (remoteCats) => {
          if (!isMounted) return;
          if (Array.isArray(remoteCats) && remoteCats.length > 0) {
            const clean = remoteCats.filter(
              (rc) => !deletedCategoryIdsRef.current.has(rc.id)
            );
            setCategories(clean);
            setPersistentItem("monolith_categories", clean);
          }
        },
        onProjects: (remoteProjects) => {
          if (!isMounted) return;
          if (Array.isArray(remoteProjects) && remoteProjects.length > 0) {
            const clean = remoteProjects.filter(
              (rp) => !deletedProjectIdsRef.current.has(rp.id)
            );
            setProjects(clean);
            setPersistentItem("monolith_projects", clean);
          }
        },
        onInquiries: (remoteInquiries) => {
          if (!isMounted) return;
          if (Array.isArray(remoteInquiries)) {
            setInquiries(remoteInquiries);
            setPersistentItem("monolith_inquiries", remoteInquiries);
          }
        },
        onSettings: (remoteSettings) => {
          if (!isMounted) return;
          if (remoteSettings) {
            setSiteSettings((prev) => {
              const merged = mergeSiteSettings(prev, remoteSettings);
              setPersistentItem("monolith_site_settings", merged);
              return merged;
            });
          }
        },
      });

      if (isMounted && typeof unsubFn === "function") {
        unsub = unsubFn;
      }
    };

    startSync();

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // CRUD for Products (wrapped in useCallback for stable references)
  const addProduct = useCallback(async (productData) => {
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
  }, []);

  const updateProduct = useCallback(async (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    dbUpdateProduct(id, updatedData);
  }, []);

  const deleteProduct = useCallback(async (id) => {
    deletedProductIdsRef.current.add(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    dbDeleteProduct(id);
  }, []);

  // CRUD for Categories
  const addCategory = useCallback(async (categoryData) => {
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
  }, []);

  const updateCategory = useCallback(async (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    dbUpdateCategory(id, updatedData);
  }, []);

  const deleteCategory = useCallback(async (id) => {
    deletedCategoryIdsRef.current.add(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    dbDeleteCategory(id);
  }, []);

  // CRUD for Projects
  const addProject = useCallback(async (projectData) => {
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
  }, []);

  const updateProject = useCallback(async (id, updatedData) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    dbUpdateProject(id, updatedData);
  }, []);

  const deleteProject = useCallback(async (id) => {
    deletedProjectIdsRef.current.add(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    dbDeleteProject(id);
  }, []);

  // Inquiries
  const addInquiry = useCallback(async (inquiryData) => {
    const newInq = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInq, ...prev]);
    dbSaveInquiry(newInq);
  }, []);

  // Initial Seed tool
  const seedInitialDataToFirebase = useCallback(async () => {
    return await dbSeedAll(categories, products, projects);
  }, [categories, products, projects]);

  // Site Settings
  const updateSiteSettings = useCallback(async (updates) => {
    setSiteSettings((prev) => {
      const merged = { ...prev, ...updates };
      setPersistentItem("monolith_site_settings", merged);
      try {
        localStorage.setItem("monolith_site_settings", JSON.stringify(merged));
      } catch (e) {
        console.warn("localStorage site settings error:", e);
      }
      dbSaveSiteSettings(merged);
      return merged;
    });
  }, []);

  const resetSiteSettings = useCallback(async () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setPersistentItem("monolith_site_settings", DEFAULT_SITE_SETTINGS);
    try {
      localStorage.setItem("monolith_site_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
    } catch (e) {}
    dbResetSiteSettings(DEFAULT_SITE_SETTINGS);
    return DEFAULT_SITE_SETTINGS;
  }, []);

  const loginAdmin = useCallback(async (email, password) => {
    const res = await dbSignInAdmin(email, password);
    if (res.success) {
      setAdminUser(res.user);
      setIsAdminAuthenticated(true);
    }
    return res;
  }, []);

  const logoutAdmin = useCallback(async () => {
    await dbSignOutAdmin();
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  }, []);

  // Memoized context value to prevent unnecessary re-renders of the tree
  const contextValue = useMemo(
    () => ({
      products,
      categories,
      projects,
      inquiries,
      isLoading,
      isSyncing,
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
    }),
    [
      products,
      categories,
      projects,
      inquiries,
      isLoading,
      isSyncing,
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
      isAdminAuthenticated,
      adminUser,
      authLoading,
      loginAdmin,
      logoutAdmin,
      siteSettings,
      updateSiteSettings,
      resetSiteSettings,
    ]
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
