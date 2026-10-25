// Dynamic Firebase Service for Monolith
// Defers loading Firebase SDK chunks until needed, keeping public initial page load ultra-fast (<1s)

let firebasePromise = null;

export const loadFirebase = () => {
  if (!firebasePromise) {
    firebasePromise = Promise.all([
      import("../config/firebase"),
      import("firebase/firestore"),
      import("firebase/auth"),
    ]).then(([{ db, auth, isFirebaseConfigured }, firestore, authModule]) => {
      return {
        db,
        auth,
        isFirebaseConfigured,
        ...firestore,
        ...authModule,
      };
    });
  }
  return firebasePromise;
};

// Helper to clean object for Firestore
export const sanitizeForFirestore = (obj) => {
  const clean = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  });
  return clean;
};

// Real-time synchronization
export const subscribeToCollections = async ({
  onProducts,
  onCategories,
  onProjects,
  onInquiries,
  onSettings,
  onStatusChange,
  includeInquiries = false,
}) => {
  try {
    const { db, isFirebaseConfigured, collection, doc, onSnapshot } = await loadFirebase();
    if (!isFirebaseConfigured || !db) {
      if (onStatusChange) onStatusChange("disabled", "");
      return () => {};
    }

    if (onStatusChange) onStatusChange("connected", "");

    const unsubs = [];

    // Products
    if (onProducts) {
      const unsub = onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          if (!snapshot.empty) {
            onProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => {
          console.warn("Firestore products sync error:", error.message);
          if (onStatusChange) onStatusChange("error", error.message);
        }
      );
      unsubs.push(unsub);
    }

    // Categories
    if (onCategories) {
      const unsub = onSnapshot(
        collection(db, "categories"),
        (snapshot) => {
          if (!snapshot.empty) {
            onCategories(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => console.warn("Firestore categories sync error:", error.message)
      );
      unsubs.push(unsub);
    }

    // Projects
    if (onProjects) {
      const unsub = onSnapshot(
        collection(db, "projects"),
        (snapshot) => {
          if (!snapshot.empty) {
            onProjects(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          }
        },
        (error) => console.warn("Firestore projects sync error:", error.message)
      );
      unsubs.push(unsub);
    }

    // Inquiries (only sync for authenticated admin)
    if (includeInquiries && onInquiries) {
      const unsub = onSnapshot(
        collection(db, "inquiries"),
        (snapshot) => {
          onInquiries(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        (error) => console.warn("Firestore inquiries sync error:", error.message)
      );
      unsubs.push(unsub);
    }

    // Site Settings
    if (onSettings) {
      const unsub = onSnapshot(
        doc(db, "site_settings", "general"),
        (docSnap) => {
          if (docSnap.exists()) {
            onSettings(docSnap.data());
          }
        },
        (error) => console.warn("Firestore site settings sync error:", error.message)
      );
      unsubs.push(unsub);
    }

    return () => {
      unsubs.forEach((u) => {
        try {
          if (typeof u === "function") u();
        } catch (e) {}
      });
    };
  } catch (err) {
    console.warn("Firebase subscription init error:", err);
    if (onStatusChange) onStatusChange("error", err.message);
    return () => {};
  }
};

// CRUD for Products
export const dbSaveProduct = async (product) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "products", product.id), sanitizeForFirestore(product));
    }
  } catch (e) {
    console.error("dbSaveProduct error:", e);
  }
};

export const dbUpdateProduct = async (id, data) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "products", id), sanitizeForFirestore(data), { merge: true });
    }
  } catch (e) {
    console.error("dbUpdateProduct error:", e);
  }
};

export const dbDeleteProduct = async (id) => {
  try {
    const { db, isFirebaseConfigured, doc, deleteDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await deleteDoc(doc(db, "products", id));
    }
  } catch (e) {
    console.error("dbDeleteProduct error:", e);
  }
};

// CRUD for Categories
export const dbSaveCategory = async (category) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "categories", category.id), sanitizeForFirestore(category));
    }
  } catch (e) {
    console.error("dbSaveCategory error:", e);
  }
};

export const dbUpdateCategory = async (id, data) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "categories", id), sanitizeForFirestore(data), { merge: true });
    }
  } catch (e) {
    console.error("dbUpdateCategory error:", e);
  }
};

export const dbDeleteCategory = async (id) => {
  try {
    const { db, isFirebaseConfigured, doc, deleteDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await deleteDoc(doc(db, "categories", id));
    }
  } catch (e) {
    console.error("dbDeleteCategory error:", e);
  }
};

// CRUD for Projects
export const dbSaveProject = async (project) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "projects", project.id), sanitizeForFirestore(project));
    }
  } catch (e) {
    console.error("dbSaveProject error:", e);
  }
};

export const dbUpdateProject = async (id, data) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "projects", id), sanitizeForFirestore(data), { merge: true });
    }
  } catch (e) {
    console.error("dbUpdateProject error:", e);
  }
};

export const dbDeleteProject = async (id) => {
  try {
    const { db, isFirebaseConfigured, doc, deleteDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await deleteDoc(doc(db, "projects", id));
    }
  } catch (e) {
    console.error("dbDeleteProject error:", e);
  }
};

// Inquiry
export const dbSaveInquiry = async (inquiry) => {
  try {
    const { db, isFirebaseConfigured, collection, addDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await addDoc(collection(db, "inquiries"), sanitizeForFirestore(inquiry));
    }
  } catch (e) {
    console.error("dbSaveInquiry error:", e);
  }
};

// Site Settings
export const dbSaveSiteSettings = async (settings) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "site_settings", "general"), sanitizeForFirestore(settings), { merge: true });
    }
  } catch (e) {
    console.error("dbSaveSiteSettings error:", e);
  }
};

export const dbResetSiteSettings = async (defaultSettings) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (db && isFirebaseConfigured) {
      await setDoc(doc(db, "site_settings", "general"), sanitizeForFirestore(defaultSettings));
    }
  } catch (e) {
    console.error("dbResetSiteSettings error:", e);
  }
};

// Seed
export const dbSeedAll = async (categories, products, projects) => {
  try {
    const { db, isFirebaseConfigured, doc, setDoc } = await loadFirebase();
    if (!isFirebaseConfigured || !db) {
      return { success: false, message: "Firebase არ არის კონფიგურირებული" };
    }
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

// Auth
export const dbSubscribeToAuth = async (callback) => {
  try {
    const { auth, onAuthStateChanged } = await loadFirebase();
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  } catch (e) {
    console.warn("Auth subscription error:", e);
    callback(null);
    return () => {};
  }
};

export const dbSignInAdmin = async (email, password) => {
  try {
    const { auth, signInWithEmailAndPassword } = await loadFirebase();
    if (!auth) {
      return { success: false, message: "Firebase Auth ინიციალიზებული არ არის." };
    }
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
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

export const dbSignOutAdmin = async () => {
  try {
    const { auth, signOut } = await loadFirebase();
    if (auth) {
      await signOut(auth);
    }
  } catch (e) {
    console.error("dbSignOutAdmin error:", e);
  }
};
