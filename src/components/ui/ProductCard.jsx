import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Maximize2, Heart, Image as ImageIcon, Scale } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import { useCompare } from "../../context/CompareContext";

export default function ProductCard({ product }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();
  const favorited = isFavorite(product.id);
  const compared = isInCompare(product.id);

  // Multi-image handling
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];
  const primaryImage = allImages[0] || product.image;
  const secondaryImage = allImages[1] || null;
  const hasMultiple = Boolean(secondaryImage);

  // States for desktop hover and mobile touch toggle
  const [isHovered, setIsHovered] = useState(false);
  const [touchActive, setTouchActive] = useState(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const isShowingSecond = hasMultiple && (isHovered || touchActive);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product.id);
  };

  // Mobile touch swipe handling
  const handleTouchStart = (e) => {
    if (!hasMultiple) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!hasMultiple) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Horizontal swipe threshold: 30px
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      e.stopPropagation();
      if (deltaX < 0) {
        // Swiped left -> show second photo
        setTouchActive(true);
      } else {
        // Swiped right -> show first photo
        setTouchActive(false);
      }
    }
  };

  // Mobile single tap on image
  const handleImageClick = (e) => {
    if (!hasMultiple) return;
    const isTouchDevice =
      window.matchMedia("(max-width: 768px)").matches ||
      !("hover" in window.matchMedia("(hover: hover)") && window.matchMedia("(hover: hover)").matches);

    // If mobile touch and not yet showing second image, toggle on first tap and prevent navigation
    if (isTouchDevice && !touchActive) {
      e.preventDefault();
      e.stopPropagation();
      setTouchActive(true);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col border bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 relative h-full"
    >
      {/* Image container */}
      <div
        className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800 relative select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleImageClick}
      >
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-500 ${
            hasMultiple
              ? isShowingSecond
                ? "opacity-0 scale-105"
                : "opacity-100 group-hover:opacity-0 group-hover:scale-105"
              : "group-hover:scale-105"
          }`}
        />

        {/* Secondary Image (revealed on desktop hover or mobile touch/swipe) */}
        {hasMultiple && (
          <img
            src={secondaryImage}
            alt={`${product.name} - ხედი 2`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isShowingSecond
                ? "opacity-100 scale-105"
                : "opacity-0 group-hover:opacity-100 group-hover:scale-105"
            }`}
          />
        )}

        {/* Category Badge (Top Left) */}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-stone-800/90 dark:bg-stone-950/85 backdrop-blur text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-stone-700/60 shadow-sm truncate max-w-[55%] pointer-events-none z-10">
          {product.categoryLabel}
        </span>

        {/* Multi-image counter badge (Bottom Left) */}
        {hasMultiple && (
          <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-stone-900/80 backdrop-blur text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md flex items-center gap-1 border border-stone-700/40 pointer-events-none z-10">
            <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-300" />
            <span>
              {isShowingSecond ? "2" : "1"} / {allImages.length}
            </span>
          </span>
        )}

        {/* Multi-image indicator dots (Bottom Center) */}
        {hasMultiple && (
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-10 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTouchActive(false);
              }}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                !isShowingSecond ? "w-3 sm:w-4 bg-white" : "w-1 sm:w-1.5 bg-white/40 hover:bg-white/75"
              }`}
              title="პირველი ფოტო"
              aria-label="პირველი ფოტო"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTouchActive(true);
              }}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                isShowingSecond ? "w-3 sm:w-4 bg-white" : "w-1 sm:w-1.5 bg-white/40 hover:bg-white/75"
              }`}
              title="მეორე ფოტო"
              aria-label="მეორე ფოტო"
            />
          </div>
        )}

        {/* Actions Group (Top Right: Compare + Favorite) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-1.5 z-10">
          {/* Compare Button */}
          <button
            type="button"
            onClick={handleCompareClick}
            aria-label={compared ? "შედარებიდან წაშლა" : "შედარებაში დამატება"}
            title={compared ? "შედარებაშია (წაშლა)" : "შედარებაში დამატება"}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
              compared
                ? "bg-amber-500 text-stone-950 scale-110 shadow-amber-500/40 ring-1 ring-amber-400"
                : "bg-white/90 dark:bg-stone-900/90 text-stone-600 dark:text-stone-300 hover:text-amber-500 hover:bg-white dark:hover:bg-stone-900"
            }`}
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label={favorited ? "ფავორიტებიდან წაშლა" : "ფავორიტებში დამატება"}
            title={favorited ? "ფავორიტებშია" : "ფავორიტებში დამატება"}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
              favorited
                ? "bg-red-500 text-white scale-110 shadow-red-500/30"
                : "bg-white/90 dark:bg-stone-900/90 text-stone-600 dark:text-stone-300 hover:text-red-500 hover:bg-white dark:hover:bg-stone-900"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                favorited ? "fill-white stroke-white scale-105" : "stroke-[2.2]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 lg:p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Title & Arrow */}
          <h3 className="text-xs sm:text-sm lg:text-base font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition flex items-start justify-between gap-1">
            <span className="line-clamp-1">{product.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-stone-600 dark:text-stone-300 flex-shrink-0 mt-0.5" />
          </h3>

          {/* Description */}
          {product.shortDesc && (
            <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-snug">
              {product.shortDesc}
            </p>
          )}
        </div>

        <div>
          {/* Price & Dimensions */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-stone-100 dark:border-stone-800 flex items-end justify-between gap-2">
            {/* Price display */}
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 block font-medium">ფასი:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  {product.price ? `${product.price} ₾` : "შეთანხმებით"}
                </span>
                {product.price && product.priceUnit && (
                  <span className="text-[10px] sm:text-xs lg:text-sm text-stone-500 dark:text-stone-400 font-medium truncate">
                    {product.priceUnit.replace("₾", "").trim()}
                  </span>
                )}
              </div>
            </div>

            {/* Dimensions & Weight (only shown if they exist!) */}
            {(product.dimensions || product.weight) && (
              <div className="text-right text-stone-600 dark:text-stone-300 shrink-0 max-w-[55%]">
                {product.dimensions && (
                  <span className="flex items-center justify-end gap-1 text-[11px] sm:text-xs lg:text-sm font-semibold text-stone-700 dark:text-stone-200 truncate">
                    <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{product.dimensions}</span>
                  </span>
                )}
                {product.weight && (
                  <span className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 block font-medium truncate mt-0.5">
                    {product.weight}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
