import React, { useState } from "react";
import { useData } from "../../context/DataContext";
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
  Star,
  Info,
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

export default function HomeSectionsManager() {
  const { siteSettings, updateSiteSettings, resetSiteSettings } = useData();

  const [whyChooseUs, setWhyChooseUs] = useState(() => ({
    badge: siteSettings?.whyChooseUs?.badge || "საწარმოო სტანდარტი",
    title: siteSettings?.whyChooseUs?.title || "რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?",
    subtitle:
      siteSettings?.whyChooseUs?.subtitle ||
      "თითოეული ნაკეთობა გადის ვიბროჩამოსხმისა და თერმული გამოშრობის სრულ ტექნოლოგიურ ციკლს.",
    items: siteSettings?.whyChooseUs?.items
      ? [...siteSettings.whyChooseUs.items]
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

  const [trustSection, setTrustSection] = useState(() => ({
    badge: siteSettings?.trustSection?.badge || "სანდო პარტნიორობა",
    title:
      siteSettings?.trustSection?.title || "ჩვენ გვენდობიან წამყვანი დეველოპერები & არქიტექტორები",
    subtitle:
      siteSettings?.trustSection?.subtitle ||
      "ჩვენი არქიტექტურული ბეტონის ნაკეთობები ამშვენებს პრემიუმ საცხოვრებელ კომპლექსებს, სასტუმროებსა და კერძო ვილებს.",
    stats: siteSettings?.trustSection?.stats
      ? [...siteSettings.trustSection.stats]
      : [
          { id: "stat-1", value: "150+", label: "დასრულებული ობიექტი", highlight: false },
          { id: "stat-2", value: "15 000+", label: "მ² დაგებული ფილა", highlight: false },
          { id: "stat-3", value: "M500 / F300", label: "სერტიფიცირებული ბეტონი", highlight: true },
          { id: "stat-4", value: "10 წელი", label: "მასალის ოფიციალური გარანტია", highlight: false },
        ],
    partners: siteSettings?.trustSection?.partners
      ? [...siteSettings.trustSection.partners]
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

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updated = {
      ...siteSettings,
      whyChooseUs,
      trustSection,
    };
    await updateSiteSettings(updated);
    setIsSaving(false);
    setToast("მთავარი გვერდის ბლოკები წარმატებით შეინახა!");
    setTimeout(() => setToast(null), 3500);
  };

  const handleResetDefaults = () => {
    if (!window.confirm("გსურთ საწყის ტექსტებზე დაბრუნება?")) return;
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

    setToast("მნიშვნელობები აღდგა საწყისზე (დააჭირეთ შენახვას დასადასტურებლად).");
    setTimeout(() => setToast(null), 3500);
  };

  // Why Choose Us Helpers
  const handleUpdateItem = (id, field, value) => {
    setWhyChooseUs((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    }));
  };

  const handleAddItem = () => {
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

  const handleRemoveItem = (id) => {
    setWhyChooseUs((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  // Stats Helpers
  const handleUpdateStat = (id, field, value) => {
    setTrustSection((prev) => ({
      ...prev,
      stats: prev.stats.map((st) => (st.id === id ? { ...st, [field]: value } : st)),
    }));
  };

  const handleAddStat = () => {
    const newStat = {
      id: `stat-${Date.now()}`,
      value: "100%",
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

  // Partner Helpers
  const handleUpdatePartner = (id, field, value) => {
    setTrustSection((prev) => ({
      ...prev,
      partners: prev.partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const handleAddPartner = () => {
    const newPartner = {
      id: `p-${Date.now()}`,
      name: "ახალი პარტნიორი",
      role: "კომპანია",
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
    <div className="space-y-8 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl flex items-center justify-between gap-3 text-emerald-300 text-sm shadow-xl sticky top-20 z-50">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toast}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-xs text-emerald-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-stone-900 border border-stone-800 p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>მთავარი გვერდის ბლოკების რედაქტირება</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            შეცვალეთ „რატომ ირჩევენ ჩვენს ბეტონს?“ და „ჩვენ გვენდობიან“ სექციების ტექსტები, აიქონები და ციფრები.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition flex items-center gap-1.5"
            title="საწყისზე დაბრუნება"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>საწყისზე დაბრუნება</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
          </button>
        </div>
      </div>

      {/* ================= SECTION 1: WHY CHOOSE US ================= */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-7 space-y-6">
        <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm sm:text-base">
                სექცია 1: „რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?“
              </h3>
              <p className="text-[11px] text-stone-400">
                საწარმოო სტანდარტის 4 ძირითადი უპირატესობის ბარათი
              </p>
            </div>
          </div>
        </div>

        {/* Section Header Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-stone-400 block mb-1">
              პატარა ზედა წარწერა (Badge):
            </label>
            <input
              type="text"
              value={whyChooseUs.badge}
              onChange={(e) => setWhyChooseUs({ ...whyChooseUs, badge: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-400 block mb-1">
              მთავარი სათაური:
            </label>
            <input
              type="text"
              value={whyChooseUs.title}
              onChange={(e) => setWhyChooseUs({ ...whyChooseUs, title: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-[11px] font-bold text-stone-400 block mb-1">
              ქვესათაური / აღწერა:
            </label>
            <input
              type="text"
              value={whyChooseUs.subtitle}
              onChange={(e) => setWhyChooseUs({ ...whyChooseUs, subtitle: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300">
              უპირატესობების ბარათები ({whyChooseUs.items?.length || 0}):
            </span>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-stone-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ბარათის დამატება</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyChooseUs.items.map((item, idx) => {
              const IconComp = getFeatureIcon(item.icon);
              return (
                <div
                  key={item.id || idx}
                  className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3 relative group hover:border-stone-700 transition"
                >
                  {/* Top Bar with Icon & Delete */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                          ბარათი #{idx + 1}
                        </span>
                        <select
                          value={item.icon}
                          onChange={(e) => handleUpdateItem(item.id, "icon", e.target.value)}
                          className="bg-stone-900 border border-stone-800 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none focus:border-amber-500 mt-0.5"
                        >
                          {FEATURE_ICONS_LIST.map((ic) => (
                            <option key={ic.id} value={ic.id}>
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="ბარათის წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Title */}
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">სათაური:</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Card Description */}
                  <div>
                    <label className="text-[10px] text-stone-400 block mb-1">აღწერა:</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: TRUST & PARTNERS ================= */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-7 space-y-6">
        <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm sm:text-base">
                სექცია 2: „სანდო პარტნიორობა & ციფრები“ („ჩვენ გვენდობიან“)
              </h3>
              <p className="text-[11px] text-stone-400">
                სტატისტიკის 4 მაჩვენებელი და პარტნიორი კომპანიების ლოგო-სია
              </p>
            </div>
          </div>
        </div>

        {/* Section Header Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-stone-400 block mb-1">
              პატარა ზედა წარწერა (Badge):
            </label>
            <input
              type="text"
              value={trustSection.badge}
              onChange={(e) => setTrustSection({ ...trustSection, badge: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-stone-400 block mb-1">
              მთავარი სათაური:
            </label>
            <input
              type="text"
              value={trustSection.title}
              onChange={(e) => setTrustSection({ ...trustSection, title: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-[11px] font-bold text-stone-400 block mb-1">
              ქვესათაური / აღწერა:
            </label>
            <input
              type="text"
              value={trustSection.subtitle}
              onChange={(e) => setTrustSection({ ...trustSection, subtitle: e.target.value })}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Key Metrics / Stats List */}
        <div className="space-y-3 pt-2 border-t border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300">
              სტატისტიკის ციფრები ({trustSection.stats?.length || 0}):
            </span>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-stone-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ ციფრის დამატება</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {trustSection.stats.map((st, idx) => (
              <div
                key={st.id || idx}
                className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 font-bold uppercase">
                    მეტრიკა #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(st.id)}
                    className="p-1 text-stone-500 hover:text-red-400 transition"
                    title="წაშლა"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">მნიშვნელობა (დიდი ტექსტი):</label>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => handleUpdateStat(st.id, "value", e.target.value)}
                    placeholder="მაგ: 150+, 10 წელი"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1 text-sm font-black text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-stone-400 block mb-0.5">წარწერა (ქვედა ტექსტი):</label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => handleUpdateStat(st.id, "label", e.target.value)}
                    placeholder="მაგ: დასრულებული ობიექტი"
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-1 flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id={`stat-hl-${st.id}`}
                    checked={!!st.highlight}
                    onChange={(e) => handleUpdateStat(st.id, "highlight", e.target.checked)}
                    className="rounded border-stone-800 text-amber-500 focus:ring-0"
                  />
                  <label
                    htmlFor={`stat-hl-${st.id}`}
                    className="text-[10px] text-stone-400 cursor-pointer"
                  >
                    ყვითელი აქცენტი (Highlight)
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        <div className="space-y-3 pt-4 border-t border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300">
              პარტნიორი კომპანიები ({trustSection.partners?.length || 0}):
            </span>
            <button
              type="button"
              onClick={handleAddPartner}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-stone-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ პარტნიორის დამატება</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
            {trustSection.partners.map((p, idx) => (
              <div
                key={p.id || idx}
                className="bg-stone-950 border border-stone-800 rounded-xl p-2.5 space-y-1.5 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemovePartner(p.id)}
                  className="absolute top-1.5 right-1.5 p-1 text-stone-600 hover:text-red-400 transition"
                  title="წაშლა"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div>
                  <label className="text-[9px] text-stone-500 block">სახელი:</label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handleUpdatePartner(p.id, "name", e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded px-2 py-0.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-stone-500 block">სფერო / როლი:</label>
                  <input
                    type="text"
                    value={p.role}
                    onChange={(e) => handleUpdatePartner(p.id, "role", e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded px-2 py-0.5 text-[10px] text-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
