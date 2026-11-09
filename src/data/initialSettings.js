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
  favicon: "/favicon.svg", // Custom favicon URL or data URL (defaults to /favicon.svg)
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

  // 9. SEO & Search Engine Optimization
  seo: {
    siteTitle: "MONOLITH.GE — არქიტექტურული ბეტონის ნაკეთობები საქართველოში",
    siteDescription:
      "უმაღლესი ხარისხის (M500 / F300) არქიტექტურული და დეკორატიული ბეტონის საწარმო საქართველოში: მონოლითური საფეხურები, დიდფორმატიანი ეზოს ფილები, ქოთნები და ურბანული ავეჯი.",
    keywords:
      "ბეტონის საფეხურები, კიბის საფეხურები, ეზოს ფილები, ბეტონის საყვავილეები, ურბანული ავეჯი, არქიტექტურული ბეტონი, ბეტონის ნაკეთობები თბილისი, M500 ბეტონი, F300 ყინვაგამძლეობა, საფეხურები ფასი",
    ogImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&fm=webp&w=1200&q=80",
    googleVerification: "", // Google Search Console verification token
    googleAnalyticsId: "", // G-XXXXXXXXXX
    customDomain: "https://concrete-products-rho.vercel.app",
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
  },

  // 10. Online Calculator Configuration
  calculator: {
    badge: "ონლაინ ხარჯთაღრიცხვის ხელსაწყო",
    title: "ბეტონის საფეხურებისა და ფილების კალკულატორი",
    subtitle:
      "მიუთითეთ თქვენი კიბის ზომები ან ეზოს ფართობი, მიიღეთ ზუსტი რაოდენობრივი გაანგარიშება, სავარაუდო წონა და ბიუჯეტი რეალურ დროში.",
    adhesiveRatio: 3.5, // 1 bag of adhesive per X linear meters
    defaultReserve: 5, // % default reserve for pavers
    stepLengths: [100, 120, 150, 180, 200, 240], // cm
    stepDepths: [30, 35, 40], // cm
    stepModels: [
      {
        id: "l-step",
        name: "L-ფორმის მონოლითური საფეხური",
        basePricePerMeter: 95,
        weightPerMeter: 38,
        desc: "საფეხური და ვერტიკალური ნაწილი (პადსტუპენოკი) ერთ მთლიან ნაჭერში, ნაკერის გარეშე.",
      },
      {
        id: "straight",
        name: "სწორი მასიური ბეტონის ფილა",
        basePricePerMeter: 75,
        weightPerMeter: 28,
        desc: "მინიმალისტური ჰორიზონტალური ბეტონის ფილა გარე და შიდა კიბეებისთვის.",
      },
      {
        id: "cantilever",
        name: "მცურავი / კონსოლური საფეხური",
        basePricePerMeter: 125,
        weightPerMeter: 45,
        desc: "გაძლიერებული შიდა კარკასით კედლიდან გამომავალი 'მცურავი' კიბის დიზაინისთვის.",
      },
    ],
    paverSizes: [
      {
        id: "60x60",
        name: "60 × 60 × 5 სმ",
        areaPerTile: 0.36,
        basePricePerSqm: 60,
        weightPerSqm: 115,
        desc: "იდეალურია საცალფეხო ბილიკებისა და მცირე ეზოებისთვის.",
      },
      {
        id: "80x80",
        name: "80 × 80 × 6 სმ",
        areaPerTile: 0.64,
        basePricePerSqm: 75,
        weightPerSqm: 140,
        desc: "ყველაზე მოთხოვნადი ფორმატი თანამედროვე ვილების ეზოებისთვის.",
      },
      {
        id: "100x100",
        name: "100 × 100 × 8 სმ",
        areaPerTile: 1.0,
        basePricePerSqm: 95,
        weightPerSqm: 190,
        desc: "მასიური არქიტექტურული ფილა მსუბუქი საავტომობილო დატვირთვისთვისაც.",
      },
      {
        id: "120x60",
        name: "120 × 60 × 6 სმ",
        areaPerTile: 0.72,
        basePricePerSqm: 85,
        weightPerSqm: 145,
        desc: "წაგრძელებული ელიტური გეომეტრია ტერასებისა და აუზის გარშემო სივრცისთვის.",
      },
    ],
  },
};

/**
 * Dynamically updates the browser's favicon tag (<link rel="icon">, <link rel="shortcut icon">, and <link rel="apple-touch-icon">)
 * with reliable mime-type resolution and Chrome cache-busting/immediate redraw support.
 */
export const applyFavicon = (iconUrl) => {
  if (typeof document === "undefined" || !iconUrl) return;

  try {
    const rawUrl = String(iconUrl).trim();
    if (!rawUrl) return;

    // Detect proper MIME type for maximum browser compatibility
    let mimeType = "image/png";
    if (rawUrl.startsWith("data:image/svg") || rawUrl.includes(".svg")) {
      mimeType = "image/svg+xml";
    } else if (rawUrl.startsWith("data:image/webp") || rawUrl.includes(".webp")) {
      mimeType = "image/webp";
    } else if (rawUrl.startsWith("data:image/jpeg") || rawUrl.includes(".jpg") || rawUrl.includes(".jpeg")) {
      mimeType = "image/jpeg";
    } else if (rawUrl.includes(".ico")) {
      mimeType = "image/x-icon";
    }

    // Remove existing favicon links to force browsers like Chrome to invalidate cache and redraw
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach((el) => el.remove());

    // 1. Primary standard icon
    const linkIcon = document.createElement("link");
    linkIcon.rel = "icon";
    linkIcon.type = mimeType;
    linkIcon.href = rawUrl;
    document.head.appendChild(linkIcon);

    // 2. Shortcut icon for legacy browsers
    const linkShortcut = document.createElement("link");
    linkShortcut.rel = "shortcut icon";
    linkShortcut.type = mimeType;
    linkShortcut.href = rawUrl;
    document.head.appendChild(linkShortcut);

    // 3. Apple Touch Icon for iOS Safari / Mac
    const linkApple = document.createElement("link");
    linkApple.rel = "apple-touch-icon";
    linkApple.href = rawUrl;
    document.head.appendChild(linkApple);
  } catch (err) {
    console.error("Failed to update favicon:", err);
  }
};
