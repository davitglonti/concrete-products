import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import AdminLogin from "./AdminLogin";
import {
  Trash2,
  Plus,
  LogOut,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  X,
  Edit2,
  Check,
  Link as LinkIcon,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cloud,
  Star,
  FolderPlus,
  Tag,
  Layers,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    isAdminAuthenticated,
    adminUser,
    authLoading,
    logoutAdmin,
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
    seedInitialDataToFirebase,
    firebaseStatus,
    firebaseErrorMsg,
    isFirebaseConfigured,
  } = useData();

  const [tab, setTab] = useState("products");
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState(null);

  const handleSeedFirebase = async () => {
    if (!window.confirm("გსურთ საწყისი კატალოგის და პროექტების Firebase-ში ატვირთვა?")) return;
    setIsSeeding(true);
    const res = await seedInitialDataToFirebase();
    setIsSeeding(false);
    setSeedNotice(res.message);
    setTimeout(() => setSeedNotice(null), 6000);
  };

  // Editing state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Form states
  const [newProd, setNewProd] = useState({
    name: "",
    category: "steps",
    categoryLabel: "საფეხურები",
    price: "",
    priceUnit: "₾ / ცალი",
    shortDesc: "",
    description: "",
    dimensions: "",
    weight: "",
    concreteGrade: "B35",
    frostResistance: "F300",
    surface: "ქვიშაჭავლური",
    image: "",
    images: [],
  });

  const [tempProductUrl, setTempProductUrl] = useState("");

  const [newCat, setNewCat] = useState({
    title: "",
    label: "",
    id: "",
    description: "",
    badge: "",
    image: "",
  });
  const [catImageMode, setCatImageMode] = useState("file");
  const catFileInputRef = useRef(null);

  const [newProj, setNewProj] = useState({
    title: "",
    location: "",
    year: new Date().getFullYear().toString(),
    scope: "",
    client: "",
    duration: "",
    concreteGrade: "B40",
    description: "",
    challenge: "",
    solution: "",
    image: "",
    images: [],
  });

  const [tempProjectUrl, setTempProjectUrl] = useState("");
  const [productImageMode, setProductImageMode] = useState("file"); // 'file' | 'url'
  const [projectImageMode, setProjectImageMode] = useState("file"); // 'file' | 'url'

  const productFileInputRef = useRef(null);
  const projectFileInputRef = useRef(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-400 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">მოწმდება ავტორიზაცია...</span>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // Compress & convert file to data URL
  const processImageFile = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to optimized high quality JPEG (40-70KB per photo)
        const compressedUrl = canvas.toDataURL("image/jpeg", 0.75);
        callback(compressedUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Multi-image upload for products
  const handleProductFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let processedCount = 0;
    const newImgs = [];

    files.forEach((file) => {
      processImageFile(file, (dataUrl) => {
        newImgs.push(dataUrl);
        processedCount++;
        if (processedCount === files.length) {
          setNewProd((prev) => {
            const currentImages =
              Array.isArray(prev.images) && prev.images.length > 0
                ? prev.images
                : prev.image
                ? [prev.image]
                : [];
            const updated = [...currentImages, ...newImgs];
            return {
              ...prev,
              images: updated,
              image: updated[0] || "",
            };
          });
          if (productFileInputRef.current) productFileInputRef.current.value = "";
        }
      });
    });
  };

  const handleAddProductImageUrl = () => {
    if (!tempProductUrl.trim()) return;
    setNewProd((prev) => {
      const currentImages =
        Array.isArray(prev.images) && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];
      const updated = [...currentImages, tempProductUrl.trim()];
      return {
        ...prev,
        images: updated,
        image: updated[0] || "",
      };
    });
    setTempProductUrl("");
  };

  const handleRemoveProductImage = (indexToRemove) => {
    setNewProd((prev) => {
      const currentImages =
        Array.isArray(prev.images) && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];
      const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated[0] || "",
      };
    });
  };

  const handleSetMainProductImage = (indexToMain) => {
    setNewProd((prev) => {
      const currentImages =
        Array.isArray(prev.images) && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];
      if (indexToMain === 0 || !currentImages[indexToMain]) return prev;
      const target = currentImages[indexToMain];
      const rest = currentImages.filter((_, idx) => idx !== indexToMain);
      const reordered = [target, ...rest];
      return {
        ...prev,
        images: reordered,
        image: reordered[0] || "",
      };
    });
  };

  const handleProjectFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let processedCount = 0;
    const newImgs = [];

    files.forEach((file) => {
      processImageFile(file, (dataUrl) => {
        newImgs.push(dataUrl);
        processedCount++;
        if (processedCount === files.length) {
          setNewProj((prev) => {
            const currentImages =
              Array.isArray(prev.images) && prev.images.length > 0
                ? prev.images
                : prev.image
                ? [prev.image]
                : [];
            const updated = [...currentImages, ...newImgs];
            return {
              ...prev,
              images: updated,
              image: updated[0] || "",
            };
          });
          if (projectFileInputRef.current) projectFileInputRef.current.value = "";
        }
      });
    });
  };

  const handleAddProjectImageUrl = () => {
    if (!tempProjectUrl.trim()) return;
    setNewProj((prev) => {
      const currentImages =
        Array.isArray(prev.images) && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];
      const updated = [...currentImages, tempProjectUrl.trim()];
      return {
        ...prev,
        images: updated,
        image: updated[0] || "",
      };
    });
    setTempProjectUrl("");
  };

  const handleRemoveProjectImage = (indexToRemove) => {
    setNewProj((prev) => {
      const currentImages =
        Array.isArray(prev.images) && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];
      const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated[0] || "",
      };
    });
  };

  const handleSetMainProjectImage = (indexToMain) => {
    setNewProj((prev) => {
      const currentImages =
        Array.isArray(prev.images) && prev.images.length > 0
          ? prev.images
          : prev.image
          ? [prev.image]
          : [];
      if (indexToMain === 0 || !currentImages[indexToMain]) return prev;
      const target = currentImages[indexToMain];
      const rest = currentImages.filter((_, idx) => idx !== indexToMain);
      const reordered = [target, ...rest];
      return {
        ...prev,
        images: reordered,
        image: reordered[0] || "",
      };
    });
  };

  const handleCatFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setNewCat((prev) => ({ ...prev, image: dataUrl }));
      });
    }
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!newCat.title.trim()) {
      alert("გთხოვთ მიუთითოთ კატეგორიის დასახელება!");
      return;
    }

    const slug =
      newCat.id?.trim() ||
      newCat.title
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-") ||
      `cat-${Date.now()}`;

    const catPayload = {
      ...newCat,
      id: slug,
      label: newCat.label || newCat.title,
      badge: newCat.badge || newCat.label || newCat.title,
    };

    if (editingCategoryId) {
      updateCategory(editingCategoryId, catPayload);
      setEditingCategoryId(null);
    } else {
      addCategory(catPayload);
    }

    setNewCat({
      title: "",
      label: "",
      id: "",
      description: "",
      badge: "",
      image: "",
    });
    if (catFileInputRef.current) catFileInputRef.current.value = "";
  };

  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setNewCat({
      title: cat.title || "",
      label: cat.label || "",
      id: cat.id || "",
      description: cat.description || "",
      badge: cat.badge || "",
      image: cat.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setNewCat({
      title: "",
      label: "",
      id: "",
      description: "",
      badge: "",
      image: "",
    });
    if (catFileInputRef.current) catFileInputRef.current.value = "";
  };

  const handleDeleteCategory = (catId, catTitle) => {
    const productsInCat = products.filter((p) => p.category === catId).length;
    let msg = `ნამდვილად გსურთ კატეგორიის "${catTitle}" წაშლა?`;
    if (productsInCat > 0) {
      msg = `ყურადღება! ამ კატეგორიაში არის ${productsInCat} პროდუქტი. წაშლის შემთხვევაში პროდუქტებს კატეგორია აღარ ექნებათ. გსურთ გაგრძელება?`;
    }
    if (confirm(msg)) {
      deleteCategory(catId);
    }
  };

  // Product submit (Add or Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const allImages =
      Array.isArray(newProd.images) && newProd.images.length > 0
        ? newProd.images
        : newProd.image
        ? [newProd.image]
        : [];

    if (allImages.length === 0) {
      alert("გთხოვთ ატვირთოთ მინიმუმ ერთი სურათი პროდუქტისთვის!");
      return;
    }

    const categoryObj = (categories || []).find((c) => c.id === newProd.category);
    const prodPayload = {
      ...newProd,
      image: allImages[0],
      images: allImages,
      categoryLabel: categoryObj ? categoryObj.label : newProd.categoryLabel,
      price: newProd.price ? Number(newProd.price) : 0,
    };

    if (editingProductId) {
      updateProduct(editingProductId, prodPayload);
      setEditingProductId(null);
    } else {
      addProduct(prodPayload);
    }

    // Reset
    setNewProd({
      name: "",
      category: categories?.[0]?.id || "steps",
      categoryLabel: categories?.[0]?.label || "საფეხურები",
      price: "",
      priceUnit: "₾ / ცალი",
      shortDesc: "",
      description: "",
      dimensions: "",
      weight: "",
      concreteGrade: "B35",
      frostResistance: "F300",
      surface: "ქვიშაჭავლური",
      image: "",
      images: [],
    });
    setTempProductUrl("");
    if (productFileInputRef.current) productFileInputRef.current.value = "";
  };

  const startEditProduct = (item) => {
    setEditingProductId(item.id);
    const itemImages =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : item.image
        ? [item.image]
        : [];
    setNewProd({
      name: item.name || "",
      category: item.category || "steps",
      categoryLabel: item.categoryLabel || "საფეხურები",
      price: item.price !== undefined && item.price !== null ? item.price.toString() : "",
      priceUnit: item.priceUnit || "₾ / ცალი",
      shortDesc: item.shortDesc || "",
      description: item.description || "",
      dimensions: item.dimensions || "",
      weight: item.weight || "",
      concreteGrade: item.concreteGrade || "B35",
      frostResistance: item.frostResistance || "F300",
      surface: item.surface || "ქვიშაჭავლური",
      image: itemImages[0] || "",
      images: itemImages,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setNewProd({
      name: "",
      category: categories?.[0]?.id || "steps",
      categoryLabel: categories?.[0]?.label || "საფეხურები",
      price: "",
      priceUnit: "₾ / ცალი",
      shortDesc: "",
      description: "",
      dimensions: "",
      weight: "",
      concreteGrade: "B35",
      frostResistance: "F300",
      surface: "ქვიშაჭავლური",
      image: "",
      images: [],
    });
    setTempProductUrl("");
    if (productFileInputRef.current) productFileInputRef.current.value = "";
  };

  // Project submit (Add or Edit)
  const handleSaveProject = (e) => {
    e.preventDefault();
    const allImages =
      Array.isArray(newProj.images) && newProj.images.length > 0
        ? newProj.images
        : newProj.image
        ? [newProj.image]
        : [];

    if (allImages.length === 0) {
      alert("გთხოვთ ატვირთოთ ან მიუთითოთ პროექტის სურათი!");
      return;
    }

    const payload = {
      ...newProj,
      image: allImages[0],
      images: allImages,
    };

    if (editingProjectId) {
      updateProject(editingProjectId, payload);
      setEditingProjectId(null);
    } else {
      addProject(payload);
    }

    // Reset
    setNewProj({
      title: "",
      location: "",
      year: new Date().getFullYear().toString(),
      scope: "",
      client: "",
      duration: "",
      concreteGrade: "B40",
      description: "",
      challenge: "",
      solution: "",
      image: "",
      images: [],
    });
    setTempProjectUrl("");
    if (projectFileInputRef.current) projectFileInputRef.current.value = "";
  };

  const startEditProject = (item) => {
    setEditingProjectId(item.id);
    const itemImages =
      Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : item.image
        ? [item.image]
        : [];
    setNewProj({
      title: item.title || "",
      location: item.location || "",
      year: item.year || new Date().getFullYear().toString(),
      scope: item.scope || "",
      client: item.client || "",
      duration: item.duration || "",
      concreteGrade: item.concreteGrade || "B40",
      description: item.description || "",
      challenge: item.challenge || "",
      solution: item.solution || "",
      image: itemImages[0] || "",
      images: itemImages,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setNewProj({
      title: "",
      location: "",
      year: new Date().getFullYear().toString(),
      scope: "",
      client: "",
      duration: "",
      concreteGrade: "B40",
      description: "",
      challenge: "",
      solution: "",
      image: "",
      images: [],
    });
    setTempProjectUrl("");
    if (projectFileInputRef.current) projectFileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Admin Navbar */}
      <header className="border-b border-stone-800 bg-stone-900 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>MONOLITH</span>
            <span className="text-xs bg-stone-800 text-stone-300 font-mono px-2 py-0.5 rounded">
              /admin
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-4">
          {adminUser?.email && (
            <span className="text-xs text-stone-300 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 font-mono hidden sm:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {adminUser.email}
            </span>
          )}
          <Link
            to="/"
            className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-lg transition"
          >
            საიტზე გადასვლა <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={logoutAdmin}
            className="text-xs bg-stone-800 hover:bg-red-900/60 text-stone-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> გასვლა
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="max-w-[1720px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Firebase Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                firebaseStatus === "connected"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : firebaseStatus === "error"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-stone-800 text-stone-400 border border-stone-700"
              }`}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm font-bold text-white">Google Cloud Firestore:</span>
                {firebaseStatus === "connected" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    აქტიურია (ცოცხალი სინქრონიზაცია)
                  </span>
                )}
                {firebaseStatus === "connecting" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    უკავშირდება...
                  </span>
                )}
                {firebaseStatus === "error" && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    ბაზა საჭიროებს შექმნას
                  </span>
                )}
                {firebaseStatus === "disabled" && (
                  <span className="text-xs text-stone-400">გათიშულია</span>
                )}
              </div>
              <div className="text-xs text-stone-300 mt-1 max-w-2xl">
                {firebaseStatus === "connected" ? (
                  <p className="text-stone-400">
                    პროდუქცია, პროექტები და მოთხოვნები რეალურ დროში ინახება თქვენს Firebase Cloud ბაზაში.
                  </p>
                ) : firebaseStatus === "error" ? (
                  <div className="space-y-1 text-amber-300/90">
                    <p>{firebaseErrorMsg}</p>
                    <a
                      href="https://console.firebase.google.com/project/concreteproducts-46cf3/firestore"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-white font-bold underline hover:text-amber-300 text-[11px]"
                    >
                      დააჭირეთ აქ Firebase Console-ში გადასასვლელად (Create Database) <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <p className="text-stone-400">Firebase პარამეტრები ინტეგრირებულია.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {seedNotice && (
              <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
                {seedNotice}
              </span>
            )}
            <button
              onClick={handleSeedFirebase}
              disabled={isSeeding || firebaseStatus === "disabled"}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-xs font-medium text-stone-200 hover:text-white rounded-xl border border-stone-700/80 flex items-center gap-2 transition"
              title="ატვირთავს საწყის კატალოგს Firebase-ში, თუ ბაზა ჯერ ცარიელია"
            >
              <Database className={`w-3.5 h-3.5 text-amber-400 ${isSeeding ? "animate-spin" : ""}`} />
              {isSeeding ? "იტვირთება..." : "კატალოგის Firebase-ში ატვირთვა"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-800 pb-4">
          <button
            onClick={() => setTab("products")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "products"
                ? "bg-white text-stone-950 font-bold shadow-sm"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            პროდუქცია ({products.length})
          </button>
          <button
            onClick={() => setTab("categories")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "categories"
                ? "bg-white text-stone-950 font-bold shadow-sm"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            კატეგორიები ({(categories || []).length})
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "projects"
                ? "bg-white text-stone-950 font-bold shadow-sm"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            შესრულებული სამუშაოები ({projects.length})
          </button>
          <button
            onClick={() => setTab("inquiries")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === "inquiries"
                ? "bg-white text-stone-950 font-bold shadow-sm"
                : "bg-stone-900 text-stone-300 hover:bg-stone-800"
            }`}
          >
            შემოსული მოთხოვნები ({inquiries.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS */}
        {tab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <form
              onSubmit={handleSaveProduct}
              className="lg:col-span-5 bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4 h-fit sticky top-24"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h2 className="font-bold text-white flex items-center gap-2 text-base">
                  {editingProductId ? (
                    <>
                      <Edit2 className="w-4 h-4 text-amber-400" />
                      <span>პროდუქტის რედაქტირება</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-white" />
                      <span>ახალი პროდუქტის დამატება</span>
                    </>
                  )}
                </h2>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={cancelEditProduct}
                    className="text-xs text-stone-400 hover:text-white"
                  >
                    გაუქმება
                  </button>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <label className="text-xs text-stone-400 block mb-1 font-medium">
                  დასახელება *
                </label>
                <input
                  required
                  placeholder="მაგ: მონოლითური საფეხური L-120"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    კატეგორია *
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) => {
                      const selCat = (categories || []).find((c) => c.id === e.target.value);
                      setNewProd({
                        ...newProd,
                        category: e.target.value,
                        categoryLabel: selCat ? selCat.label : e.target.value,
                      });
                    }}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-stone-500"
                  >
                    {(categories || []).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title} ({cat.label})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    ფასი (₾)
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      placeholder="მაგ: 145"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="w-1/2 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-stone-500"
                    />
                    <input
                      placeholder="₾ / ცალი"
                      value={newProd.priceUnit}
                      onChange={(e) => setNewProd({ ...newProd, priceUnit: e.target.value })}
                      className="w-1/2 bg-stone-950 border border-stone-800 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-stone-500"
                    />
                  </div>
                </div>
              </div>

              {/* IMAGE UPLOAD ZONE (Multi-image from Computer/Phone or URL) */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>პროდუქტის სურათები *</span>
                    {(newProd.images?.length > 0 || newProd.image) && (
                      <span className="text-[11px] text-amber-400 font-normal">
                        ({newProd.images?.length || (newProd.image ? 1 : 0)} ფოტო)
                      </span>
                    )}
                  </label>
                  <div className="flex gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setProductImageMode("file")}
                      className={`px-2.5 py-1 rounded-md transition ${
                        productImageMode === "file"
                          ? "bg-stone-800 text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      ატვირთვა
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductImageMode("url")}
                      className={`px-2.5 py-1 rounded-md transition ${
                        productImageMode === "url"
                          ? "bg-stone-800 text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {/* Upload from Computer / Phone (supports selecting multiple files) */}
                {productImageMode === "file" ? (
                  <div>
                    <input
                      type="file"
                      ref={productFileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleProductFileChange}
                      className="hidden"
                      id="product-file-upload"
                    />
                    <label
                      htmlFor="product-file-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-stone-700 hover:border-stone-500 rounded-xl p-4 cursor-pointer transition bg-stone-900/50 hover:bg-stone-900 text-center"
                    >
                      <Upload className="w-6 h-6 text-stone-400 mb-2" />
                      <span className="text-xs font-bold text-white">
                        დააჭირეთ ფოტოების ასარჩევად
                      </span>
                      <span className="text-[11px] text-stone-400 mt-0.5">
                        შეგიძლიათ აირჩიოთ რამდენიმე ფოტო ერთდროულად (კომპიუტერიდან ან ტელეფონის გალერეიდან)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      placeholder="ჩასვით სურათის ლინკი (URL)"
                      value={tempProductUrl}
                      onChange={(e) => setTempProductUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddProductImageUrl();
                        }
                      }}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-stone-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddProductImageUrl}
                      className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-bold text-white rounded-xl shrink-0 transition"
                    >
                      + დამატება
                    </button>
                  </div>
                )}

                {/* Uploaded Images Gallery Grid Preview */}
                {(newProd.images?.length > 0 || newProd.image) && (
                  <div className="space-y-2 pt-2 border-t border-stone-800/80">
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>ატვირთული ფოტოები (პირველია მთავარი):</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {(newProd.images?.length > 0 ? newProd.images : [newProd.image]).map(
                        (img, idx) => (
                          <div
                            key={idx}
                            className={`relative group rounded-xl overflow-hidden border aspect-square bg-stone-900 transition-all ${
                              idx === 0
                                ? "border-amber-500/80 ring-2 ring-amber-500/30"
                                : "border-stone-800 hover:border-stone-600"
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Main photo indicator / Action */}
                            {idx === 0 ? (
                              <span className="absolute top-1 left-1 bg-amber-500 text-stone-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-stone-950" /> მთავარი
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetMainProductImage(idx)}
                                className="absolute top-1 left-1 bg-black/80 hover:bg-amber-500 hover:text-stone-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow"
                                title="მთავარ ფოტოდ დაყენება"
                              >
                                მთავარი
                              </button>
                            )}

                            {/* Delete single image */}
                            <button
                              type="button"
                              onClick={() => handleRemoveProductImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-600 text-white rounded-full transition shadow"
                              title="ფოტოს წაშლა"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      )}

                      {/* Add more button tile */}
                      <button
                        type="button"
                        onClick={() => productFileInputRef.current?.click()}
                        className="rounded-xl border-2 border-dashed border-stone-800 hover:border-stone-600 flex flex-col items-center justify-center p-2 text-stone-400 hover:text-white transition aspect-square bg-stone-900/40 hover:bg-stone-900"
                        title="მეტი ფოტოს დამატება"
                      >
                        <Plus className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px] font-medium">+ დამატება</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dimensions & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">ზომები</label>
                  <input
                    placeholder="მაგ: 120 x 35 x 15 სმ"
                    value={newProd.dimensions}
                    onChange={(e) => setNewProd({ ...newProd, dimensions: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">წონა</label>
                  <input
                    placeholder="მაგ: 145 კგ"
                    value={newProd.weight}
                    onChange={(e) => setNewProd({ ...newProd, weight: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Specs: Grade & Frost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">ბეტონის მარკა</label>
                  <input
                    placeholder="B35 (M450)"
                    value={newProd.concreteGrade}
                    onChange={(e) => setNewProd({ ...newProd, concreteGrade: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">ყინვაგამძლეობა</label>
                  <input
                    placeholder="F300"
                    value={newProd.frostResistance}
                    onChange={(e) => setNewProd({ ...newProd, frostResistance: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="text-xs text-stone-400 block mb-1">მოკლე აღწერა</label>
                <input
                  placeholder="მოკლე შეჯამება ბარათისთვის"
                  value={newProd.shortDesc}
                  onChange={(e) => setNewProd({ ...newProd, shortDesc: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">სრული აღწერა</label>
                <textarea
                  placeholder="დეტალური ტექნიკური დანიშნულება"
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-stone-200 text-stone-950 font-bold py-3 rounded-xl text-sm transition shadow-md"
              >
                {editingProductId ? "ცვლილებების შენახვა" : "პროდუქტის დამატება"}
              </button>
            </form>

            {/* Right Column: Existing Products List */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                  არსებული პროდუქცია ({products.length})
                </span>
              </div>

              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-900 border border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-stone-700 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl bg-stone-800 border border-stone-700"
                      />
                      {item.images && item.images.length > 1 && (
                        <span className="absolute -bottom-1 -right-1 bg-stone-950/90 border border-stone-700 text-amber-400 text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow flex items-center gap-0.5">
                          <ImageIcon className="w-2.5 h-2.5" />
                          {item.images.length}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-medium">
                          {item.categoryLabel}
                        </span>
                        <h4 className="font-bold text-white text-sm sm:text-base truncate">
                          {item.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white font-extrabold text-sm">
                          {item.price ? `${item.price} ₾` : "ფასი შეთანხმებით"}
                        </span>
                        {item.priceUnit && (
                          <span className="text-xs text-stone-400">{item.priceUnit}</span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-1 truncate">
                        {item.dimensions} • {item.weight}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEditProduct(item)}
                      className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
                      title="რედაქტირება"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`წავშალოთ პროდუქტი "${item.name}"?`)) {
                          deleteProduct(item.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition"
                      title="წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {tab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <form
              onSubmit={handleSaveCategory}
              className="lg:col-span-5 bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4 h-fit sticky top-24"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h2 className="font-bold text-white flex items-center gap-2 text-base">
                  {editingCategoryId ? (
                    <>
                      <Edit2 className="w-4 h-4 text-amber-400" />
                      <span>კატეგორიის რედაქტირება</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4 text-white" />
                      <span>ახალი კატეგორიის დამატება</span>
                    </>
                  )}
                </h2>
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={cancelEditCategory}
                    className="text-xs text-stone-400 hover:text-white"
                  >
                    გაუქმება
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1 font-medium">
                  სრული სათაური *
                </label>
                <input
                  required
                  placeholder="მაგ: მონოლითური საფეხურები"
                  value={newCat.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug =
                      !editingCategoryId && !newCat.id
                        ? val
                            .toLowerCase()
                            .replace(/[^a-z0-9]/gi, "-")
                            .replace(/-+/g, "-")
                        : newCat.id;
                    setNewCat({
                      ...newCat,
                      title: val,
                      label: newCat.label || val,
                      id: autoSlug,
                    });
                  }}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    მოკლე იარლიყი (Tab) *
                  </label>
                  <input
                    required
                    placeholder="მაგ: საფეხურები"
                    value={newCat.label}
                    onChange={(e) => setNewCat({ ...newCat, label: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    იდენტიფიკატორი (ID/Slug)
                  </label>
                  <input
                    placeholder="მაგ: steps"
                    value={newCat.id}
                    onChange={(e) =>
                      setNewCat({
                        ...newCat,
                        id: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      })
                    }
                    disabled={!!editingCategoryId}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1 font-medium">
                  ბეიჯი / მინიშნება (არასავალდებულო)
                </label>
                <input
                  placeholder="მაგ: პრემიუმ არქიტექტურა"
                  value={newCat.badge}
                  onChange={(e) => setNewCat({ ...newCat, badge: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Category Image */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>კატეგორიის ქავერი / სურათი</span>
                  </label>
                  <div className="flex gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setCatImageMode("file")}
                      className={`px-2.5 py-1 rounded-md transition ${
                        catImageMode === "file"
                          ? "bg-stone-800 text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      ატვირთვა
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatImageMode("url")}
                      className={`px-2.5 py-1 rounded-md transition ${
                        catImageMode === "url"
                          ? "bg-stone-800 text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {catImageMode === "file" ? (
                  <div>
                    <input
                      type="file"
                      ref={catFileInputRef}
                      accept="image/*"
                      onChange={handleCatFileChange}
                      className="hidden"
                      id="category-file-upload"
                    />
                    <label
                      htmlFor="category-file-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-stone-700 hover:border-stone-500 rounded-xl p-4 cursor-pointer transition bg-stone-900/50 hover:bg-stone-900 text-center"
                    >
                      <Upload className="w-6 h-6 text-stone-400 mb-2" />
                      <span className="text-xs font-bold text-white">
                        დააჭირეთ სურათის ასარჩევად
                      </span>
                      <span className="text-[11px] text-stone-400 mt-0.5">
                        კომპიუტერიდან ან ტელეფონიდან
                      </span>
                    </label>
                  </div>
                ) : (
                  <div>
                    <input
                      placeholder="ჩასვით სურათის პირდაპირი ბმული (URL)"
                      value={newCat.image}
                      onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                )}

                {newCat.image && (
                  <div className="relative mt-2 rounded-xl overflow-hidden border border-stone-700 aspect-video bg-black/40">
                    <img
                      src={newCat.image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewCat({ ...newCat, image: "" });
                        if (catFileInputRef.current) catFileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-red-600 text-white rounded-full transition shadow-md"
                      title="სურათის წაშლა"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded backdrop-blur">
                      ქავერი არჩეულია
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">მოკლე აღწერა</label>
                <textarea
                  placeholder="რას მოიცავს ეს კატეგორია..."
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-stone-200 text-stone-950 font-bold py-3 rounded-xl text-sm transition shadow-md"
              >
                {editingCategoryId ? "ცვლილებების შენახვა" : "კატეგორიის დამატება"}
              </button>
            </form>

            {/* Right Column: Existing Categories List */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                  აქტიური კატეგორიები ({(categories || []).length})
                </span>
              </div>

              {(categories || []).map((cat) => {
                const prodCount = products.filter((p) => p.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-stone-900 border border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-stone-700 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0 bg-stone-800 border border-stone-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-500">
                          <Layers className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base truncate">
                            {cat.title}
                          </h4>
                          <span className="text-[10px] bg-stone-800 text-stone-400 font-mono px-2 py-0.5 rounded">
                            {cat.id}
                          </span>
                        </div>
                        <p className="text-xs text-amber-400 mt-0.5 font-medium">
                          იარლიყი: {cat.label} • {prodCount} პროდუქტი
                        </p>
                        {cat.description && (
                          <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEditCategory(cat)}
                        className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
                        title="რედაქტირება"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.title)}
                        className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition"
                        title="წაშლა"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETED PROJECTS */}
        {tab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <form
              onSubmit={handleSaveProject}
              className="lg:col-span-5 bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4 h-fit sticky top-24"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h2 className="font-bold text-white flex items-center gap-2 text-base">
                  {editingProjectId ? (
                    <>
                      <Edit2 className="w-4 h-4 text-amber-400" />
                      <span>პროექტის რედაქტირება</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-white" />
                      <span>ახალი პროექტის დამატება</span>
                    </>
                  )}
                </h2>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={cancelEditProject}
                    className="text-xs text-stone-400 hover:text-white"
                  >
                    გაუქმება
                  </button>
                )}
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1 font-medium">
                  პროექტის სათაური *
                </label>
                <input
                  required
                  placeholder="მაგ: სასტუმრო კომპლექსის ტერასა"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    ლოკაცია *
                  </label>
                  <input
                    required
                    placeholder="მაგ: ბათუმი"
                    value={newProj.location}
                    onChange={(e) => setNewProj({ ...newProj, location: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">წელი</label>
                  <input
                    required
                    placeholder="2024"
                    value={newProj.year}
                    onChange={(e) => setNewProj({ ...newProj, year: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    დამკვეთი / ობიექტი
                  </label>
                  <input
                    placeholder="მაგ: Silk Road Group"
                    value={newProj.client}
                    onChange={(e) => setNewProj({ ...newProj, client: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    შესრულების ვადა
                  </label>
                  <input
                    placeholder="მაგ: 35 კალენდარული დღე"
                    value={newProj.duration}
                    onChange={(e) => setNewProj({ ...newProj, duration: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    შესრულებული მოცულობა
                  </label>
                  <input
                    placeholder="მაგ: 650 მ² ფილები"
                    value={newProj.scope}
                    onChange={(e) => setNewProj({ ...newProj, scope: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    ბეტონის მარკა
                  </label>
                  <input
                    placeholder="მაგ: B40 W8 F300"
                    value={newProj.concreteGrade}
                    onChange={(e) => setNewProj({ ...newProj, concreteGrade: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* PROJECT IMAGE UPLOAD ZONE (Multi-image from Computer/Phone or URL) */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>პროექტის ფოტოები *</span>
                    {(newProj.images?.length > 0 || newProj.image) && (
                      <span className="text-[11px] text-amber-400 font-normal">
                        ({newProj.images?.length || (newProj.image ? 1 : 0)} ფოტო)
                      </span>
                    )}
                  </label>
                  <div className="flex gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setProjectImageMode("file")}
                      className={`px-2.5 py-1 rounded-md transition ${
                        projectImageMode === "file"
                          ? "bg-stone-800 text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      კომპიუტერიდან / ტელეფონიდან
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectImageMode("url")}
                      className={`px-2.5 py-1 rounded-md transition ${
                        projectImageMode === "url"
                          ? "bg-stone-800 text-white font-bold"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {projectImageMode === "file" ? (
                  <div>
                    <input
                      type="file"
                      ref={projectFileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleProjectFileChange}
                      className="hidden"
                      id="project-file-upload"
                    />
                    <label
                      htmlFor="project-file-upload"
                      className="flex flex-col items-center justify-center border-2 border-dashed border-stone-700 hover:border-amber-500/50 rounded-xl p-5 cursor-pointer transition bg-stone-900/40 hover:bg-stone-900 text-center"
                    >
                      <Upload className="w-6 h-6 text-stone-400 mb-1.5" />
                      <span className="text-xs font-bold text-white">
                        დააჭირეთ ფოტოების ასარჩევად
                      </span>
                      <span className="text-[11px] text-stone-400 mt-0.5">
                        შეგიძლიათ ერთდროულად მონიშნოთ რამდენიმე ფოტო
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      placeholder="ჩასვით სურათის პირდაპირი ბმული (URL)"
                      value={tempProjectUrl}
                      onChange={(e) => setTempProjectUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddProjectImageUrl();
                        }
                      }}
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-stone-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddProjectImageUrl}
                      className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl transition"
                    >
                      დამატება
                    </button>
                  </div>
                )}

                {/* Previews Grid */}
                {((newProj.images && newProj.images.length > 0) || newProj.image) && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] text-stone-400 block font-medium">
                      ატვირთული ფოტოები (პირველი ფოტო არის მთავარი ქავერი):
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {(newProj.images?.length > 0
                        ? newProj.images
                        : [newProj.image]
                      ).map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative group rounded-lg overflow-hidden border aspect-video bg-black/40 ${
                            idx === 0
                              ? "border-amber-400 ring-1 ring-amber-400"
                              : "border-stone-700 hover:border-stone-500"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetMainProjectImage(idx)}
                                title="მთავარ ფოტოდ დაყენება"
                                className="p-1 bg-amber-500/90 hover:bg-amber-500 text-stone-950 rounded"
                              >
                                <Star className="w-3 h-3 fill-current" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveProjectImage(idx)}
                              title="ფოტოს წაშლა"
                              className="p-1 bg-red-600/90 hover:bg-red-600 text-white rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 text-[9px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded shadow">
                              ქავერი
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">
                  პროექტის ზოგადი აღწერა
                </label>
                <textarea
                  placeholder="მოკლე შესავალი პროექტის შესახებ..."
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    საინჟინრო გამოწვევა
                  </label>
                  <textarea
                    placeholder="რა სირთულეები და მოთხოვნები ჰქონდა ობიექტს..."
                    value={newProj.challenge}
                    onChange={(e) => setNewProj({ ...newProj, challenge: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1 font-medium">
                    მიღებული გადაწყვეტა (როგორ გაკეთდა)
                  </label>
                  <textarea
                    placeholder="როგორ გადაიჭრა საინჟინრო მეთოდოლოგიით..."
                    value={newProj.solution}
                    onChange={(e) => setNewProj({ ...newProj, solution: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                    rows={2}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-stone-200 text-stone-950 font-bold py-3 rounded-xl text-sm transition shadow-md"
              >
                {editingProjectId ? "ცვლილებების შენახვა" : "პროექტის დამატება"}
              </button>
            </form>

            {/* Right Column: Existing Projects List */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                  შესრულებული სამუშაოები ({projects.length})
                </span>
              </div>

              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-stone-900 border border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-stone-700 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={proj.images?.[0] || proj.image}
                        alt={proj.title}
                        className="w-16 h-16 object-cover rounded-xl bg-stone-800 border border-stone-700"
                      />
                      {proj.images && proj.images.length > 1 && (
                        <span className="absolute -bottom-1 -right-1 bg-stone-950/90 border border-stone-700 text-amber-400 text-[10px] font-bold px-1.5 py-0.2 rounded-md shadow flex items-center gap-0.5">
                          <ImageIcon className="w-2.5 h-2.5" />
                          {proj.images.length}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm sm:text-base truncate">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-amber-400 mt-0.5 font-medium">
                        {proj.location} • {proj.year} {proj.client ? `• ${proj.client}` : ""}
                      </p>
                      <p className="text-xs text-stone-400 mt-1 truncate">
                        მოცულობა: {proj.scope}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      to={`/portfolio/${proj.id}`}
                      target="_blank"
                      className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition"
                      title="სრული გვერდის ნახვა"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => startEditProject(proj)}
                      className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
                      title="რედაქტირება"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`წავშალოთ პროექტი "${proj.title}"?`)) {
                          deleteProject(proj.id);
                        }
                      }}
                      className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition"
                      title="წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INQUIRIES */}
        {tab === "inquiries" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                მომხმარებელთა მოთხოვნები ({inquiries.length})
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-16 bg-stone-900 border border-stone-800 rounded-2xl">
                <p className="text-stone-400">შემოსული მოთხოვნები ჯერ არ არის</p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="bg-stone-900 border border-stone-800 p-5 rounded-2xl"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base">{inq.name}</h4>
                      <a
                        href={`tel:${inq.phone}`}
                        className="text-sm font-semibold text-amber-400 hover:underline mt-1 inline-block"
                      >
                        ტელ: {inq.phone}
                      </a>
                      {inq.productName && (
                        <p className="text-xs text-blue-400 mt-1">
                          დაინტერესებული პროდუქტი: <strong>{inq.productName}</strong>
                        </p>
                      )}
                      {inq.source && (
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          წყარო: {inq.source}
                        </span>
                      )}
                      {inq.comment && (
                        <p className="text-xs text-stone-300 mt-2 bg-stone-950 p-3 rounded-xl border border-stone-800 leading-relaxed">
                          {inq.comment}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-stone-500 font-mono">
                      {inq.createdAt
                        ? new Date(inq.createdAt).toLocaleString("ka-GE")
                        : ""}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
