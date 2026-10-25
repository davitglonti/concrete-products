import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Maximize2, Weight, Heart, Image as ImageIcon, Scale } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import { useCompare } from "../../context/CompareContext";

export default function ProductCard({ product }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();
  const favorited = isFavorite(product.id);
  const compared = isInCompare(product.id);

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

  return (
    <Link
      to={`/products/${product.id}`}
      className="group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col border bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 relative"
    >
      {/* Image container */}
      <div className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge (Top Left) */}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-stone-800/90 dark:bg-stone-950/85 backdrop-blur text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-stone-700/60 shadow-sm truncate max-w-[55%]">
          {product.categoryLabel}
        </span>

        {/* Multi-image counter badge */}
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-stone-900/80 backdrop-blur text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md flex items-center gap-1 border border-stone-700/40">
            <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-300" />
            <span>{product.images.length} ფოტო</span>
          </span>
        )}

        {/* Actions Group (Top Right: Compare + Favorite) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-1.5">
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
      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
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
          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-end justify-between gap-1.5">
            {/* Price display */}
            <div className="min-w-0">
              <span className="text-[10px] text-stone-400 dark:text-stone-500 block font-medium">ფასი:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs sm:text-sm lg:text-base font-black text-stone-900 dark:text-white tracking-tight">
                  {product.price ? `${product.price} ₾` : "შეთანხმებით"}
                </span>
                {product.price && product.priceUnit && (
                  <span className="text-[9px] sm:text-[10px] text-stone-400 font-normal truncate">
                    {product.priceUnit.replace("₾", "").trim()}
                  </span>
                )}
              </div>
            </div>

            {/* Dimensions & Weight (only shown if they exist!) */}
            {(product.dimensions || product.weight) && (
              <div className="text-right text-[10px] text-stone-500 dark:text-stone-400 shrink-0 max-w-[50%]">
                {product.dimensions && (
                  <span className="flex items-center justify-end gap-0.5 font-medium truncate">
                    <Maximize2 className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                    <span className="truncate">{product.dimensions}</span>
                  </span>
                )}
                {product.weight && (
                  <span className="text-[9px] text-stone-400 dark:text-stone-500 block truncate">
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
