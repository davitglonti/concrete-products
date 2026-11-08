import { HERO_SLIDES } from "./initialData";

// Default site-wide configuration settings
export const DEFAULT_SITE_SETTINGS = {
  // 0. Hero Carousel Slides
  heroSlides: HERO_SLIDES,

  // 1. Branding & Identity
  brandName: "MONOLITH",
  brandSuffix: ".GE",
  brandTagline: "არქიტექტურული ბეტონი",
  logoType: "icon", // "icon" | "image"
  logoImage: "", // URL or Base64 data URL
  logoHeight: 36, // px height
  showBrandTextWithLogo: true, // show brand text next to custom logo image

  // 2. Favicon
  favicon: "", // Custom favicon URL or data URL
  syncFaviconWithLogo: true, // if true, uses logoImage as the browser tab favicon

  // 3. Navbar Navigation Links & CTA
  navbarLinks: [
    { id: "nav-home", label: "მთავარი", path: "/", enabled: true, isExternal: false },
    { id: "nav-products", label: "პროდუქცია", path: "/products", enabled: true, isExternal: false },
    { id: "nav-calc", label: "კალკულატორი", path: "/calculator", enabled: true, isExternal: false },
    { id: "nav-portfolio", label: "შესრულებული სამუშაოები", path: "/portfolio", enabled: true, isExternal: false },
    { id: "nav-blog", label: "ბლოგი", path: "/blog", enabled: true, isExternal: false },
    { id: "nav-faq", label: "კითხვა-პასუხი", path: "/faq", enabled: false, isExternal: false },
  ],
  navbarCtaText: "დაგვიკავშირდით",
  showNavbarCta: true,
  showNavbarFavorites: true,
  showNavbarThemeToggle: true,

  // 4. Footer Configuration
  footerDescription:
    "მაღალი სიმტკიცის არქიტექტურული და ლანდშაფტის ბეტონის ნაკეთობები. მონოლითური საფეხურები, დიდფორმატიანი ფილები, საყვავილეები და ურბანული ავეჯი.",
  footerCopyright: `© ${new Date().getFullYear()} MONOLITH.GE — ყველა უფლება დაცულია.`,
  footerMadeInText: "დამზადებულია საქართველოში 🇬🇪",
  footerLinks: [
    { id: "foot-home", label: "მთავარი", path: "/", enabled: true, isExternal: false },
    { id: "foot-products", label: "პროდუქციის კატალოგი", path: "/products", enabled: true, isExternal: false },
    { id: "foot-calc", label: "ონლაინ კალკულატორი", path: "/calculator", enabled: true, isExternal: false },
    { id: "foot-portfolio", label: "შესრულებული სამუშაოები", path: "/portfolio", enabled: true, isExternal: false },
    { id: "foot-blog", label: "ბლოგი & გზამკვლევი", path: "/blog", enabled: true, isExternal: false },
    { id: "foot-faq", label: "კითხვა-პასუხი (FAQ)", path: "/faq", enabled: true, isExternal: false },
    { id: "foot-admin", label: "ადმინ პანელი (/admin)", path: "/admin", enabled: true, isExternal: false },
  ],

  // 5. Contact Information (Navbar modal, Footer, FAQ, etc.)
  contactPhone: "+995 555 12 34 56",
  contactPhone2: "",
  contactEmail: "info@monolith.ge",
  contactAddress: "თბილისი, საქართველო (საწარმო & შოურუმი)",
  contactWorkingHours: "ორშაბათი - შაბათი: 09:00 - 19:00",

  // 6. Social Media Links
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me/995555123456",
    tiktok: "",
    youtube: "",
  },

  // 7. Homepage "Why Choose Us" (საწარმოო სტანდარტი)
  whyChooseUs: {
    badge: "საწარმოო სტანდარტი",
    title: "რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?",
    subtitle: "თითოეული ნაკეთობა გადის ვიბროჩამოსხმისა და თერმული გამოშრობის სრულ ტექნოლოგიურ ციკლს.",
    items: [
      {
        id: "feat-1",
        icon: "Snowflake",
        title: "ყინვაგამძლეობა F300",
        description: "სპეციალური ჰიდროფობიური დანამატები გამორიცხავს წყლის შეწოვას და ბზარების გაჩენას მკაცრ ზამთარშიც.",
      },
      {
        id: "feat-2",
        icon: "ShieldCheck",
        title: "მაღალი სიმტკიცე (M500)",
        description: "ბაზალტისა და პოლიპროპილენის ფიბრო-ბოჭკოთი არმირებული სტრუქტურა უძლებს მაღალ სტატიკურ და დინამიკურ დატვირთვას.",
      },
      {
        id: "feat-3",
        icon: "Sparkles",
        title: "მდგრადი პიგმენტაცია",
        description: "ვიყენებთ გერმანულ (Bayferrox) მინერალურ პიგმენტებს, რომლებიც სრულ მასაშია შერეული და მზეზე არ ხუნდება.",
      },
      {
        id: "feat-4",
        icon: "Compass",
        title: "ინდივიდუალური ყალიბები",
        description: "სტანდარტული კატალოგის გარდა, ვამზადებთ არასტანდარტული ზომის საფეხურებსა და საყვავილეებს არქიტექტორის ნახაზით.",
      },
    ],
  },

  // 8. Homepage "Trust & Partners" (სანდო პარტნიორობა)
  trustSection: {
    badge: "სანდო პარტნიორობა",
    title: "ჩვენ გვენდობიან წამყვანი დეველოპერები & არქიტექტორები",
    subtitle: "ჩვენი არქიტექტურული ბეტონის ნაკეთობები ამშვენებს პრემიუმ საცხოვრებელ კომპლექსებს, სასტუმროებსა და კერძო ვილებს.",
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
  },
};

/**
 * Dynamically updates the browser's favicon tag (<link rel="shortcut icon"> and <link rel="apple-touch-icon">)
 */
export const applyFavicon = (iconUrl) => {
  if (typeof document === "undefined" || !iconUrl) return;

  try {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "shortcut icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.type = iconUrl.startsWith("data:image/svg") ? "image/svg+xml" : "image/x-icon";
    link.href = iconUrl;

    let appleLink = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement("link");
      appleLink.rel = "apple-touch-icon";
      document.getElementsByTagName("head")[0].appendChild(appleLink);
    }
    appleLink.href = iconUrl;
  } catch (err) {
    console.error("Failed to update favicon:", err);
  }
};
