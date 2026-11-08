import React, { useState, useRef } from "react";
import { useData } from "../../context/DataContext";
import { HERO_SLIDES } from "../../data/initialData";
import {
  Sparkles,
  Snowflake,
  ShieldCheck,
  Compass,
  Award,
  Building2,
  Clock,
  Droplet,
  Leaf,
  Zap,
  CheckCircle2,
  Flame,
  Layers,
  Trash2,
  Plus,
  RotateCcw,
  Save,
  Check,
  Upload,
  ArrowUp,
  ArrowDown,
  Copy,
  ExternalLink,
  Eye,
  Info,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";

export const FEATURE_ICONS_LIST = [
  { id: "Snowflake", icon: Snowflake, label: "❄️ ყინვაგამძლეობა (Snowflake)" },
  { id: "ShieldCheck", icon: ShieldCheck, label: "🛡️ სიმტკიცე / დაცვა (ShieldCheck)" },
  { id: "Sparkles", icon: Sparkles, label: "✨ პიგმენტაცია / ბზინვარება (Sparkles)" },
  { id: "Compass", icon: Compass, label: "🧭 ყალიბები / დიზაინი (Compass)" },
  { id: "Award", icon: Award, label: "🏆 ხარისხი / პრემიუმი (Award)" },
  { id: "Building2", icon: Building2, label: "🏢 შენობა / დეველოპმენტი (Building2)" },
  { id: "Clock", icon: Clock, label: "⏱️ სისწრაფე / დრო (Clock)" },
  { id: "Droplet", icon: Droplet, label: "💧 წყალგაუმტარი (Droplet)" },
  { id: "Leaf", icon: Leaf, label: "🌿 ეკო / ბუნებრივი (Leaf)" },
  { id: "Zap", icon: Zap, label: "⚡ ენერგია / გამძლეობა (Zap)" },
  { id: "CheckCircle2", icon: CheckCircle2, label: "✅ გარანტია / სანდოობა (CheckCircle)" },
  { id: "Flame", icon: Flame, label: "🔥 ცეცხლგამძლე (Flame)" },
  { id: "Layers", icon: Layers, label: "📑 მონოლითი / ფენები (Layers)" },
];

export const getFeatureIcon = (iconName) => {
  const found = FEATURE_ICONS_LIST.find((item) => item.id === iconName);
  return found ? found.icon : Sparkles;
};

// Helper: compress image file to high-efficiency WebP/JPEG data URL
const compressHeroImage = (file, callback) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 1600;
      const MAX_HEIGHT = 1000;
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

      let compressedUrl;
      try {
        compressedUrl = canvas.toDataURL("image/webp", 0.85);
        if (!compressedUrl.startsWith("data:image/webp")) {
          compressedUrl = canvas.toDataURL("image/jpeg", 0.85);
        }
      } catch (err) {
        compressedUrl = canvas.toDataURL("image/jpeg", 0.85);
      }
      callback(compressedUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

export default function HomeSectionsManager() {
  const { siteSettings, updateSiteSettings } = useData();

  const [activeTab, setActiveTab] = useState("hero"); // "hero" | "features" | "trust"

  // 1. Hero Slides
  const [heroSlides, setHeroSlides] = useState(() => {
    if (Array.isArray(siteSettings?.heroSlides) && siteSettings.heroSlides.length > 0) {
      return JSON.parse(JSON.stringify(siteSettings.heroSlides));
    }
    return JSON.parse(JSON.stringify(HERO_SLIDES));
  });

  // 2. Why Choose Us (საწარმოო სტანდარტი)
  const [whyChooseUs, setWhyChooseUs] = useState(() => ({
    badge: siteSettings?.whyChooseUs?.badge || "საწარმოო სტანდარტი",
    title: siteSettings?.whyChooseUs?.title || "რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?",
    subtitle:
      siteSettings?.whyChooseUs?.subtitle ||
      "თითოეული ნაკეთობა გადის ვიბროჩამოსხმისა და თერმული გამოშრობის სრულ ტექნოლოგიურ ციკლს.",
    items: siteSettings?.whyChooseUs?.items
      ? JSON.parse(JSON.stringify(siteSettings.whyChooseUs.items))
      : [
          {
            id: "feat-1",
            icon: "Snowflake",
            title: "ყინვაგამძლეობა F300",
            description:
              "სპეციალური ჰიდროფობიური დანამატები გამორიცხავს წყლის შეწოვას და ბზარების გაჩენას მკაცრ ზამთარშიც.",
          },
          {
            id: "feat-2",
            icon: "ShieldCheck",
            title: "მაღალი სიმტკიცე (M500)",
            description:
              "ბაზალტისა და პოლიპროპილენის ფიბრო-ბოჭკოთი არმირებული სტრუქტურა უძლებს მაღალ სტატიკურ და დინამიკურ დატვირთვას.",
          },
          {
            id: "feat-3",
            icon: "Sparkles",
            title: "მდგრადი პიგმენტაცია",
            description:
              "ვიყენებთ გერმანულ (Bayferrox) მინერალურ პიგმენტებს, რომლებიც სრულ მასაშია შერეული და მზეზე არ ხუნდება.",
          },
          {
            id: "feat-4",
            icon: "Compass",
            title: "ინდივიდუალური ყალიბები",
            description:
              "სტანდარტული კატალოგის გარდა, ვამზადებთ არასტანდარტული ზომის საფეხურებსა და საყვავილეებს არქიტექტორის ნახაზით.",
          },
        ],
  }));

  // 3. Trust Section (ჩვენ გვენდობიან)
  const [trustSection, setTrustSection] = useState(() => ({
    badge: siteSettings?.trustSection?.badge || "სანდო პარტნიორობა",
    title:
      siteSettings?.trustSection?.title ||
      "ჩვენ გვენდობიან წამყვანი დეველოპერები & არქიტექტორები",
    subtitle:
      siteSettings?.trustSection?.subtitle ||
      "ჩვენი არქიტექტურული ბეტონის ნაკეთობები ამშვენებს პრემიუმ საცხოვრებელ კომპლექსებს, სასტუმროებსა და კერძო ვილებს.",
    stats: siteSettings?.trustSection?.stats
      ? JSON.parse(JSON.stringify(siteSettings.trustSection.stats))
      : [
          { id: "stat-1", value: "150+", label: "დასრულებული ობიექტი", highlight: false },
          { id: "stat-2", value: "15 000+", label: "მ² დაგებული ფილა", highlight: false },
          { id: "stat-3", value: "M500 / F300", label: "სერტიფიცირებული ბეტონი", highlight: true },
          { id: "stat-4", value: "10 წელი", label: "მასალის ოფიციალური გარანტია", highlight: false },
        ],
    partners: siteSettings?.trustSection?.partners
      ? JSON.parse(JSON.stringify(siteSettings.trustSection.partners))
      : [
          { id: "p-1", name: "ARCHI", role: "Development" },
          { id: "p-2", name: "m²", role: "Real Estate" },
          { id: "p-3", name: "SILK", role: "Development" },
          { id: "p-4", name: "ALLIANCE", role: "Group" },
          { id: "p-5", name: "ROOMS", role: "Hotels & Resorts" },
          { id: "p-6", name: "TBILISI HILLS", role: "Golf & Villas" },
          { id: "p-7", name: "RADISSON", role: "BLU Collection" },
          { id: "p-8", name: "DOMUS", role: "Architectural" },
        ],
  }));

  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Save everything to SiteSettings
  const handleSaveAll = async () => {
    setIsSaving(true);
    const updated = {
      ...siteSettings,
      heroSlides,
      whyChooseUs,
      trustSection,
    };
    await updateSiteSettings(updated);
    setIsSaving(false);
    setToast("მთავარი გვერდის პარამეტრები წარმატებით შეინახა!");
    setTimeout(() => setToast(null), 3500);
  };

  // Reset to initial defaults
  const handleResetDefaults = () => {
    if (!window.confirm("ნამდვილად გსურთ საწყის კონფიგურაციაზე დაბრუნება?")) return;
    setHeroSlides(JSON.parse(JSON.stringify(HERO_SLIDES)));
    setWhyChooseUs({
      badge: "საწარმოო სტანდარტი",
      title: "რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?",
      subtitle:
        "თითოეული ნაკეთობა გადის ვიბროჩამოსხმისა და თერმული გამოშრობის სრულ ტექნოლოგიურ ციკლს.",
      items: [
        {
          id: "feat-1",
          icon: "Snowflake",
          title: "ყინვაგამძლეობა F300",
          description:
            "სპეციალური ჰიდროფობიური დანამატები გამორიცხავს წყლის შეწოვას და ბზარების გაჩენას მკაცრ ზამთარშიც.",
        },
        {
          id: "feat-2",
          icon: "ShieldCheck",
          title: "მაღალი სიმტკიცე (M500)",
          description:
            "ბაზალტისა და პოლიპროპილენის ფიბრო-ბოჭკოთი არმირებული სტრუქტურა უძლებს მაღალ სტატიკურ და დინამიკურ დატვირთვას.",
        },
        {
          id: "feat-3",
          icon: "Sparkles",
          title: "მდგრადი პიგმენტაცია",
          description:
            "ვიყენებთ გერმანულ (Bayferrox) მინერალურ პიგმენტებს, რომლებიც სრულ მასაშია შერეული და მზეზე არ ხუნდება.",
        },
        {
          id: "feat-4",
          icon: "Compass",
          title: "ინდივიდუალური ყალიბები",
          description:
            "სტანდარტული კატალოგის გარდა, ვამზადებთ არასტანდარტული ზომის საფეხურებსა და საყვავილეებს არქიტექტორის ნახაზით.",
        },
      ],
    });
    setTrustSection({
      badge: "სანდო პარტნიორობა",
      title: "ჩვენ გვენდობიან წამყვანი დეველოპერები & არქიტექტორები",
      subtitle:
        "ჩვენი არქიტექტურული ბეტონის ნაკეთობები ამშვენებს პრემიუმ საცხოვრებელ კომპლექსებს, სასტუმროებსა და კერძო ვილებს.",
      stats: [
        { id: "stat-1", value: "150+", label: "დასრულებული ობიექტი", highlight: false },
        { id: "stat-2", value: "15 000+", label: "მ² დაგებული ფილა", highlight: false },
        { id: "stat-3", value: "M500 / F300", label: "სერტიფიცირებული ბეტონი", highlight: true },
        { id: "stat-4", value: "10 წელი", label: "მასალის ოფიციალური გარანტია", highlight: false },
      ],
      partners: [
        { id: "p-1", name: "ARCHI", role: "Development" },
        { id: "p-2", name: "m²", role: "Real Estate" },
        { id: "p-3", name: "SILK", role: "Development" },
        { id: "p-4", name: "ALLIANCE", role: "Group" },
        { id: "p-5", name: "ROOMS", role: "Hotels & Resorts" },
        { id: "p-6", name: "TBILISI HILLS", role: "Golf & Villas" },
        { id: "p-7", name: "RADISSON", role: "BLU Collection" },
        { id: "p-8", name: "DOMUS", role: "Architectural" },
      ],
    });
    setToast("აღდგენილია საწყისი მნიშვნელობები. დააჭირეთ 'შენახვას' დასადასტურებლად.");
    setTimeout(() => setToast(null), 3500);
  };

  // ===================== HERO CAROUSEL HANDLERS =====================
  const handleUpdateSlide = (index, field, value) => {
    setHeroSlides((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: Date.now(),
      titleMain: "ახალი სათაური:",
      titleHighlight: "პრემიუმ არქიტექტურა",
      subtitle: "შეიყვანეთ სლაიდის მოკლე აღწერა და ტექნიკური მახასიათებლები...",
      badge: "ქართული წარმოება",
      tag: "ექსტერიერი",
      categoryLink: "/products",
      buttonText: "კატალოგის ნახვა",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&fm=webp&w=1280&q=75",
    };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const handleDuplicateSlide = (index) => {
    const target = heroSlides[index];
    const duplicated = {
      ...target,
      id: Date.now(),
      titleMain: `${target.titleMain} (ასლი)`,
    };
    setHeroSlides((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, duplicated);
      return copy;
    });
  };

  const handleRemoveSlide = (index) => {
    if (heroSlides.length <= 1) {
      alert("კარუსელში მინიმუმ ერთი სლაიდი უნდა იყოს დატოვებული!");
      return;
    }
    if (!window.confirm("ნამდვილად გსურთ ამ სლაიდის წაშლა?")) return;
    setHeroSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveSlide = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;
    setHeroSlides((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSlideImageUpload = (index, file) => {
    if (!file) return;
    compressHeroImage(file, (dataUrl) => {
      handleUpdateSlide(index, "image", dataUrl);
    });
  };

  // ===================== WHY CHOOSE US HANDLERS =====================
  const handleUpdateFeature = (id, field, value) => {
    setWhyChooseUs((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    }));
  };

  const handleAddFeature = () => {
    const newItem = {
      id: `feat-${Date.now()}`,
      icon: "Award",
      title: "ახალი უპირატესობა",
      description: "შეიყვანეთ ტექნიკური უპირატესობის დეტალური აღწერა...",
    };
    setWhyChooseUs((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveFeature = (id) => {
    setWhyChooseUs((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  // ===================== TRUST & STATS HANDLERS =====================
  const handleUpdateStat = (id, field, value) => {
    setTrustSection((prev) => ({
      ...prev,
      stats: prev.stats.map((st) => (st.id === id ? { ...st, [field]: value } : st)),
    }));
  };

  const handleAddStat = () => {
    const newStat = {
      id: `stat-${Date.now()}`,
      value: "100+",
      label: "ახალი მაჩვენებელი",
      highlight: false,
    };
    setTrustSection((prev) => ({
      ...prev,
      stats: [...prev.stats, newStat],
    }));
  };

  const handleRemoveStat = (id) => {
    setTrustSection((prev) => ({
      ...prev,
      stats: prev.stats.filter((st) => st.id !== id),
    }));
  };

  const handleUpdatePartner = (id, field, value) => {
    setTrustSection((prev) => ({
      ...prev,
      partners: prev.partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const handleAddPartner = () => {
    const newPartner = {
      id: `partner-${Date.now()}`,
      name: "კომპანიის სახელი",
      role: "Development",
    };
    setTrustSection((prev) => ({
      ...prev,
      partners: [...prev.partners, newPartner],
    }));
  };

  const handleRemovePartner = (id) => {
    setTrustSection((prev) => ({
      ...prev,
      partners: prev.partners.filter((p) => p.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-stone-950 px-5 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>მთავარი გვერდის მართვა</span>
          </div>
          <h2 className="text-2xl font-black text-white">მთავარი გვერდის ბლოკები და კარუსელი</h2>
          <p className="text-stone-400 text-sm mt-1">
            მართეთ მთავარი კარუსელის სლაიდები, სურათები, სათაურები, უპირატესობები და პარტნიორები
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
            title="საწყისზე დაბრუნება"
          >
            <RotateCcw className="w-4 h-4" />
            <span>საწყისი</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "hero"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800"
          }`}
        >
          <span className="text-base">🎠</span>
          <span>მთავარი კარუსელი</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === "hero" ? "bg-stone-950/20 text-stone-950" : "bg-stone-800 text-stone-300"
            }`}
          >
            {heroSlides.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("features")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "features"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>რატომ ჩვენ? (სტანდარტები)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === "features" ? "bg-stone-950/20 text-stone-950" : "bg-stone-800 text-stone-300"
            }`}
          >
            {whyChooseUs.items?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trust")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "trust"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>პარტნიორები & ციფრები</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === "trust" ? "bg-stone-950/20 text-stone-950" : "bg-stone-800 text-stone-300"
            }`}
          >
            {trustSection.partners?.length || 0}
          </span>
        </button>
      </div>

      {/* ======================= TAB 1: HERO CAROUSEL ======================= */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          {/* Info & Add slide header */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-amber-200 text-xs sm:text-sm font-medium">
                  აქ მოცემული სლაიდები ავტომატურად ბრუნავს მთავარი გვერდის თავში (Hero Banner).
                </p>
                <p className="text-stone-400 text-xs mt-1">
                  შეგიძლიათ ატვირთოთ ახალი ფოტო (ავტომატურად ოპტიმიზდება), შეცვალოთ სათაურები, ღილაკის ბმულები ან გადააადგილოთ სლაიდები.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ახალი სლაიდის დამატება</span>
            </button>
          </div>

          {/* Slides List */}
          <div className="space-y-6">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id || index}
                className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl overflow-hidden shadow-xl transition-all"
              >
                {/* Slide Card Header */}
                <div className="bg-stone-800/80 px-5 py-3.5 border-b border-stone-700/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-500 text-stone-950 font-black text-xs px-2.5 py-1 rounded-lg">
                      #{index + 1}
                    </span>
                    <span className="text-white font-bold text-sm truncate max-w-xs sm:max-w-md">
                      {slide.titleMain} {slide.titleHighlight}
                    </span>
                  </div>

                  {/* Move, Duplicate, Delete Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveSlide(index, -1)}
                      className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-30 disabled:pointer-events-none text-stone-200 text-xs transition"
                      title="ზემოთ აწევა"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === heroSlides.length - 1}
                      onClick={() => handleMoveSlide(index, 1)}
                      className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 disabled:opacity-30 disabled:pointer-events-none text-stone-200 text-xs transition"
                      title="ქვემოთ ჩამოწევა"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateSlide(index)}
                      className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs transition"
                      title="სლაიდის დუბლირება"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(index)}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs transition"
                      title="სლაიდის წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slide Card Body */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Image Preview & Upload (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 group shadow-inner">
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.titleMain || "Slide preview"}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-600">
                          <ImageIcon className="w-10 h-10 mb-2" />
                          <span className="text-xs">ფოტო არ არის არჩეული</span>
                        </div>
                      )}

                      {/* Tag preview overlay */}
                      {slide.tag && (
                        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {slide.tag}
                        </span>
                      )}

                      {/* Title preview overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <p className="text-white text-xs font-bold line-clamp-1">
                          {slide.titleMain} <span className="text-amber-400">{slide.titleHighlight}</span>
                        </p>
                      </div>
                    </div>

                    {/* Image Upload Button & URL Input */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 transition active:scale-98">
                          <Upload className="w-4 h-4" />
                          <span>ფოტოს ატვირთვა მოწყობილობიდან</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleSlideImageUpload(index, f);
                            }}
                          />
                        </label>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-stone-400">ან ჩასვით პირდაპირი სურათის URL:</label>
                        <input
                          type="text"
                          value={slide.image || ""}
                          onChange={(e) => handleUpdateSlide(index, "image", e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Slide Texts & Links (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Main Title */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300">
                          მთავარი სათაური (თეთრი):
                        </label>
                        <input
                          type="text"
                          value={slide.titleMain || ""}
                          onChange={(e) => handleUpdateSlide(index, "titleMain", e.target.value)}
                          placeholder="მაგ: მონოლითური ესთეტიკა:"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-medium"
                        />
                      </div>

                      {/* Highlight Title */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-amber-400">
                          გამოკვეთილი სათაური (ოქროსფერი):
                        </label>
                        <input
                          type="text"
                          value={slide.titleHighlight || ""}
                          onChange={(e) => handleUpdateSlide(index, "titleHighlight", e.target.value)}
                          placeholder="მაგ: საფეხურები და ლანდშაფტი"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-amber-300 focus:outline-none focus:border-amber-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Tag / Category Badge */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300">
                          თეგი / კატეგორია ზემოთ:
                        </label>
                        <input
                          type="text"
                          value={slide.tag || ""}
                          onChange={(e) => handleUpdateSlide(index, "tag", e.target.value)}
                          placeholder="მაგ: ექსტერიერი & კიბეები"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Badge (Optional) */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300">
                          დამატებითი ბეიჯი (არასავალდებულო):
                        </label>
                        <input
                          type="text"
                          value={slide.badge || ""}
                          onChange={(e) => handleUpdateSlide(index, "badge", e.target.value)}
                          placeholder="მაგ: არქიტექტურული საწარმო"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Subtitle / Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-300">
                        მოკლე აღწერა / ქვესათაური:
                      </label>
                      <textarea
                        rows={2}
                        value={slide.subtitle || ""}
                        onChange={(e) => handleUpdateSlide(index, "subtitle", e.target.value)}
                        placeholder="უმაღლესი სიმტკიცის (M500) ყინვაგამძლე ბეტონის მონოლითური და მცურავი საფეხურები..."
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-300 focus:outline-none focus:border-amber-500 leading-relaxed"
                      />
                    </div>

                    {/* Button Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300">ღილაკის წარწერა:</label>
                        <input
                          type="text"
                          value={slide.buttonText || ""}
                          onChange={(e) => handleUpdateSlide(index, "buttonText", e.target.value)}
                          placeholder="მაგ: საფეხურების კატალოგი"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-300">ღილაკის ბმული (URL):</label>
                        <input
                          type="text"
                          value={slide.categoryLink || ""}
                          onChange={(e) => handleUpdateSlide(index, "categoryLink", e.target.value)}
                          placeholder="/products?category=steps"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Quick Link Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-stone-500 mr-1">სწრაფი ბმულები:</span>
                      {[
                        { label: "ყველა პროდუქტი", path: "/products" },
                        { label: "საფეხურები", path: "/products?category=steps" },
                        { label: "საყვავილეები", path: "/products?category=planters" },
                        { label: "ეზოს ფილები", path: "/products?category=pavers" },
                        { label: "ურბანული ავეჯი", path: "/products?category=benches" },
                        { label: "კალკულატორი", path: "/calculator" },
                        { label: "პორტფოლიო", path: "/portfolio" },
                      ].map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => handleUpdateSlide(index, "categoryLink", preset.path)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                            slide.categoryLink === preset.path
                              ? "bg-amber-500/20 border-amber-500 text-amber-400 font-bold"
                              : "bg-stone-800 border-stone-700 text-stone-400 hover:text-white"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Slide bottom button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleAddSlide}
              className="bg-stone-900 border border-dashed border-stone-700 hover:border-amber-500 hover:bg-stone-850 text-stone-300 hover:text-white px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ ახალი სლაიდის დამატება</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: FEATURES (WHY CHOOSE US) ======================= */}
      {activeTab === "features" && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>სექცია: "რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?"</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              აქ შეგიძლიათ შეცვალოთ სექციის მთავარი სათაურები და 4 ძირითადი უპირატესობის ბარათი (ტექნოლოგიური სტანდარტები).
            </p>
          </div>

          {/* Header Texts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">ზედა პატარა ბეიჯი:</label>
              <input
                type="text"
                value={whyChooseUs.badge || ""}
                onChange={(e) => setWhyChooseUs((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="საწარმოო სტანდარტი"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-stone-300">მთავარი სათაური:</label>
              <input
                type="text"
                value={whyChooseUs.title || ""}
                onChange={(e) => setWhyChooseUs((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300">ქვესათაური / აღწერა:</label>
            <textarea
              rows={2}
              value={whyChooseUs.subtitle || ""}
              onChange={(e) => setWhyChooseUs((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="თითოეული ნაკეთობა გადის ვიბროჩამოსხმისა და თერმული გამოშრობის სრულ ტექნოლოგიურ ციკლს."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-300 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Features Cards Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-200">უპირატესობების ბარათები</h4>
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>ბარათის დამატება</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whyChooseUs.items?.map((item, idx) => {
                const IconComponent = getFeatureIcon(item.icon);
                return (
                  <div
                    key={item.id || idx}
                    className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <select
                          value={item.icon || "Sparkles"}
                          onChange={(e) => handleUpdateFeature(item.id, "icon", e.target.value)}
                          className="bg-stone-900 border border-stone-700 rounded-lg px-2 py-1 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                        >
                          {FEATURE_ICONS_LIST.map((ic) => (
                            <option key={ic.id} value={ic.id}>
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(item.id)}
                        className="text-stone-500 hover:text-red-400 p-1 transition"
                        title="წაშლა"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-400">ბარათის სათაური:</label>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) => handleUpdateFeature(item.id, "title", e.target.value)}
                        placeholder="მაგ: ყინვაგამძლეობა F300"
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-400">ტექნიკური აღწერა:</label>
                      <textarea
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => handleUpdateFeature(item.id, "description", e.target.value)}
                        placeholder="სპეციალური ჰიდროფობიური დანამატები..."
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: TRUST & PARTNERS ======================= */}
      {activeTab === "trust" && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              <span>სექცია: "ჩვენ გვენდობიან" (ციფრები & პარტნიორები)</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              მართეთ ციფრული მაჩვენებლების ბლოკები (სტატისტიკა) და პარტნიორი კომპანიების/დეველოპერების სია.
            </p>
          </div>

          {/* Section Titles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">ზედა პატარა ბეიჯი:</label>
              <input
                type="text"
                value={trustSection.badge || ""}
                onChange={(e) => setTrustSection((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="სანდო პარტნიორობა"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-stone-300">მთავარი სათაური:</label>
              <input
                type="text"
                value={trustSection.title || ""}
                onChange={(e) => setTrustSection((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="ჩვენ გვენდობიან წამყვანი დეველოპერები & არქიტექტორები"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300">ქვესათაური / აღწერა:</label>
            <textarea
              rows={2}
              value={trustSection.subtitle || ""}
              onChange={(e) => setTrustSection((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="ჩვენი არქიტექტურული ბეტონის ნაკეთობები ამშვენებს პრემიუმ საცხოვრებელ კომპლექსებს..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-300 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Stats Counters */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-200">სტატისტიკური მაჩვენებლები (ციფრები)</h4>
              <button
                type="button"
                onClick={handleAddStat}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>მაჩვენებლის დამატება</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {trustSection.stats?.map((stat, idx) => (
                <div
                  key={stat.id || idx}
                  className={`p-3.5 rounded-xl border space-y-2 relative ${
                    stat.highlight
                      ? "bg-amber-500/10 border-amber-500/40"
                      : "bg-stone-950 border-stone-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      ციფრი / მნიშვნელობა
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(stat.id)}
                      className="text-stone-500 hover:text-red-400 p-1 transition"
                      title="წაშლა"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={stat.value || ""}
                    onChange={(e) => handleUpdateStat(stat.id, "value", e.target.value)}
                    placeholder="150+"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1 text-sm font-black text-amber-400 focus:outline-none focus:border-amber-500"
                  />
                  <div>
                    <label className="text-[10px] text-stone-400">განმარტება</label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => handleUpdateStat(stat.id, "label", e.target.value)}
                      placeholder="დასრულებული ობიექტი"
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Brands */}
          <div className="space-y-3 pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-200">პარტნიორი ბრენდები / დეველოპერები</h4>
              <button
                type="button"
                onClick={handleAddPartner}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>პარტნიორის დამატება</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {trustSection.partners?.map((partner, idx) => (
                <div
                  key={partner.id || idx}
                  className="bg-stone-950 border border-stone-800 rounded-xl p-3 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-500 font-mono">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(partner.id)}
                      className="text-stone-500 hover:text-red-400 p-0.5 transition"
                      title="წაშლა"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={partner.name || ""}
                    onChange={(e) => handleUpdatePartner(partner.id, "name", e.target.value)}
                    placeholder="ARCHI"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-xs font-black text-white focus:outline-none focus:border-amber-500 uppercase"
                  />
                  <input
                    type="text"
                    value={partner.role || ""}
                    onChange={(e) => handleUpdatePartner(partner.id, "role", e.target.value)}
                    placeholder="Development"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-[11px] text-stone-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-40 bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="text-xs text-stone-400 hidden sm:block">
          სულ: <span className="text-white font-bold">{heroSlides.length}</span> სლაიდი კარუსელში |{" "}
          <span className="text-white font-bold">{whyChooseUs.items?.length || 0}</span> უპირატესობა |{" "}
          <span className="text-white font-bold">{trustSection.partners?.length || 0}</span> პარტნიორი
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>საწყისზე დაბრუნება</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
