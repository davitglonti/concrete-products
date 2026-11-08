// Architectural concrete color finishes and textures
export const CONCRETE_TEXTURES = [
  {
    id: "classic-gray",
    name: "კლასიკური ნაცრისფერი",
    hex: "#8e9196",
    badge: "საბაზისო",
    priceMultiplier: 1.0,
    cssFilter: "brightness(1) contrast(1)",
    desc: "ბუნებრივი პორტლანდცემენტის კლასიკური ბრუტალისტური ტონალობა",
    finish: "გლუვი მქრქალი (Smooth Matte)",
    pigment: "სუფთა მინერალი (0% პიგმენტი)",
  },
  {
    id: "olive-green",
    name: "მწვანე / ზურმუხტისფერი",
    hex: "#3b6e4c",
    badge: "ეკო სტილი",
    priceMultiplier: 1.15,
    cssFilter: "hue-rotate(85deg) saturate(1.4) brightness(0.95)",
    desc: "ბუნებრივი მინერალური პიგმენტით მიღებული ორგანული მწვანე ტონალობა",
    finish: "ხავერდოვანი ბუნებრივი (Olive / Forest)",
    pigment: "Bayferrox Green (Chromium Oxide)",
  },
  {
    id: "anthracite",
    name: "გრაფიტი / ანტრაციტი",
    hex: "#2c3033",
    badge: "პოპულარული",
    priceMultiplier: 1.1,
    cssFilter: "brightness(0.72) contrast(1.18) grayscale(0.2)",
    desc: "გერმანული Bayferrox 330 შავი პიგმენტით გაჯერებული მუქი ურბანული ჩრდილი",
    finish: "დაძველებული / მიკრო-ტექსტურირებული",
    pigment: "Bayferrox Black (გერმანია)",
  },
  {
    id: "white-stone",
    name: "თეთრი არქიტექტურული",
    hex: "#f0efe9",
    badge: "პრემიუმი",
    priceMultiplier: 1.2,
    cssFilter: "brightness(1.22) contrast(0.92) saturate(0.8)",
    desc: "Aalborg White პრემიუმ თეთრი ცემენტითა და კვარცის ქვიშით დამზადებული ნათელი ზედაპირი",
    finish: "აბრეშუმისებრი გლუვი (Silk Finish)",
    pigment: "თეთრი პორტლანდცემენტი 52.5R",
  },
  {
    id: "terracotta",
    name: "ტერაკოტა / თიხისფერი",
    hex: "#9e5238",
    badge: "ექსკლუზივი",
    priceMultiplier: 1.15,
    cssFilter: "sepia(0.35) saturate(1.8) hue-rotate(-25deg)",
    desc: "თბილი მიწიერი ხმელთაშუაზღვისპირული ტონალობა კერძო ვილებისა და აივნებისთვის",
    finish: "ბუნებრივი ქვის ეფექტი",
    pigment: "Bayferrox 130 Red",
  },
  {
    id: "sandstone",
    name: "ქვიშისფერი / ბეჟი",
    hex: "#c6b08e",
    badge: "თბილი ტონი",
    priceMultiplier: 1.12,
    cssFilter: "sepia(0.3) saturate(1.5) hue-rotate(5deg)",
    desc: "თბილი ქვიშაქვის ელფერი, იდეალურად ერწყმის ბუნებრივ გამწვანებას და ხის დეტალებს",
    finish: "დაბზარვის საწინააღმდეგო ჰიდროფობიური",
    pigment: "Bayferrox 920 Yellow & Brown",
  },
  {
    id: "chocolate-brown",
    name: "ყავისფერი / შოკოლადი",
    hex: "#5c4033",
    badge: "მიწიერი ტონი",
    priceMultiplier: 1.14,
    cssFilter: "sepia(0.5) contrast(1.1) brightness(0.85)",
    desc: "მდიდარი ყავისფერი მიწიერი ტონალობა ბუნებრივი ხის ელემენტებთან კომბინაციისთვის",
    finish: "დაბზარვის საწინააღმდეგო",
    pigment: "Bayferrox 660 Brown",
  },
];

// Presets list for Admin and Quick selectors
export const COLOR_PRESETS = [
  { id: "classic-gray", name: "კლასიკური ნაცრისფერი", hex: "#8e9196" },
  { id: "olive-green", name: "მწვანე / ზურმუხტისფერი", hex: "#3b6e4c" },
  { id: "anthracite", name: "გრაფიტი / ანტრაციტი", hex: "#2c3033" },
  { id: "white-stone", name: "თეთრი არქიტექტურული", hex: "#f0efe9" },
  { id: "terracotta", name: "ტერაკოტა / თიხისფერი", hex: "#9e5238" },
  { id: "sandstone", name: "ქვიშისფერი / ბეჟი", hex: "#c6b08e" },
  { id: "chocolate-brown", name: "ყავისფერი / შოკოლადი", hex: "#5c4033" },
];

// Helper to find a texture / color details by name or id or fuzzy match
export const findColorDetails = (query) => {
  if (!query) return CONCRETE_TEXTURES[0];
  const q = String(query).toLowerCase().trim();
  
  // Exact or ID match
  const direct = CONCRETE_TEXTURES.find(
    (t) => t.id.toLowerCase() === q || t.name.toLowerCase() === q
  );
  if (direct) return direct;

  // Fuzzy matches
  if (q.includes("მწვან") || q.includes("green") || q.includes("ზურმუხტ") || q.includes("ოლივ")) {
    return CONCRETE_TEXTURES.find((t) => t.id === "olive-green");
  }
  if (q.includes("გრაფ") || q.includes("ანტრაც") || q.includes("შავ") || q.includes("black")) {
    return CONCRETE_TEXTURES.find((t) => t.id === "anthracite");
  }
  if (q.includes("თეთრ") || q.includes("white")) {
    return CONCRETE_TEXTURES.find((t) => t.id === "white-stone");
  }
  if (q.includes("ტერაკ") || q.includes("წითელ") || q.includes("red") || q.includes("თიხ")) {
    return CONCRETE_TEXTURES.find((t) => t.id === "terracotta");
  }
  if (q.includes("ქვიშ") || q.includes("ბეჟ") || q.includes("sand") || q.includes("beige")) {
    return CONCRETE_TEXTURES.find((t) => t.id === "sandstone");
  }
  if (q.includes("ყავისფ") || q.includes("brown") || q.includes("შოკოლ")) {
    return CONCRETE_TEXTURES.find((t) => t.id === "chocolate-brown");
  }
  if (q.includes("ნაცრის") || q.includes("gray") || q.includes("grey")) {
    return CONCRETE_TEXTURES.find((t) => t.id === "classic-gray");
  }

  // Fallback with custom label
  return {
    id: `custom-${q.replace(/[^a-z0-9]/gi, "-")}`,
    name: query,
    hex: "#78716c",
    badge: "მორგებული",
    priceMultiplier: 1.0,
    cssFilter: "none",
    desc: `არქიტექტურული შეფერილობა: ${query}`,
    finish: "ინდივიდუალური პიგმენტაცია",
    pigment: "მინერალური პიგმენტი შეკვეთით",
  };
};
