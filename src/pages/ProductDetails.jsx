import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCompare } from "../context/CompareContext";
import ProductCard from "../components/ui/ProductCard";
import { CONCRETE_TEXTURES, findColorDetails } from "../data/textureData";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Image as ImageIcon,
  Sparkles,
  Phone,
  Clock,
  Award,
  Truck,
  Scale,
  Palette,
  Calculator,
  Camera,
  Check,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addInquiry } = useData();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();
  const product = products.find((p) => p.id === id);

  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeVariantId, setActiveVariantId] = useState(null);

  // Collect all images (array or single string fallback)
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.image) {
      return [product.image];
    }
    return [];
  }, [product]);

  // Compute ACTUAL available color variants (strictly if the item actually has other colors)
  const actualVariants = useMemo(() => {
    if (!product) return [];
    const variants = [];
    const seenColors = new Set();

    // 1. Explicit product.colorVariants
    if (Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
      // Base Product Variant
      const baseName =
        product.baseColorName || (product.colors && product.colors[0]) || "კლასიკური ნაცრისფერი";
      const baseImages =
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : product.image
          ? [product.image]
          : [];
      const baseDetails = findColorDetails(baseName);
      seenColors.add(baseName.toLowerCase());

      variants.push({
        id: "base-variant",
        name: baseName,
        hex: product.baseColorHex || baseDetails.hex,
        image: baseImages[0] || "",
        images: baseImages,
        price: product.price,
        isSibling: false,
      });

      // Additional Color Variants
      product.colorVariants.forEach((cv, idx) => {
        const name = cv.colorName || cv.name || `ფერი ${idx + 1}`;
        if (seenColors.has(name.toLowerCase())) return;
        seenColors.add(name.toLowerCase());
        const details = findColorDetails(name);
        const varImages =
          Array.isArray(cv.images) && cv.images.length > 0
            ? cv.images
            : cv.image
            ? [cv.image]
            : [];
        variants.push({
          id: cv.id || `var-${idx}`,
          name,
          hex: cv.colorHex || cv.hex || details.hex,
          image: varImages[0] || (cv.imageIndex !== undefined ? images[cv.imageIndex] : images[0]),
          images: varImages.length > 0 ? varImages : [images[0] || ""],
          price: cv.price ? cv.price : product.price,
          isSibling: false,
        });
      });

      return variants;
    }

    // 2. Legacy fallback: Images within this product tagged with colors
    const imageColors = product.imageColors || {};
    const hasAssignedColors = Object.keys(imageColors).length > 0;
    const isMultiColor =
      images.length >= 2 &&
      (images[1].includes("1485955900006") ||
        images[1].toLowerCase().includes("green") ||
        (product.colors && product.colors.length > 1));

    if (hasAssignedColors || isMultiColor) {
      images.forEach((img, idx) => {
        let cName = imageColors[idx] || imageColors[String(idx)];
        if (!cName && isMultiColor) {
          cName = idx === 1 ? "მწვანე" : "კლასიკური ნაცრისფერი";
        }
        if (cName && !seenColors.has(cName.toLowerCase())) {
          seenColors.add(cName.toLowerCase());
          const details = findColorDetails(cName);
          const colorImgs = images.filter((_, i) => {
            const ic = imageColors[i] || imageColors[String(i)];
            return ic
              ? ic.toLowerCase() === cName.toLowerCase()
              : isMultiColor && (idx === 1 ? i === 1 : i === 0);
          });
          variants.push({
            id: `img-var-${idx}`,
            name: cName,
            hex: details.hex,
            image: img,
            images: colorImgs.length > 0 ? colorImgs : [img],
            isSibling: false,
          });
        }
      });
    }

    // 3. Sibling products in the catalog that are the exact same item in another color
    const baseTitle = product.name
      .replace(/\s*\([^)]*\)/g, "")
      .replace(/\s*-\s*(მწვანე|ნაცრისფერი|თეთრი|შავი|წითელი|ბეჟი|ტერაკოტა|ანტრაციტი).*/gi, "")
      .trim()
      .toLowerCase();

    if (products && baseTitle.length >= 3) {
      products.forEach((p) => {
        if (p.id === product.id) return;
        const otherBase = p.name
          .replace(/\s*\([^)]*\)/g, "")
          .replace(/\s*-\s*(მწვანე|ნაცრისფერი|თეთრი|შავი|წითელი|ბეჟი|ტერაკოტა|ანტრაციტი).*/gi, "")
          .trim()
          .toLowerCase();

        const isMatchingItem =
          p.category === product.category &&
          (otherBase === baseTitle ||
            p.name.toLowerCase().startsWith(baseTitle) ||
            product.name.toLowerCase().startsWith(otherBase));

        if (isMatchingItem) {
          let colorName = p.colors?.[0] || "";
          if (!colorName) {
            const match = p.name.match(/\(([^)]+)\)/) || p.name.match(/-\s*([^\s-]+)/);
            colorName = match ? match[1].trim() : p.name;
          }
          if (!seenColors.has(colorName.toLowerCase())) {
            seenColors.add(colorName.toLowerCase());
            const details = findColorDetails(colorName);
            variants.push({
              id: `sibling-${p.id}`,
              name: colorName,
              hex: details.hex,
              image: p.image || p.images?.[0] || "",
              price: p.price,
              isSibling: true,
              productId: p.id,
            });
          }
        }
      });
    }

    // Ensure the current product itself is present as the primary variant if other variants exist
    if (
      variants.length > 0 &&
      !variants.some((v) => v.id.startsWith("img-var-0") || v.image === images[0])
    ) {
      const primaryColorName = product.colors?.[0] || "სტანდარტული";
      if (!seenColors.has(primaryColorName.toLowerCase())) {
        variants.unshift({
          id: "primary-var",
          name: primaryColorName,
          hex: findColorDetails(primaryColorName).hex,
          image: images[0] || "",
          images: [images[0] || ""],
          isSibling: false,
        });
      }
    }

    return variants;
  }, [product, images, products]);

  // Selected variant
  const activeVariant = useMemo(() => {
    if (actualVariants.length === 0) return null;
    return actualVariants.find((v) => v.id === activeVariantId) || actualVariants[0];
  }, [actualVariants, activeVariantId]);

  // Gallery images for the currently selected variant
  const currentGalleryImages = useMemo(() => {
    if (activeVariant?.images && activeVariant.images.length > 0) {
      return activeVariant.images;
    }
    if (activeVariant?.image) {
      return [activeVariant.image];
    }
    if (images.length > 0) {
      return images;
    }
    return [];
  }, [activeVariant, images]);

  const activeImage =
    currentGalleryImages[selectedImageIndex] ||
    currentGalleryImages[0] ||
    images[0] ||
    "";

  // Scroll to top and reset image index when product id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedImageIndex(0);
    if (actualVariants.length > 0) {
      setActiveVariantId(actualVariants[0].id);
    } else {
      setActiveVariantId(null);
    }
  }, [id, actualVariants.length]);

  // Compute related / similar products (same category first, fallback to others)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    const others = products.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [products, product]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev === 0 ? currentGalleryImages.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev === currentGalleryImages.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, currentGalleryImages.length]);

  if (!product) {
    return (
      <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen py-16 text-center transition-colors duration-200">
        <p className="text-xl text-stone-600 dark:text-stone-300 font-bold">პროდუქტი ვერ მოიძებნა</p>
        <Link
          to="/products"
          className="text-stone-900 dark:text-white font-semibold mt-4 inline-block hover:underline"
        >
          ← კატალოგში დაბრუნება
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(product.id);
  const compared = isInCompare(product.id);

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? currentGalleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === currentGalleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleSelectVariant = (v) => {
    if (v.isSibling && v.productId) {
      navigate(`/product/${v.productId}`);
      return;
    }
    setActiveVariantId(v.id);
    setSelectedImageIndex(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const chosenColor = activeVariant?.name || "სტანდარტული";
    addInquiry({
      ...form,
      productName: `${product.name} (ფერი: ${chosenColor})`,
      productId: product.id,
      selectedColor: chosenColor,
      source: "Product Details Page",
    });
    setSent(true);
    setForm({ name: "", phone: "", comment: "" });
  };

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen pt-2 sm:pt-4 pb-16 lg:pb-24 transition-colors duration-200">
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        
        {/* Luxury Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-3 pb-1 text-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-medium overflow-hidden">
            <Link to="/" className="hover:text-stone-900 dark:hover:text-white transition">
              მთავარი
            </Link>
            <span className="text-stone-400 dark:text-stone-600">/</span>
            <Link to="/products" className="hover:text-stone-900 dark:hover:text-white transition">
              კატალოგი
            </Link>
            <span className="text-stone-400 dark:text-stone-600">/</span>
            <Link
              to={`/products?category=${product.category}`}
              className="hover:text-stone-900 dark:hover:text-white transition truncate hidden sm:inline"
            >
              {product.categoryLabel}
            </Link>
            <span className="text-stone-400 dark:text-stone-600 hidden sm:inline">/</span>
            <span className="text-stone-900 dark:text-stone-200 font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-semibold transition shrink-0 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-200/80 dark:border-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> კატალოგი
          </Link>
        </div>

        {/* Main Product Showcase Studio Card (Expanded full screen with dominant gallery) */}
        <div className="bg-white dark:bg-[#121211] p-4 sm:p-6 lg:p-7 xl:p-8 rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-stone-800/90 shadow-xl shadow-stone-900/5 dark:shadow-black/40 transition-colors duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10">
            
            {/* LEFT COLUMN: ARCHITECTURAL GALLERY (7 / 12 cols on desktop) */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col lg:sticky lg:top-24 h-fit">
              {/* Main Image Stage */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/11] min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] xl:min-h-[660px] group select-none shadow-inner">
                <img
                  src={activeImage}
                  alt={product.name}
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-full object-cover cursor-zoom-in transition-all duration-300 group-hover:scale-102"
                />

                {/* Active Variant Badge on Image */}
                {activeVariant && actualVariants.length > 1 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md border border-white/10 pointer-events-none">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/30"
                      style={{ backgroundColor: activeVariant.hex }}
                    />
                    <span>{activeVariant.name}</span>
                  </div>
                )}

                {/* Arrow Controls */}
                {currentGalleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Counter Badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-md border border-white/10">
                      <ImageIcon className="w-3.5 h-3.5 text-stone-300" />
                      <span>
                        {selectedImageIndex + 1} / {currentGalleryImages.length}
                      </span>
                    </div>
                  </>
                )}

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md shadow-md transition border border-white/10"
                  title="სრულ ეკრანზე ნახვა"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Favorite Heart Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-200 border ${
                    favorited
                      ? "bg-red-500 border-red-400 text-white shadow-red-500/30 scale-105"
                      : "bg-black/60 hover:bg-black/80 border-white/10 text-white hover:text-red-400"
                  }`}
                  title={favorited ? "ფავორიტებიდან ამოღება" : "ფავორიტებში დამატება"}
                >
                  <Heart className={`w-4 h-4 ${favorited ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Thumbnail Strip (Only shown if this variant has multiple photos, e.g. different angles) */}
              {currentGalleryImages.length > 1 && (
                <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
                  {currentGalleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                        selectedImageIndex === idx
                          ? "border-amber-500 ring-2 ring-amber-500/30 scale-105 shadow-md"
                          : "border-stone-200 dark:border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-400 dark:hover:border-stone-600"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Production & Delivery Highlights */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 pt-4 border-t border-stone-200/70 dark:border-stone-800/80">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-stone-900 dark:text-white block">დამზადების ვადა</span>
                    <span className="text-stone-500 dark:text-stone-400">3-5 სამუშაო დღე</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800 flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-stone-900 dark:text-white block">მიწოდების სერვისი</span>
                    <span className="text-stone-500 dark:text-stone-400">მთელ საქართველოში</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SPECS, PRICING & INQUIRY (5 / 12 cols on desktop) */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between">
              <div>
                {/* Meta header: Category Badge & Availability */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-stone-100 dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-stone-200 dark:border-stone-700/60">
                      {product.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      წარმოება შეკვეთით
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompare(product.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition ${
                        compared
                          ? "text-amber-500 bg-amber-500/15 border border-amber-500/40"
                          : "text-stone-600 dark:text-stone-400 hover:text-amber-500 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{compared ? "შედარებაშია" : "შედარება"}</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition ${
                        favorited
                          ? "text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40"
                          : "text-stone-600 dark:text-stone-400 hover:text-red-500 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{favorited ? "შენახულია" : "ფავორიტებში"}</span>
                    </button>
                  </div>
                </div>

                {/* Product Main Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white mt-3 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Architectural Price Banner */}
                <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#f8f6f0] to-[#f2eee3] dark:from-[#191917] dark:to-[#141412] border border-stone-300/80 dark:border-stone-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                      სარეალიზაციო ღირებულება:
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-stone-950 dark:text-white tracking-tight">
                        {product.price ? `${product.price} ₾` : "შეთანხმებით"}
                      </span>
                      {product.priceUnit && (
                        <span className="text-sm font-bold text-stone-600 dark:text-stone-400">
                          {product.priceUnit.replace("₾", "").trim()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between text-right text-xs text-stone-500 dark:text-stone-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-300/60 dark:border-stone-800">
                    <span className="inline-flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> დღგ-ს ჩათვლით
                    </span>
                    <span className="text-[11px] text-stone-500 mt-0.5">პირდაპირ მწარმოებლისგან</span>
                  </div>
                </div>

                {/* Key Quality Pillars Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5">
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 text-center">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">სიმტკიცე</span>
                    <span className="text-xs font-extrabold text-stone-900 dark:text-white">
                      {product.concreteGrade || "B35 (M450)"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 text-center">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">ყინვაგამძლეობა</span>
                    <span className="text-xs font-extrabold text-stone-900 dark:text-white">
                      {product.frostResistance || "F300"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 text-center">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">ზედაპირი</span>
                    <span className="text-xs font-extrabold text-stone-900 dark:text-white truncate block">
                      {product.surface || "ქვიშაჭავლური"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 text-center">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">გარანტია</span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">10 წელი</span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-stone-600 dark:text-stone-300 mt-4 leading-relaxed text-sm sm:text-[15px]">
                    {product.description}
                  </p>
                )}

                {/* AMAZON-STYLE COLOR VARIANT PICKER (Shown ONLY if this exact item has other colors) */}
                {actualVariants.length > 1 && (
                  <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        ფერი:
                      </span>
                      <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                        {activeVariant?.name}
                      </span>
                    </div>

                    {/* Swatches Grid with photo previews (like Amazon) */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {actualVariants.map((v) => {
                        const isSelected = activeVariant?.id === v.id || activeVariant?.name === v.name;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectVariant(v)}
                            className={`group relative flex items-center gap-2.5 p-2 rounded-xl border-2 transition-all duration-200 text-left ${
                              isSelected
                                ? "border-amber-500 bg-white dark:bg-stone-800 shadow-md ring-2 ring-amber-500/25 scale-[1.02]"
                                : "border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-950/70 hover:border-stone-400 dark:hover:border-stone-700"
                            }`}
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-900">
                              <img
                                src={v.image}
                                alt={v.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="min-w-0 flex-1 pr-1">
                              <span
                                className={`text-xs font-bold block truncate ${
                                  isSelected
                                    ? "text-stone-900 dark:text-white"
                                    : "text-stone-700 dark:text-stone-300"
                                }`}
                              >
                                {v.name}
                              </span>
                              {v.price && (
                                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-extrabold block">
                                  {v.price} ₾
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Link to Calculator banner */}
                <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-white">
                        გჭირდებათ ზუსტი რაოდენობისა და ბიუჯეტის დათვლა?
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        გამოიყენეთ საფეხურებისა და ფილების ონლაინ კალკულატორი
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/calculator"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-xs font-bold hover:bg-stone-800 dark:hover:bg-stone-100 transition shadow-sm"
                  >
                    კალკულატორი →
                  </Link>
                </div>

                {/* Technical Specifications Table */}
                <div className="mt-5 bg-stone-50 dark:bg-stone-950/70 border border-stone-200/90 dark:border-stone-800 rounded-2xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                    ტექნიკური პარამეტრები & სპეციფიკაცია
                  </h3>
                  <dl className="divide-y divide-stone-200/90 dark:divide-stone-800/90 text-sm">
                    {product.dimensions && (
                      <div className="py-2 flex justify-between items-baseline">
                        <dt className="text-stone-500 dark:text-stone-400 text-xs">ზომები (სმ):</dt>
                        <dd className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                          {product.dimensions}
                        </dd>
                      </div>
                    )}
                    {product.weight && (
                      <div className="py-2 flex justify-between items-baseline">
                        <dt className="text-stone-500 dark:text-stone-400 text-xs">წონა:</dt>
                        <dd className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                          {product.weight}
                        </dd>
                      </div>
                    )}
                    {product.concreteGrade && (
                      <div className="py-2 flex justify-between items-baseline">
                        <dt className="text-stone-500 dark:text-stone-400 text-xs">ბეტონის მარკა:</dt>
                        <dd className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                          {product.concreteGrade}
                        </dd>
                      </div>
                    )}
                    {product.frostResistance && (
                      <div className="py-2 flex justify-between items-baseline">
                        <dt className="text-stone-500 dark:text-stone-400 text-xs">ყინვაგამძლეობა:</dt>
                        <dd className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                          {product.frostResistance}
                        </dd>
                      </div>
                    )}
                    {product.surface && (
                      <div className="py-2 flex justify-between items-baseline">
                        <dt className="text-stone-500 dark:text-stone-400 text-xs">ზედაპირის დამუშავება:</dt>
                        <dd className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm">
                          {product.surface}
                        </dd>
                      </div>
                    )}
                    {product.colors && (
                      <div className="py-2 flex justify-between items-baseline">
                        <dt className="text-stone-500 dark:text-stone-400 text-xs">ფერები:</dt>
                        <dd className="font-bold text-stone-900 dark:text-white text-right text-xs sm:text-sm">
                          {Array.isArray(product.colors) ? product.colors.join(", ") : product.colors}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Quick Order / Inquiry Form Section */}
              <div className="mt-6 border-t border-stone-200/90 dark:border-stone-800/90 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                      დაინტერესდით მოცემული მოდელით?
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      დაგვიტოვეთ თქვენი ნომერი და ჩვენი ინჟინერი გაგიწევთ დეტალურ კონსულტაციას.
                    </p>
                  </div>
                  <a
                    href="tel:+995599000000"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> პირდაპირი ზარი
                  </a>
                </div>

                {sent ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>გმადლობთ! თქვენი მოთხოვნა მიღებულია. მალე დაგიკავშირდებით.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        required
                        placeholder="თქვენი სახელი *"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-500 dark:focus:border-stone-400"
                      />
                      <input
                        required
                        placeholder="ტელეფონის ნომერი *"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-500 dark:focus:border-stone-400"
                      />
                    </div>
                    <textarea
                      placeholder="კომენტარი ან რაოდენობა (არასავალდებულო)"
                      rows="2"
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      className="w-full bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-500 dark:focus:border-stone-400"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-950 font-bold py-3 rounded-xl transition text-sm shadow-md"
                    >
                      ფასის დაზუსტება & შეკვეთის გაფორმება
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar / Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-stone-200/80 dark:border-stone-800/80">
            <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
              <div>
                <span className="text-stone-400 dark:text-stone-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest block mb-0.5">
                  {product.categoryLabel ? `კატეგორია: ${product.categoryLabel}` : "რეკომენდაცია"}
                </span>
                <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                  მსგავსი პროდუქცია
                </h2>
              </div>
              <Link
                to={product.category ? `/products?category=${product.category}` : "/products"}
                className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white text-xs sm:text-sm font-semibold transition shrink-0"
              >
                <span className="sm:hidden">ყველა</span>
                <span className="hidden sm:inline">ყველა მსგავსი</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500" />
              </Link>
            </div>

            {/* Desktop Grid (Hidden on Mobile) */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>

            {/* Mobile Horizontal Swiper (Visible on Mobile < sm) */}
            <div className="flex sm:hidden overflow-x-auto no-scrollbar gap-2.5 pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  className="snap-start flex-shrink-0 w-[48vw] min-w-[165px] max-w-[210px]"
                >
                  <ProductCard product={relProduct} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 select-none">
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next controls */}
          {currentGalleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition z-10"
                aria-label="Next"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Lightbox Main Image */}
          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center">
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            {currentGalleryImages.length > 1 && (
              <p className="text-stone-400 text-xs mt-4">
                ფოტო {selectedImageIndex + 1} / {currentGalleryImages.length} • {product.name} ({activeColorOption?.name})
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
