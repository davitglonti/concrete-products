import React from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";
import { useData } from "../../context/DataContext";
import {
  X,
  Scale,
  Trash2,
  ArrowRight,
  ExternalLink,
  Check,
  Plus,
  Maximize2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function CompareModal() {
  const {
    compareIds,
    removeFromCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
  } = useCompare();

  const { products } = useData();

  if (!isCompareModalOpen) return null;

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-[#fbfbf9] dark:bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <span>პროდუქციის შედარება</span>
                <span className="text-xs bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full font-mono">
                  {compareProducts.length}/4
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">
                ტექნიკური მახასიათებლებისა და ფასების პარალელური ანალიზი
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-stone-500 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                title="სიის გასუფთავება"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">გასუფთავება</span>
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
              aria-label="დახურვა"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
          {compareProducts.length === 0 ? (
            <div className="py-16 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4 text-stone-400">
                <Scale className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                შედარების სია ცარიელია
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                დაათვალიერეთ კატალოგი და დააჭირეთ სასწორის ხატულას პროდუქტების შესადარებლად (მაქს. 4 ნივთი).
              </p>
              <Link
                to="/products"
                onClick={() => setIsCompareModalOpen(false)}
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 px-5 py-2.5 rounded-xl transition shadow"
              >
                <span>კატალოგში გადასვლა</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin pb-4">
              <table className="w-full min-w-[620px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  {/* Row: Product Photo, Title, Delete, View Button */}
                  <tr className="border-b border-stone-200 dark:border-stone-800">
                    <th className="p-3 w-40 text-xs uppercase tracking-wider text-stone-400 font-bold bg-[#faf8f4] dark:bg-stone-950/60 rounded-tl-2xl">
                      პროდუქტი
                    </th>
                    {compareProducts.map((p) => (
                      <th
                        key={p.id}
                        className="p-3 sm:p-4 min-w-[200px] max-w-[260px] align-top bg-white dark:bg-stone-900"
                      >
                        <div className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-sm mb-3">
                          <img
                            src={p.images?.[0] || p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition shadow"
                            title="შედარებიდან ამოღება"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {p.categoryLabel}
                        </span>

                        <h4 className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base mt-1 line-clamp-2">
                          {p.name}
                        </h4>

                        <Link
                          to={`/products/${p.id}`}
                          onClick={() => setIsCompareModalOpen(false)}
                          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800 dark:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 py-2 rounded-xl transition"
                        >
                          <span>დეტალები</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </th>
                    ))}

                    {/* Empty add slots if < 4 */}
                    {compareProducts.length < 4 && (
                      <th className="p-4 min-w-[160px] align-middle text-center bg-[#fbfbf9]/60 dark:bg-stone-950/30 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
                        <Link
                          to="/products"
                          onClick={() => setIsCompareModalOpen(false)}
                          className="flex flex-col items-center justify-center gap-2 p-4 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition group"
                        >
                          <div className="w-10 h-10 rounded-full bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold">
                            + პროდუქტის დამატება
                          </span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
                  {/* Price */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3 font-semibold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ღირებულება
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 sm:p-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                            {p.price ? `${p.price} ₾` : "შეთანხმებით"}
                          </span>
                          {p.price && p.priceUnit && (
                            <span className="text-xs text-stone-500">
                              {p.priceUnit.replace("₾", "").trim()}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Dimensions */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3 font-semibold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ზომები (მმ)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 sm:p-4 font-mono font-medium text-stone-800 dark:text-stone-200">
                        {p.dimensions || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Weight */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3 font-semibold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      სავარაუდო წონა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 sm:p-4 text-stone-800 dark:text-stone-200">
                        {p.weight || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Concrete Grade */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3 font-semibold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ბეტონის მარკა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 sm:p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                          {p.concreteGrade || "B35 (M450)"}
                        </span>
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Frost Resistance */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3 font-semibold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ყინვაგამძლეობა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 sm:p-4 font-medium text-stone-800 dark:text-stone-200">
                        {p.frostResistance || "F300"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Surface Finish */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3 font-semibold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ზედაპირის ფაქტურა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 sm:p-4 text-stone-700 dark:text-stone-300">
                        {p.surface || "ქვიშაჭავლური"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Description */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3 font-semibold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      აღწერა & გამოყენება
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 sm:p-4 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {p.shortDesc || p.description || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {compareProducts.length > 0 && (
          <div className="px-5 sm:px-8 py-3.5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 bg-[#faf8f4] dark:bg-stone-950/70">
            <span>
              შედარებაშია <strong>{compareProducts.length}</strong> პროდუქტი (მაქს. 4)
            </span>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="text-stone-800 dark:text-white font-bold hover:underline"
            >
              დახურვა ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
