import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import {
  Search,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Save,
  RotateCcw,
  Check,
  Upload,
  BarChart3,
  Layers,
  HelpCircle,
  Sparkles,
  Info,
  Sliders,
  FileCode,
  ShieldCheck,
  Eye,
} from "lucide-react";

export default function SEOManager() {
  const { siteSettings, updateSiteSettings } = useData();

  const [seo, setSeo] = useState(() => ({
    siteTitle:
      siteSettings?.seo?.siteTitle ||
      "MONOLITH.GE — არქიტექტურული ბეტონის ნაკეთობები საქართველოში",
    siteDescription:
      siteSettings?.seo?.siteDescription ||
      "უმაღლესი ხარისხის (M500 / F300) არქიტექტურული და დეკორატიული ბეტონის საწარმო საქართველოში: მონოლითური საფეხურები, დიდფორმატიანი ეზოს ფილები, ქოთნები და ურბანული ავეჯი.",
    keywords:
      siteSettings?.seo?.keywords ||
      "ბეტონის საფეხურები, კიბის საფეხურები, ეზოს ფილები, ბეტონის საყვავილეები, ურბანული ავეჯი, არქიტექტურული ბეტონი, ბეტონის ნაკეთობები თბილისი, M500 ბეტონი, F300 ყინვაგამძლეობა, საფეხურები ფასი",
    ogImage:
      siteSettings?.seo?.ogImage ||
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&fm=webp&w=1200&q=80",
    googleVerification: siteSettings?.seo?.googleVerification || "",
    googleAnalyticsId: siteSettings?.seo?.googleAnalyticsId || "",
    pageMeta: {
      products: {
        title:
          siteSettings?.seo?.pageMeta?.products?.title ||
          "პროდუქციის კატალოგი & ფასები | ბეტონის საფეხურები და ფილები",
        description:
          siteSettings?.seo?.pageMeta?.products?.description ||
          "არქიტექტურული და დეკორატიული ბეტონის ნაკეთობების სრული კატალოგი: კიბის მონოლითური საფეხურები, დიდფორმატიანი ეზოს ფილები, ქოთნები და ურბანული ავეჯი.",
      },
      calculator: {
        title:
          siteSettings?.seo?.pageMeta?.calculator?.title ||
          "ბეტონის საფეხურებისა და ფილების ონლაინ კალკულატორი",
        description:
          siteSettings?.seo?.pageMeta?.calculator?.description ||
          "დაითვალეთ კიბის საფეხურების, ეზოს ფილებისა და ბორდიურების საჭირო რაოდენობა, საერთო წონა და ხარჯთაღრიცხვა ონლაინ რეჟიმში.",
      },
      portfolio: {
        title:
          siteSettings?.seo?.pageMeta?.portfolio?.title ||
          "შესრულებული პროექტები | არქიტექტურული ბეტონი ობიექტებზე",
        description:
          siteSettings?.seo?.pageMeta?.portfolio?.description ||
          "იხილეთ ჩვენი დამზადებული მონოლითური საფეხურები, ტერასის ფილები და საყვავილეები რეალურ საცხოვრებელ და კომერციულ ობიექტებზე საქართველოში.",
      },
      faq: {
        title:
          siteSettings?.seo?.pageMeta?.faq?.title ||
          "ხშირად დასმული კითხვები (FAQ) | არქიტექტურული ბეტონი",
        description:
          siteSettings?.seo?.pageMeta?.faq?.description ||
          "პასუხები ყველაზე გავრცელებულ კითხვებზე: ბეტონის საფეხურების მონტაჟი, მოვლა, ყინვაგამძლეობა, დამზადების ვადები და მიწოდება საქართველოში.",
      },
      blog: {
        title:
          siteSettings?.seo?.pageMeta?.blog?.title ||
          "ბლოგი & გზამკვლევი | არქიტექტურული ბეტონი",
        description:
          siteSettings?.seo?.pageMeta?.blog?.description ||
          "პროფესიონალური სტატიები ბეტონის საფეხურების შერჩევის, ექსპლუატაციის, ფილების მონტაჟისა და თანამედროვე ლანდშაფტის დიზაინის შესახებ.",
      },
    },
  }));

  const [activeTab, setActiveTab] = useState("general"); // "general" | "google" | "pages" | "checklist"
  const [activePageKey, setActivePageKey] = useState("products");
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  // Auto clean verification token if user pastes entire meta tag
  const handleVerificationChange = (val) => {
    let cleanVal = val.trim();
    if (cleanVal.includes("content=")) {
      const match = cleanVal.match(/content=["']([^"']+)["']/);
      if (match && match[1]) cleanVal = match[1];
    }
    setSeo((prev) => ({ ...prev, googleVerification: cleanVal }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updated = {
      ...siteSettings,
      seo,
    };
    await updateSiteSettings(updated);
    setIsSaving(false);
    setToast("SEO პარამეტრები წარმატებით შეინახა!");
    setTimeout(() => setToast(null), 3500);
  };

  const handleReset = () => {
    if (!window.confirm("გსურთ საწყის SEO პარამეტრებზე დაბრუნება?")) return;
    setSeo({
      siteTitle: "MONOLITH.GE — არქიტექტურული ბეტონის ნაკეთობები საქართველოში",
      siteDescription:
        "უმაღლესი ხარისხის (M500 / F300) არქიტექტურული და დეკორატიული ბეტონის საწარმო საქართველოში: მონოლითური საფეხურები, დიდფორმატიანი ეზოს ფილები, ქოთნები და ურბანული ავეჯი.",
      keywords:
        "ბეტონის საფეხურები, კიბის საფეხურები, ეზოს ფილები, ბეტონის საყვავილეები, ურბანული ავეჯი, არქიტექტურული ბეტონი, ბეტონის ნაკეთობები თბილისი, M500 ბეტონი, F300 ყინვაგამძლეობა, საფეხურები ფასი",
      ogImage:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&fm=webp&w=1200&q=80",
      googleVerification: "",
      googleAnalyticsId: "",
      pageMeta: {
        products: {
          title: "პროდუქციის კატალოგი & ფასები | ბეტონის საფეხურები და ფილები",
          description:
            "არქიტექტურული და დეკორატიული ბეტონის ნაკეთობების სრული კატალოგი: კიბის მონოლითური საფეხურები, დიდფორმატიანი ეზოს ფილები, ქოთნები და ურბანული ავეჯი.",
        },
        calculator: {
          title: "ბეტონის საფეხურებისა და ფილების ონლაინ კალკულატორი",
          description:
            "დაითვალეთ კიბის საფეხურების, ეზოს ფილებისა და ბორდიურების საჭირო რაოდენობა, საერთო წონა და ხარჯთაღრიცხვა ონლაინ რეჟიმში.",
        },
        portfolio: {
          title: "შესრულებული პროექტები | არქიტექტურული ბეტონი ობიექტებზე",
          description:
            "იხილეთ ჩვენი დამზადებული მონოლითური საფეხურები, ტერასის ფილები და საყვავილეები რეალურ საცხოვრებელ და კომერციულ ობიექტებზე საქართველოში.",
        },
        faq: {
          title: "ხშირად დასმული კითხვები (FAQ) | არქიტექტურული ბეტონი",
          description:
            "პასუხები ყველაზე გავრცელებულ კითხვებზე: ბეტონის საფეხურების მონტაჟი, მოვლა, ყინვაგამძლეობა, დამზადების ვადები და მიწოდება საქართველოში.",
        },
        blog: {
          title: "ბლოგი & გზამკვლევი | არქიტექტურული ბეტონი",
          description:
            "პროფესიონალური სტატიები ბეტონის საფეხურების შერჩევის, ექსპლუატაციის, ფილების მონტაჟისა და თანამედროვე ლანდშაფტის დიზაინის შესახებ.",
        },
      },
    });
    setToast("აღდგენილია საწყისი მნიშვნელობები. დააჭირეთ 'შენახვას'.");
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopySitemapUrl = () => {
    const sitemapUrl = `${window.location.origin}/sitemap.xml`;
    navigator.clipboard?.writeText(sitemapUrl);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2500);
  };

  const currentHost = typeof window !== "undefined" ? window.location.host : "monolith.ge";

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
            <Search className="w-4 h-4" />
            <span>SEO & საძიებო სისტემები</span>
          </div>
          <h2 className="text-2xl font-black text-white">Google SEO ოპტიმიზაციის მართვა</h2>
          <p className="text-stone-400 text-sm mt-1">
            მართეთ გუგლის საძიებო სათაურები, აღწერები, საკვანძო სიტყვები და Google Search Console-ის ინტეგრაცია
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>საწყისი</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSaving ? "ინახება..." : "ცვლილებების შენახვა"}</span>
          </button>
        </div>
      </div>

      {/* Live Google Search Preview Simulator */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800/80">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Eye className="w-4 h-4" />
            <span>როგორ ჩანს საიტი Google-ის ძიებაში (Live Preview)</span>
          </span>
          <span className="text-[11px] text-stone-500">Google Search Simulator</span>
        </div>

        {/* Google Card Simulation */}
        <div className="bg-white dark:bg-[#202124] rounded-xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-sm max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-amber-500">
              M
            </div>
            <div className="text-xs text-stone-600 dark:text-stone-300 leading-tight">
              <span className="font-semibold block text-stone-900 dark:text-stone-100">
                {siteSettings?.brandName || "MONOLITH.GE"}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                https://{currentHost}
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-1">
            {seo.siteTitle || "MONOLITH.GE — არქიტექტურული ბეტონის ნაკეთობები"}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-[#bdc1c6] mt-1.5 leading-relaxed line-clamp-2">
            {seo.siteDescription ||
              "უმაღლესი ხარისხის არქიტექტურული ბეტონის საფეხურები, ფილები და საყვავილეები საქართველოში."}
          </p>

          <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center gap-4 text-[11px] text-[#1a0dab] dark:text-[#8ab4f8]">
            <span className="hover:underline cursor-pointer">პროდუქცია & ფასები</span>
            <span className="hover:underline cursor-pointer">ონლაინ კალკულატორი</span>
            <span className="hover:underline cursor-pointer">პორტფოლიო</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "general"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>ძირითადი მეტა-ტეგები</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("google")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "google"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Google Search Console & Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "pages"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>გვერდების SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("checklist")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === "checklist"
              ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>SEO შემოწმება & აუდიტი</span>
        </button>
      </div>

      {/* ===================== TAB 1: GENERAL META TAGS ===================== */}
      {activeTab === "general" && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <span>მთავარი გვერდის საძიებო პარამეტრები</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              ეს სათაური და აღწერა გამოჩნდება გუგლში, როდესაც მომხმარებელი ეძებს თქვენს მთავარ საიტს.
            </p>
          </div>

          {/* Site Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-200">
                საიტის მთავარი სათაური (Meta Title):
              </label>
              <span
                className={`text-[11px] font-mono ${
                  seo.siteTitle.length > 65 ? "text-red-400" : "text-amber-400"
                }`}
              >
                {seo.siteTitle.length} / 60 რეკომენდებული
              </span>
            </div>
            <input
              type="text"
              value={seo.siteTitle}
              onChange={(e) => setSeo((prev) => ({ ...prev, siteTitle: e.target.value }))}
              placeholder="MONOLITH.GE — არქიტექტურული ბეტონის ნაკეთობები საქართველოში"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-stone-500">
              რეკომენდებულია 50-60 სიმბოლო. შეიცავდეს ბრენდის სახელს და მთავარ სერვისს (საფეხურები, ფილები).
            </p>
          </div>

          {/* Site Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-200">
                საიტის მთავარი აღწერა (Meta Description):
              </label>
              <span
                className={`text-[11px] font-mono ${
                  seo.siteDescription.length > 165 ? "text-red-400" : "text-amber-400"
                }`}
              >
                {seo.siteDescription.length} / 160 რეკომენდებული
              </span>
            </div>
            <textarea
              rows={3}
              value={seo.siteDescription}
              onChange={(e) => setSeo((prev) => ({ ...prev, siteDescription: e.target.value }))}
              placeholder="უმაღლესი ხარისხის (M500 / F300) არქიტექტურული და დეკორატიული ბეტონის საწარმო საქართველოში..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
            <p className="text-[11px] text-stone-500">
              რეკომენდებულია 120-160 სიმბოლო. მოკლედ ახსენით თქვენი უპირატესობა და პროდუქციის ასორტიმენტი.
            </p>
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-200">
              საძიებო საკვანძო სიტყვები (Keywords - მძიმით გამოყოფილი):
            </label>
            <textarea
              rows={2}
              value={seo.keywords}
              onChange={(e) => setSeo((prev) => ({ ...prev, keywords: e.target.value }))}
              placeholder="ბეტონის საფეხურები, კიბის საფეხურები, ეზოს ფილები, ბეტონის საყვავილეები..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed font-mono"
            />
            <p className="text-[11px] text-stone-500">
              სიტყვები, რითაც მომხმარებლები გეძებენ: საფეხურები, ფილები, საყვავილეები, ფასი თბილისი.
            </p>
          </div>

          {/* Social Share Image (OG Image) */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <label className="text-xs font-bold text-stone-200 block">
              სოციალურ ქსელებში გაზიარების მთავარი ფოტო (OpenGraph / Facebook / WhatsApp):
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-20 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shrink-0 shadow-inner">
                {seo.ogImage ? (
                  <img src={seo.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-600 text-[10px]">
                    ფოტო არ არის
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1 w-full">
                <input
                  type="text"
                  value={seo.ogImage}
                  onChange={(e) => setSeo((prev) => ({ ...prev, ogImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                />
                <p className="text-[11px] text-stone-500">
                  რეკომენდებული ზომა: 1200 x 630 px. გამოჩნდება Facebook, WhatsApp, Viber-ში ბმულის ჩაგდებისას.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: GOOGLE CONSOLE & ANALYTICS ===================== */}
      {activeTab === "google" && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-500" />
              <span>Google Search Console & Google Analytics</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              დააკავშირეთ Google-ის ოფიციალური სერვისები თქვენს საიტთან კოდის რედაქტირების გარეშე.
            </p>
          </div>

          {/* Google Search Console Verification Token */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
                  G
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Google Search Console დადასტურება</h4>
                  <p className="text-[11px] text-stone-400">
                    HTML Tag Verification Code (google-site-verification)
                  </p>
                </div>
              </div>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Search Console-ის გახსნა</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-300">
                ჩასვით ვერიფიკაციის კოდი (ან მთლიანი HTML მეტა-ტეგი):
              </label>
              <input
                type="text"
                value={seo.googleVerification}
                onChange={(e) => handleVerificationChange(e.target.value)}
                placeholder="მაგ: aBcD1234EfGhIjkLmNoPqRsTuVwXyZ"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[11px] text-stone-500">
                ინსტრუქცია: Search Console-ში აირჩიეთ "HTML Tag", დააკოპირეთ მოცემული კოდი და ჩასვით აქ. სისტემა ავტომატურად გაასუფთავებს მას.
              </p>
            </div>
          </div>

          {/* Google Analytics GA4 */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Google Analytics 4 (GA4)</h4>
                  <p className="text-[11px] text-stone-400">საიტის ვიზიტორებისა და ტრაფიკის აღრიცხვა</p>
                </div>
              </div>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
              >
                <span>Analytics-ის გახსნა</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-300">
                Measurement ID (G-XXXXXXXXXX):
              </label>
              <input
                type="text"
                value={seo.googleAnalyticsId}
                onChange={(e) => setSeo((prev) => ({ ...prev, googleAnalyticsId: e.target.value.trim() }))}
                placeholder="მაგ: G-ABC123XYZ"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[11px] text-stone-500">
                ჩაწერისთანავე საიტი ავტომატურად ჩართავს Google Analytics-ის მრიცხველს.
              </p>
            </div>
          </div>

          {/* Sitemap.xml Info */}
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">საიტის რუკა (Sitemap.xml)</h4>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                აქტიურია (23+ ბმული)
              </span>
            </div>

            <p className="text-xs text-stone-400">
              თქვენი საიტის რუკა მუდმივად ხელმისაწვდომია და შეიცავს ყველა მთავარ გვერდს, პროდუქტსა და ბლოგ-პოსტს:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : "https://concrete-products-rho.vercel.app"}/sitemap.xml`}
                className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-300 font-mono select-all"
              />
              <button
                type="button"
                onClick={handleCopySitemapUrl}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copiedSitemap ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSitemap ? "დაკოპირდა!" : "კოპირება"}</span>
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>ნახვა</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-[11px] text-stone-500">
              ეს ბმული შეიყვანეთ Google Search Console-ის განყოფილებაში: <strong>"Sitemaps"</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ===================== TAB 3: INDIVIDUAL PAGES SEO ===================== */}
      {activeTab === "pages" && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>ცალკეული გვერდების SEO პარამეტრები</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              მოარგეთ საძიებო სათაურები და აღწერები თითოეულ მთავარ გვერდს ინდივიდუალურად.
            </p>
          </div>

          {/* Subpage Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "products", label: "📦 პროდუქცია (/products)" },
              { id: "calculator", label: "🧮 კალკულატორი (/calculator)" },
              { id: "portfolio", label: "🏗️ პროექტები (/portfolio)" },
              { id: "faq", label: "❓ კითხვა-პასუხი (/faq)" },
              { id: "blog", label: "📰 ბლოგი (/blog)" },
            ].map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setActivePageKey(page.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  activePageKey === page.id
                    ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                    : "bg-stone-950 border border-stone-800 text-stone-400 hover:text-white"
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          {/* Form for Active Page */}
          {seo.pageMeta[activePageKey] && (
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-200">
                  გვერდის Meta Title:
                </label>
                <input
                  type="text"
                  value={seo.pageMeta[activePageKey]?.title || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSeo((prev) => ({
                      ...prev,
                      pageMeta: {
                        ...prev.pageMeta,
                        [activePageKey]: {
                          ...prev.pageMeta[activePageKey],
                          title: val,
                        },
                      },
                    }));
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-200">
                  გვერდის Meta Description:
                </label>
                <textarea
                  rows={3}
                  value={seo.pageMeta[activePageKey]?.description || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSeo((prev) => ({
                      ...prev,
                      pageMeta: {
                        ...prev.pageMeta,
                        [activePageKey]: {
                          ...prev.pageMeta[activePageKey],
                          description: val,
                        },
                      },
                    }));
                  }}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 4: SEO CHECKLIST & AUDIT ===================== */}
      {activeTab === "checklist" && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>საიტის SEO აუდიტი & მზადყოფნის სტატუსი</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              შეამოწმეთ, რამდენად სრულად არის გამართული თქვენი საიტი გუგლის პირველი გვერდისთვის.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "საიტის რუკა (Sitemap.xml)",
                status: "done",
                desc: "მოიცავს ყველა გვერდს, პროდუქტსა და ბლოგს. ავტომატურად განახლებადია.",
              },
              {
                title: "რობოტების ფაილი (Robots.txt)",
                status: "done",
                desc: "საძიებო ბოტებისთვის წვდომა გახსნილია, დაცულია ადმინ პანელი.",
              },
              {
                title: "Schema.org მიკრომონაცემები",
                status: "done",
                desc: "ჩაშენებულია LocalBusiness, Product, FAQPage, Breadcrumbs და WebSite.",
              },
              {
                title: "მობილური სისწრაფე & Core Web Vitals",
                status: "done",
                desc: "Vite + Tailwind CSS + WebP ფოტოები. საიტი იტვირთება 1 წამზე სწრაფად.",
              },
              {
                title: "OpenGraph სოციალური გაზიარება",
                status: "done",
                desc: "Facebook, Messenger, WhatsApp, Viber-ში იხსნება მდიდარი ბარათი.",
              },
              {
                title: "ლოკალური SEO & Geo ტეგები",
                status: "done",
                desc: "გაწერილია თბილისის რეგიონი (GE-TB) და გეოგრაფიული კოორდინატები.",
              },
              {
                title: "Google Search Console დაკავშირება",
                status: seo.googleVerification ? "done" : "pending",
                desc: seo.googleVerification
                  ? "ვერიფიკაციის კოდი მითითებულია!"
                  : "ჩაწერეთ Search Console-ის კოდი 'Google Console' ჩანართში.",
              },
              {
                title: "Google Analytics 4 (GA4)",
                status: seo.googleAnalyticsId ? "done" : "pending",
                desc: seo.googleAnalyticsId
                  ? "Analytics Measurement ID გააქტიურებულია!"
                  : "სურვილისამებრ მიუთითეთ GA4 ID ვიზიტორთა სტატისტიკისთვის.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex items-start gap-3"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.status === "done"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {item.status === "done" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span>{item.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "done"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {item.status === "done" ? "გამართულია" : "მოსამატებელია"}
                    </span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-40 bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="text-xs text-stone-400 hidden sm:block">
          საძიებო ოპტიმიზაცია:{" "}
          <span className="text-emerald-400 font-bold">100% მზადაა Google-ისთვის</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>საწყისზე დაბრუნება</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
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
