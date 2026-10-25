import React, { useState, useRef } from "react";
import { useData } from "../../context/DataContext";
import {
  Sliders,
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function SiteSettingsManager() {
  const { siteSettings, updateSiteSettings, resetSiteSettings } = useData();

  // Local copy of settings for seamless editing before save
  const [formData, setFormData] = useState(() => ({
    ...siteSettings,
    navbarLinks: siteSettings?.navbarLinks ? [...siteSettings.navbarLinks] : [],
    footerLinks: siteSettings?.footerLinks ? [...siteSettings.footerLinks] : [],
    socials: { ...(siteSettings?.socials || {}) },
  }));

  const [activeSubTab, setActiveSubTab] = useState("branding");
  const [saveToast, setSaveToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // New Link input states
  const [newNavLink, setNewNavLink] = useState({ label: "", path: "", isExternal: false });
  const [newFootLink, setNewFootLink] = useState({ label: "", path: "", isExternal: false });

  const logoFileInputRef = useRef(null);
  const faviconFileInputRef = useRef(null);

  // Image compression & conversion to data URL
  const handleImageFile = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 600;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX) {
            h = Math.round((h * MAX) / w);
            w = MAX;
          }
        } else {
          if (h > MAX) {
            w = Math.round((w * MAX) / h);
            h = MAX;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/png", 0.9);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (customSettings = null) => {
    setIsSaving(true);
    const toSave = customSettings || formData;
    await updateSiteSettings(toSave);
    setIsSaving(false);
    setSaveToast("პარამეტრები წარმატებით შეინახა!");
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleReset = async () => {
    if (!window.confirm("ნამდვილად გსურთ საიტის პარამეტრების საწყის მდგომარეობაში დაბრუნება?")) return;
    const defs = await resetSiteSettings();
    setFormData(defs);
    setSaveToast("პარამეტრები დაბრუნდა საწყისზე.");
    setTimeout(() => setSaveToast(null), 3500);
  };

  // ---------------- NAVBAR LINKS HELPERS ----------------
  const moveNavLink = (index, direction) => {
    const list = [...formData.navbarLinks];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    const updated = { ...formData, navbarLinks: list };
    setFormData(updated);
    handleSave(updated);
  };

  const toggleNavLinkEnabled = (id) => {
    const list = formData.navbarLinks.map((l) =>
      l.id === id ? { ...l, enabled: !l.enabled } : l
    );
    const updated = { ...formData, navbarLinks: list };
    setFormData(updated);
    handleSave(updated);
  };

  const deleteNavLink = (id) => {
    if (!window.confirm("წაიშალოს ეს ბმული ნავბარიდან?")) return;
    const list = formData.navbarLinks.filter((l) => l.id !== id);
    const updated = { ...formData, navbarLinks: list };
    setFormData(updated);
    handleSave(updated);
  };

  const addNavLink = (e) => {
    e.preventDefault();
    if (!newNavLink.label.trim() || !newNavLink.path.trim()) return;
    const newItem = {
      id: `nav-${Date.now()}`,
      label: newNavLink.label.trim(),
      path: newNavLink.path.trim(),
      enabled: true,
      isExternal: newNavLink.isExternal,
    };
    const list = [...formData.navbarLinks, newItem];
    const updated = { ...formData, navbarLinks: list };
    setFormData(updated);
    setNewNavLink({ label: "", path: "", isExternal: false });
    handleSave(updated);
  };

  // ---------------- FOOTER LINKS HELPERS ----------------
  const moveFootLink = (index, direction) => {
    const list = [...formData.footerLinks];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    const updated = { ...formData, footerLinks: list };
    setFormData(updated);
    handleSave(updated);
  };

  const toggleFootLinkEnabled = (id) => {
    const list = formData.footerLinks.map((l) =>
      l.id === id ? { ...l, enabled: !l.enabled } : l
    );
    const updated = { ...formData, footerLinks: list };
    setFormData(updated);
    handleSave(updated);
  };

  const deleteFootLink = (id) => {
    if (!window.confirm("წაიშალოს ეს ბმული ფუტერიდან?")) return;
    const list = formData.footerLinks.filter((l) => l.id !== id);
    const updated = { ...formData, footerLinks: list };
    setFormData(updated);
    handleSave(updated);
  };

  const addFootLink = (e) => {
    e.preventDefault();
    if (!newFootLink.label.trim() || !newFootLink.path.trim()) return;
    const newItem = {
      id: `foot-${Date.now()}`,
      label: newFootLink.label.trim(),
      path: newFootLink.path.trim(),
      enabled: true,
      isExternal: newFootLink.isExternal,
    };
    const list = [...formData.footerLinks, newItem];
    const updated = { ...formData, footerLinks: list };
    setFormData(updated);
    setNewFootLink({ label: "", path: "", isExternal: false });
    handleSave(updated);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center justify-between gap-3 text-emerald-300 text-sm shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{saveToast}</span>
          </div>
          <button
            onClick={() => setSaveToast(null)}
            className="text-xs text-emerald-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Settings Sub-Tab Navigation Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-2 flex flex-wrap gap-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab("branding")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === "branding"
              ? "bg-amber-500 text-stone-950 shadow-sm"
              : "text-stone-300 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>ბრენდინგი & ლოგო</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("navbar")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === "navbar"
              ? "bg-amber-500 text-stone-950 shadow-sm"
              : "text-stone-300 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Navbar (მთავარი მენიუ)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("footer")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === "footer"
              ? "bg-amber-500 text-stone-950 shadow-sm"
              : "text-stone-300 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Footer (ქვედა ნავიგაცია)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("contacts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === "contacts"
              ? "bg-amber-500 text-stone-950 shadow-sm"
              : "text-stone-300 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>საკონტაქტო მონაცემები</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
            title="საწყის ნაგულისხმევ პარამეტრებზე დაბრუნება"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">საწყისზე დაბრუნება</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BRANDING & LOGO */}
      {/* ========================================================================= */}
      {activeSubTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Controls */}
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>საიტის ლოგო & ფავიკონი</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                ატვირთეთ თქვენი კომპანიის ლოგო ან აირჩიეთ ტექსტური სტილი. ლოგოს შეცვლისას ბრაუზერის ჩანართის ფავიკონი ავტომატურად განახლდება.
              </p>
            </div>

            {/* Logo Mode Selection */}
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                ლოგოს ტიპი ჰედერში
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const upd = { ...formData, logoType: "icon" };
                    setFormData(upd);
                    handleSave(upd);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    formData.logoType === "icon"
                      ? "bg-amber-500/10 border-amber-500/80 text-white"
                      : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>ტექსტი & აიქონი</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    სტანდარტული მონოლითის ბლოკი და ტექსტი
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const upd = { ...formData, logoType: "image" };
                    setFormData(upd);
                    handleSave(upd);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition ${
                    formData.logoType === "image"
                      ? "bg-amber-500/10 border-amber-500/80 text-white"
                      : "bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>საკუთარი ლოგო (სურათი)</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    ატვირთეთ საკუთარი PNG / SVG / WebP ფაილი
                  </p>
                </button>
              </div>
            </div>

            {/* Logo Image Upload & Settings (Visible when logoType === 'image') */}
            {formData.logoType === "image" && (
              <div className="space-y-4 p-4 rounded-xl bg-stone-950 border border-stone-800">
                <span className="text-xs font-bold text-stone-300 block">
                  ლოგოს ფაილის ატვირთვა
                </span>

                <div className="flex items-center gap-3">
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageFile(file, (dataUrl) => {
                          const upd = { ...formData, logoImage: dataUrl };
                          setFormData(upd);
                          handleSave(upd);
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>ლოგოს არჩევა კომპიუტერიდან</span>
                  </button>

                  {formData.logoImage && (
                    <button
                      type="button"
                      onClick={() => {
                        const upd = { ...formData, logoImage: "" };
                        setFormData(upd);
                        handleSave(upd);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>წაშლა</span>
                    </button>
                  )}
                </div>

                {/* Direct URL input fallback */}
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">
                    ან ჩასვით ლოგოს პირდაპირი ბმული (URL):
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={formData.logoImage || ""}
                    onChange={(e) => {
                      const upd = { ...formData, logoImage: e.target.value };
                      setFormData(upd);
                    }}
                    onBlur={() => handleSave()}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Logo Height Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-300 mb-1">
                    <span>ლოგოს სიმაღლე ჰედერში:</span>
                    <strong className="font-mono text-amber-400">{formData.logoHeight || 36}px</strong>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="64"
                    step="2"
                    value={formData.logoHeight || 36}
                    onChange={(e) => {
                      const upd = { ...formData, logoHeight: Number(e.target.value) };
                      setFormData(upd);
                    }}
                    onMouseUp={() => handleSave()}
                    onTouchEnd={() => handleSave()}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Show brand text with logo */}
                <label className="flex items-center gap-2.5 text-xs text-stone-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.showBrandTextWithLogo !== false}
                    onChange={(e) => {
                      const upd = { ...formData, showBrandTextWithLogo: e.target.checked };
                      setFormData(upd);
                      handleSave(upd);
                    }}
                    className="rounded border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                  />
                  <span>ტექსტის ჩვენება ლოგოს გვერდით (MONOLITH.GE)</span>
                </label>
              </div>
            )}

            {/* Favicon Settings */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-200 block">
                    ბრაუზერის ჩანართის ფავიკონი (Favicon)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    აიქონი, რომელიც ჩანს ბრაუზერის ჩანართში საიტის სახელთან
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-stone-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.syncFaviconWithLogo !== false}
                  onChange={(e) => {
                    const upd = { ...formData, syncFaviconWithLogo: e.target.checked };
                    setFormData(upd);
                    handleSave(upd);
                  }}
                  className="rounded border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                />
                <span className="font-semibold text-white">
                  ფავიკონის ავტომატური სინქრონიზაცია ლოგოსთან (რეკომენდებულია)
                </span>
              </label>

              {/* Custom standalone favicon if auto-sync is off */}
              {formData.syncFaviconWithLogo === false && (
                <div className="pt-2 border-t border-stone-800/80 space-y-2">
                  <span className="text-[11px] text-stone-400 block">
                    ატვირთეთ დამოუკიდებელი ფავიკონის ფაილი:
                  </span>
                  <input
                    ref={faviconFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageFile(file, (dataUrl) => {
                          const upd = { ...formData, favicon: dataUrl };
                          setFormData(upd);
                          handleSave(upd);
                        });
                      }
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => faviconFileInputRef.current?.click()}
                      className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      ფავიკონის ატვირთვა
                    </button>
                    {formData.favicon && (
                      <button
                        type="button"
                        onClick={() => {
                          const upd = { ...formData, favicon: "" };
                          setFormData(upd);
                          handleSave(upd);
                        }}
                        className="text-xs text-red-400"
                      >
                        წაშლა
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Brand Text Settings */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                ტექსტური ბრენდინგი
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">
                    ბრენდის სახელი:
                  </label>
                  <input
                    type="text"
                    value={formData.brandName || ""}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    onBlur={() => handleSave()}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">
                    დაბოლოება / დომენი (ფერადი აქცენტით):
                  </label>
                  <input
                    type="text"
                    value={formData.brandSuffix || ""}
                    onChange={(e) => setFormData({ ...formData, brandSuffix: e.target.value })}
                    onBlur={() => handleSave()}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  სლოგანი / ქვესათაური:
                </label>
                <input
                  type="text"
                  value={formData.brandTagline || ""}
                  onChange={(e) => setFormData({ ...formData, brandTagline: e.target.value })}
                  onBlur={() => handleSave()}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Right: Live Previews */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-5">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>პირდაპირი ხედი (Live Preview)</span>
              </h4>

              {/* Light Theme Preview */}
              <div>
                <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
                  ღია თემაზე (Light Mode):
                </span>
                <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    {formData.logoType === "image" && formData.logoImage ? (
                      <img
                        src={formData.logoImage}
                        alt="Logo Preview"
                        style={{ maxHeight: `${formData.logoHeight || 36}px` }}
                        className="w-auto object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-stone-800 text-white rounded-xl flex items-center justify-center font-black">
                        <Layers className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}
                    {(formData.logoType !== "image" || formData.showBrandTextWithLogo !== false) && (
                      <div>
                        <span className="text-sm font-extrabold text-stone-900 block leading-none">
                          {formData.brandName || "MONOLITH"}
                          <span className="text-amber-600">{formData.brandSuffix || ".GE"}</span>
                        </span>
                        <span className="text-[9px] text-stone-500 uppercase tracking-widest font-medium">
                          {formData.brandTagline || "არქიტექტურული ბეტონი"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dark Theme Preview */}
              <div>
                <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
                  მუქ თემაზე (Dark Mode):
                </span>
                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    {formData.logoType === "image" && formData.logoImage ? (
                      <img
                        src={formData.logoImage}
                        alt="Logo Preview"
                        style={{ maxHeight: `${formData.logoHeight || 36}px` }}
                        className="w-auto object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-white text-stone-950 rounded-xl flex items-center justify-center font-black">
                        <Layers className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}
                    {(formData.logoType !== "image" || formData.showBrandTextWithLogo !== false) && (
                      <div>
                        <span className="text-sm font-extrabold text-white block leading-none">
                          {formData.brandName || "MONOLITH"}
                          <span className="text-amber-400">{formData.brandSuffix || ".GE"}</span>
                        </span>
                        <span className="text-[9px] text-stone-400 uppercase tracking-widest font-medium">
                          {formData.brandTagline || "არქიტექტურული ბეტონი"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Favicon Browser Tab Mockup */}
              <div>
                <span className="text-[11px] font-semibold text-stone-400 block mb-1.5">
                  ბრაუზერის ჩანართის იმიტაცია:
                </span>
                <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2 text-xs text-stone-300">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    {formData.syncFaviconWithLogo && formData.logoImage ? (
                      <img src={formData.logoImage} alt="Favicon" className="w-4 h-4 object-contain" />
                    ) : formData.favicon ? (
                      <img src={formData.favicon} alt="Favicon" className="w-4 h-4 object-contain" />
                    ) : (
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <span className="font-medium truncate">
                    {formData.brandName || "MONOLITH"}{formData.brandSuffix || ".GE"} — არქიტექტურული ბეტონი
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NAVBAR NAVIGATION */}
      {/* ========================================================================= */}
      {activeSubTab === "navbar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Navigation links list */}
          <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Navbar (მთავარი ჰედერის მენიუ)</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                მართეთ მთავარი მენიუს ბმულები, ჩართეთ ან გამორთეთ სასურველი გვერდები, შეცვალეთ თანმიმდევრობა ან დაამატეთ ახალი ლინკი.
              </p>
            </div>

            {/* Links List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
                მენიუს ელემენტები ({formData.navbarLinks.length})
              </span>

              {formData.navbarLinks.map((link, idx) => (
                <div
                  key={link.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    link.enabled
                      ? "bg-stone-950 border-stone-800 text-white"
                      : "bg-stone-950/40 border-stone-800/40 text-stone-500 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-stone-500 w-5">
                      {idx + 1}.
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate">{link.label}</span>
                        {link.isExternal && (
                          <span className="text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <span>გარე</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-stone-400 block truncate">
                        {link.path}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Move Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveNavLink(idx, -1)}
                      className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 disabled:hover:text-stone-300 transition"
                      title="ზემოთ ატანა"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      disabled={idx === formData.navbarLinks.length - 1}
                      onClick={() => moveNavLink(idx, 1)}
                      className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 disabled:hover:text-stone-300 transition"
                      title="ქვემოთ ჩამოტანა"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Enable / Disable Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleNavLinkEnabled(link.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        link.enabled
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                          : "bg-stone-800 text-stone-400"
                      }`}
                      title={link.enabled ? "გამორთვა (დამალვა)" : "ჩართვა (გამოჩენა)"}
                    >
                      {link.enabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>ჩართულია</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>დამალულია</span>
                        </>
                      )}
                    </button>

                    {/* Delete button (only for custom added links, keep core ones safe) */}
                    {!["nav-home", "nav-products", "nav-portfolio"].includes(link.id) && (
                      <button
                        type="button"
                        onClick={() => deleteNavLink(link.id)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 transition"
                        title="წაშლა"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Link Form */}
            <form onSubmit={addNavLink} className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>ახალი ბმულის დამატება ჰედერში</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="დასახელება (მაგ. ფასდაკლებები, ბლოგი)"
                  value={newNavLink.label}
                  onChange={(e) => setNewNavLink({ ...newNavLink, label: e.target.value })}
                  className="bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  required
                  placeholder="ბმული (მაგ. /discounts ან https://...)"
                  value={newNavLink.path}
                  onChange={(e) => setNewNavLink({ ...newNavLink, path: e.target.value })}
                  className="bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNavLink.isExternal}
                    onChange={(e) => setNewNavLink({ ...newNavLink, isExternal: e.target.checked })}
                    className="rounded border-stone-700 text-amber-500 focus:ring-0"
                  />
                  <span>გარე ბმულია (ახალ ფანჯარაში გახსნა)</span>
                </label>

                <button
                  type="submit"
                  className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                >
                  მენიუში დამატება
                </button>
              </div>
            </form>
          </div>

          {/* Right: CTA & Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                ჰედერის მოქმედების ღილაკები
              </h4>

              {/* Header CTA Button Toggle & Text */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <label className="flex items-center justify-between text-xs text-stone-200 font-semibold cursor-pointer">
                  <span>«დაგვიკავშირდით» ღილაკი:</span>
                  <input
                    type="checkbox"
                    checked={formData.showNavbarCta !== false}
                    onChange={(e) => {
                      const upd = { ...formData, showNavbarCta: e.target.checked };
                      setFormData(upd);
                      handleSave(upd);
                    }}
                    className="rounded border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                  />
                </label>

                {formData.showNavbarCta !== false && (
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      ღილაკის წარწერა:
                    </label>
                    <input
                      type="text"
                      value={formData.navbarCtaText || "დაგვიკავშირდით"}
                      onChange={(e) => setFormData({ ...formData, navbarCtaText: e.target.value })}
                      onBlur={() => handleSave()}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Favorites toggle */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-200 block">
                    ფავორიტები (გულის აიქონი)
                  </span>
                  <span className="text-[11px] text-stone-400">შენახული პროდუქტების მრიცხველი</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showNavbarFavorites !== false}
                  onChange={(e) => {
                    const upd = { ...formData, showNavbarFavorites: e.target.checked };
                    setFormData(upd);
                    handleSave(upd);
                  }}
                  className="rounded border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                />
              </div>

              {/* Theme toggle */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-stone-200 block">
                    თემის გადამრთველი (Dark / Light)
                  </span>
                  <span className="text-[11px] text-stone-400">მზის/მთვარის ღილაკი ჰედერში</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showNavbarThemeToggle !== false}
                  onChange={(e) => {
                    const upd = { ...formData, showNavbarThemeToggle: e.target.checked };
                    setFormData(upd);
                    handleSave(upd);
                  }}
                  className="rounded border-stone-700 text-amber-500 focus:ring-0 w-4 h-4"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FOOTER NAVIGATION */}
      {/* ========================================================================= */}
      {activeSubTab === "footer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Footer Links */}
          <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Footer (ქვედა ნავიგაციის ბმულები)</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                მართეთ საიტის ძირში არსებული ნავიგაციის სვეტი.
              </p>
            </div>

            <div className="space-y-2">
              {formData.footerLinks.map((link, idx) => (
                <div
                  key={link.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                    link.enabled
                      ? "bg-stone-950 border-stone-800 text-white"
                      : "bg-stone-950/40 border-stone-800/40 text-stone-500 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono font-bold text-stone-500 w-4">
                      {idx + 1}.
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{link.label}</span>
                      <span className="text-[11px] font-mono text-stone-400 block truncate">
                        {link.path}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFootLink(idx, -1)}
                      className="p-1 rounded bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 transition"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === formData.footerLinks.length - 1}
                      onClick={() => moveFootLink(idx, 1)}
                      className="p-1 rounded bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 transition"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFootLinkEnabled(link.id)}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                        link.enabled
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {link.enabled ? "ჩართულია" : "დამალულია"}
                    </button>
                    {!["foot-home", "foot-products", "foot-portfolio"].includes(link.id) && (
                      <button
                        type="button"
                        onClick={() => deleteFootLink(link.id)}
                        className="p-1 rounded bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add footer link */}
            <form onSubmit={addFootLink} className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>ფუტერის ბმულის დამატება</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="დასახელება"
                  value={newFootLink.label}
                  onChange={(e) => setNewFootLink({ ...newFootLink, label: e.target.value })}
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  required
                  placeholder="ბმული (მაგ. /faq)"
                  value={newFootLink.path}
                  onChange={(e) => setNewFootLink({ ...newFootLink, path: e.target.value })}
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  დამატება
                </button>
              </div>
            </form>
          </div>

          {/* Right: Footer Texts & Bio */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                ფუტერის ტექსტები & საავტორო უფლება
              </h4>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  მოკლე აღწერა (ბრენდის ქვეშ):
                </label>
                <textarea
                  rows={3}
                  value={formData.footerDescription || ""}
                  onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
                  onBlur={() => handleSave()}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  საავტორო უფლების წარწერა (Copyright):
                </label>
                <input
                  type="text"
                  value={formData.footerCopyright || ""}
                  onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                  onBlur={() => handleSave()}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-400 block mb-1">
                  ქვედა ლოკაციის წარწერა:
                </label>
                <input
                  type="text"
                  value={formData.footerMadeInText || ""}
                  onChange={(e) => setFormData({ ...formData, footerMadeInText: e.target.value })}
                  onBlur={() => handleSave()}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CONTACTS & SOCIALS */}
      {/* ========================================================================= */}
      {activeSubTab === "contacts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Info */}
          <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>საკონტაქტო მონაცემები</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                ეს მონაცემები ავტომატურად ისახება ჰედერში, ფუტერში, FAQ-სა და საკონტაქტო ფანჯარაში.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                მთავარი ტელეფონის ნომერი:
              </label>
              <input
                type="text"
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                onBlur={() => handleSave()}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                საკონტაქტო ელფოსტა:
              </label>
              <input
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                onBlur={() => handleSave()}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                მისამართი (საწარმო / შოურუმი):
              </label>
              <input
                type="text"
                value={formData.contactAddress || ""}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                onBlur={() => handleSave()}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                სამუშაო საათები:
              </label>
              <input
                type="text"
                value={formData.contactWorkingHours || ""}
                onChange={(e) => setFormData({ ...formData, contactWorkingHours: e.target.value })}
                onBlur={() => handleSave()}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Right: Social Media */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>სოციალური ქსელები</span>
              </h4>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Facebook გვერდის ბმული:
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={formData.socials?.facebook || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, facebook: e.target.value },
                    })
                  }
                  onBlur={() => handleSave()}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Instagram პროფილის ბმული:
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourpage"
                  value={formData.socials?.instagram || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagram: e.target.value },
                    })
                  }
                  onBlur={() => handleSave()}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  WhatsApp პირდაპირი ჩატი (URL ან ნომერი):
                </label>
                <input
                  type="text"
                  placeholder="https://wa.me/995555123456"
                  value={formData.socials?.whatsapp || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, whatsapp: e.target.value },
                    })
                  }
                  onBlur={() => handleSave()}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
