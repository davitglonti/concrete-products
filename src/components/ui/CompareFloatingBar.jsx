import React from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { useData } from "../../context/DataContext";
import { Scale, X, ArrowRight, Layers } from "lucide-react";

export default function CompareFloatingBar() {
  const { compareIds, removeFromCompare, clearCompare, setIsCompareModalOpen, count, notice } =
    useCompare();
  const { products } = useData();

  if (count === 0 && !notice) return null;

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  return (
    <>
      {/* Toast Notice (e.g. limit reached) */}
      {notice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white border border-amber-500/50 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Floating Bottom Pill */}
      {count > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl animate-fade-in">
          <div className="bg-stone-950/95 dark:bg-stone-900/95 backdrop-blur-xl text-white border border-stone-800 shadow-2xl rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3">
            {/* Left: Icon & Thumbnails */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0 shadow">
                <Scale className="w-4 h-4" />
              </div>

              {/* Thumbnails preview */}
              <div className="flex items-center gap-1.5 overflow-hidden">
                {compareProducts.map((p) => (
                  <div
                    key={p.id}
                    className="relative group w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-stone-700 shrink-0 bg-stone-800"
                    title={p.name}
                  >
                    <img
                      src={p.images?.[0] || p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCompare(p.id);
                      }}
                      className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                      title="წაშლა"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ))}

                {Array.from({ length: 4 - count }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-dashed border-stone-700/60 hidden sm:flex items-center justify-center text-[10px] text-stone-600 shrink-0"
                  >
                    +
                  </div>
                ))}
              </div>

              <div className="hidden xs:block text-xs text-stone-300 font-medium whitespace-nowrap pl-1">
                <span>{count} / 4 არჩეულია</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={clearCompare}
                className="text-[11px] text-stone-400 hover:text-red-400 px-2 py-1.5 rounded-lg transition"
                title="გასუფთავება"
              >
                გასუფთავება
              </button>

              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>შედარება</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
