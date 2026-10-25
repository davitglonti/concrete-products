import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth, isFirebaseConfigured } from "../config/firebase";
import { INITIAL_PRODUCTS, INITIAL_PROJECTS, CATEGORIES } from "../data/initialData";
import { DEFAULT_SITE_SETTINGS, applyFavicon } from "../data/initialSettings";
import { getPersistentItem, setPersistentItem } from "../utils/storage";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// Helper to clean object for Firestore
const sanitizeForFirestore = (obj) => {
  const clean = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  });
  return clean;
};

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

  // Listen to Firebase Auth state - only initialize for admin route to keep public pages lightning fast
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const isAdminRoute =
      typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

    if (!isAdminRoute) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminUser(user);
        setIsAdminAuthenticated(true);
      } else {
        setAdminUser(null);
        setIsAdminAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [firebaseStatus, setFirebaseStatus] = useState(
    isFirebaseConfigured ? "connecting" : "disabled"
  );
  const [firebaseErrorMsg, setFirebaseErrorMsg] = useState("");

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

  // Firebase Real-time listeners
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setFirebaseStatus("disabled");
      return;
    }

    let isMounted = true;

    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        if (!isMounted) return;
        setFirebaseStatus("connected");
        setFirebaseErrorMsg("");

        if (!snapshot.empty) {
          const remoteProducts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          
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
        }
      },
      (error) => {
        if (!isMounted) return;
        console.warn("Firestore products warning:", error.message);
        setFirebaseStatus("error");
        if (
          error.message.includes("Cloud Firestore API has not been used") ||
          error.message.includes("PERMISSION_DENIED")
        ) {
          setFirebaseErrorMsg(
            "Firestore Database ჯერ არ არის შექმნილი ან Rules ჩაკეტილია. გადადით Firebase Console -> Firestore Database -> Rules და დააყენეთ 'allow read, write: if true;'."
          );
        } else {
          setFirebaseErrorMsg(error.message);
        }
      }
    );

    const unsubCategories = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const remoteCats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
        }
      },
      (error) => {
        if (!isMounted) return;
        console.warn("Firestore categories warning:", error.message);
      }
    );

    const unsubProjects = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const remoteProjects = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
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
        }
      },
      (error) => {
        if (!isMounted) return;
        console.warn("Firestore projects warning:", error.message);
      }
    );

    const unsubInquiries = onSnapshot(
      collection(db, "inquiries"),
      (snapshot) => {
        if (!isMounted) return;
        setInquiries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        if (!isMounted) return;
        console.warn("Firestore inquiries warning:", error.message);
      }
    );

    let unsubSettings = () => {};
    try {
      unsubSettings = onSnapshot(
        doc(db, "site_settings", "general"),
        (docSnap) => {
          if (!isMounted) return;
          if (docSnap.exists()) {
            const remoteSettings = docSnap.data();
            setSiteSettings((prev) => ({ ...prev, ...remoteSettings }));
          }
        },
        (error) => {
          if (!isMounted) return;
          console.warn("Firestore site_settings warning:", error.message);
        }
      );
    } catch (e) {
      console.warn("Firestore site_settings setup error:", e);
    }

    return () => {
      isMounted = false;
      unsubProducts();
      unsubCategories();
      unsubProjects();
      unsubInquiries();
      if (typeof unsubSettings === "function") unsubSettings();
    };
  }, []);

  // CRUD ფუნქციები პროდუქტებისთვის
  const addProduct = async (productData) => {
    const newProd = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);

    try {
      const current = await getPersistentItem("monolith_products", []);
      await setPersistentItem("monolith_products", [newProd, ...current.filter((p) => p.id !== newProd.id)]);
    } catch (e) {
      console.warn("Storage save error:", e);
    }

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "products", newProd.id), sanitizeForFirestore(newProd));
      } catch (e) {
        console.error("Firestore addProduct error:", e);
      }
    }
  };

  const updateProduct = async (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "products", id), sanitizeForFirestore(updatedData), { merge: true });
      } catch (e) {
        console.error("Firestore updateProduct error:", e);
      }
    }
  };

  const deleteProduct = async (id) => {
    deletedProductIdsRef.current.add(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (e) {
        console.error("Firestore deleteProduct error:", e);
      }
    }
  };

  // CRUD ფუნქციები კატეგორიებისთვის
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

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "categories", newCat.id), sanitizeForFirestore(newCat));
      } catch (e) {
        console.error("Firestore addCategory error:", e);
      }
    }
  };

  const updateCategory = async (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "categories", id), sanitizeForFirestore(updatedData), { merge: true });
      } catch (e) {
        console.error("Firestore updateCategory error:", e);
      }
    }
  };

  const deleteCategory = async (id) => {
    deletedCategoryIdsRef.current.add(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "categories", id));
      } catch (e) {
        console.error("Firestore deleteCategory error:", e);
      }
    }
  };

  // CRUD ფუნქციები პროექტებისთვის
  const addProject = async (projectData) => {
    const newProj = {
      ...projectData,
      id: projectData.id || `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);

    try {
      const current = await getPersistentItem("monolith_projects", []);
      await setPersistentItem("monolith_projects", [newProj, ...current.filter((p) => p.id !== newProj.id)]);
    } catch (e) {
      console.warn("Storage save error:", e);
    }

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "projects", newProj.id), sanitizeForFirestore(newProj));
      } catch (e) {
        console.error("Firestore addProject error:", e);
      }
    }
  };

  const updateProject = async (id, updatedData) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );

    if (isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "projects", id), sanitizeForFirestore(updatedData), { merge: true });
      } catch (e) {
        console.error("Firestore updateProject error:", e);
      }
    }
  };

  const deleteProject = async (id) => {
    deletedProjectIdsRef.current.add(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (e) {
        console.error("Firestore deleteProject error:", e);
      }
    }
  };

  // მოთხოვნები
  const addInquiry = async (inquiryData) => {
    const newInq = { ...inquiryData, id: `inq-${Date.now()}`, createdAt: new Date().toISOString() };
    setInquiries((prev) => [newInq, ...prev]);

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, "inquiries"), sanitizeForFirestore(newInq));
      } catch (e) {
        console.error("Firestore addInquiry error:", e);
      }
    }
  };

  // Initial Seed tool
  const seedInitialDataToFirebase = async () => {
    if (!isFirebaseConfigured) {
      return { success: false, message: "Firebase არ არის კონფიგურირებული" };
    }
    try {
      for (const cat of categories) {
        await setDoc(doc(db, "categories", cat.id), sanitizeForFirestore(cat));
      }
      for (const prod of products) {
        await setDoc(doc(db, "products", prod.id), sanitizeForFirestore(prod));
      }
      for (const proj of projects) {
        await setDoc(doc(db, "projects", proj.id), sanitizeForFirestore(proj));
      }
      return { success: true, message: "კატეგორიები, პროდუქტები და პროექტები წარმატებით აიტვირთა Firebase-ში!" };
    } catch (err) {
      console.error("Firebase seed error:", err);
      return {
        success: false,
        message:
          err.message.includes("PERMISSION_DENIED") || err.message.includes("Cloud Firestore API")
            ? "Firestore Rules ჯერ ჩაკეტილია. Firebase Console -> Firestore Database -> Rules-ში ჩაწერეთ allow read, write: if true; და დააჭირეთ Publish."
            : err.message,
      };
    }
  };

  // საიტის პარამეტრების მართვა (ლოგო, ფავიკონი, ნავბარი, ფუტერი)
  const updateSiteSettings = async (updates) => {
    const merged = { ...siteSettings, ...updates };
    setSiteSettings(merged);
    setPersistentItem("monolith_site_settings", merged);
    try {
      localStorage.setItem("monolith_site_settings", JSON.stringify(merged));
    } catch (e) {
      console.warn("localStorage site settings error:", e);
    }
    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "site_settings", "general"), sanitizeForFirestore(merged), { merge: true });
      } catch (err) {
        console.error("Firebase site settings save error:", err);
      }
    }
    return merged;
  };

  const resetSiteSettings = async () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setPersistentItem("monolith_site_settings", DEFAULT_SITE_SETTINGS);
    try {
      localStorage.setItem("monolith_site_settings", JSON.stringify(DEFAULT_SITE_SETTINGS));
    } catch (e) {}
    if (db && isFirebaseConfigured) {
      try {
        await setDoc(doc(db, "site_settings", "general"), sanitizeForFirestore(DEFAULT_SITE_SETTINGS));
      } catch (err) {}
    }
    return DEFAULT_SITE_SETTINGS;
  };

  const loginAdmin = async (email, password) => {
    if (!auth) {
      return { success: false, message: "Firebase Auth ინიციალიზებული არ არის." };
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      setAdminUser(userCredential.user);
      setIsAdminAuthenticated(true);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Firebase Login Error:", error);
      let message = "ავტორიზაცია ვერ მოხერხდა. შეამოწმეთ ელფოსტა და პაროლი.";
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        message = "ელფოსტა ან პაროლი არასწორია.";
      } else if (error.code === "auth/invalid-email") {
        message = "ელფოსტის ფორმატი არასწორია.";
      } else if (error.code === "auth/user-disabled") {
        message = "ეს მომხმარებელი დაბლოკილია Firebase-ში.";
      } else if (error.code === "auth/too-many-requests") {
        message = "ძალიან ბევრი მცდელობა. გთხოვთ დაიცადოთ რამდენიმე წუთი.";
      } else if (error.code === "auth/network-request-failed") {
        message = "ინტერნეტთან კავშირი შეფერხებულია. შეამოწმეთ ქსელი.";
      }
      return { success: false, message, code: error.code };
    }
  };

  const logoutAdmin = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
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
