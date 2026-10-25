import React from "react";
import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { useData } from "../context/DataContext";
import {
  Scale,
  Trash2,
  X,
  Plus,
  ArrowRight,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

export default function Compare() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const { products } = useData();

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen pt-4 sm:pt-6 pb-20 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Breadcrumb & Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium">
              <Link to="/" className="hover:text-stone-900 dark:hover:text-white transition">
                მთავარი
              </Link>
              <span>/</span>
              <Link to="/products" className="hover:text-stone-900 dark:hover:text-white transition">
                კატალოგი
              </Link>
              <span>/</span>
              <span className="text-stone-900 dark:text-white font-bold">შედარება</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white flex items-center gap-3">
              <span>ნივთების შედარება</span>
              <span className="text-xs sm:text-sm bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono px-3 py-1 rounded-full">
                {compareProducts.length}/4
              </span>
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1">
              შეადარეთ ბეტონის ნაკეთობები გაბარიტებით, წონით, ბეტონის მარკითა და ღირებულებით.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {compareProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-stone-500 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-stone-200 dark:border-stone-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>სიის გასუფთავება</span>
              </button>
            )}
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-xl transition border border-stone-200 dark:border-stone-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>კატალოგში დაბრუნება</span>
            </Link>
          </div>
        </div>

        {/* Matrix Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-6 lg:p-8 shadow-sm">
          {compareProducts.length === 0 ? (
            <div className="py-20 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4 text-stone-400">
                <Scale className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                შედარებისთვის ნივთები არ არის არჩეული
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                გადადით კატალოგში და დააჭირეთ შედარების ხატულას სასურველი ბეტონის ნაკეთობების ასარჩევად.
              </p>
              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 px-5 py-2.5 rounded-xl transition shadow"
              >
                <span>კატალოგის დათვალიერება</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin pb-4">
              <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  {/* Row 1: Photos & Delete Button */}
                  <tr className="border-b border-stone-200/80 dark:border-stone-800/80">
                    <th className="p-3.5 sm:p-4 w-40 sm:w-48 text-xs uppercase tracking-wider text-stone-400 font-bold bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70 align-middle">
                      პროდუქტი
                    </th>
                    {compareProducts.map((p) => (
                      <th
                        key={p.id}
                        className="p-3.5 sm:p-4 w-60 sm:w-68 min-w-[220px] max-w-[280px] align-top bg-white dark:bg-stone-900"
                      >
                        <div className="relative group rounded-2xl overflow-hidden h-44 sm:h-52 w-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-sm">
                          <img
                            src={p.images?.[0] || p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-stone-900/80 hover:bg-red-600 text-white backdrop-blur transition-all duration-200 shadow-md group-hover:scale-110"
                            title="შედარებიდან ამოღება"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </th>
                    ))}

                    {/* Empty add slot if < 4 */}
                    {compareProducts.length < 4 && (
                      <th className="p-3.5 sm:p-4 w-60 sm:w-68 min-w-[220px] max-w-[280px] align-top bg-white dark:bg-stone-900">
                        <Link
                          to="/products"
                          className="h-44 sm:h-52 w-full rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-400 bg-stone-50/60 dark:bg-stone-950/40 hover:bg-amber-50/30 dark:hover:bg-amber-500/5 transition flex flex-col items-center justify-center gap-2 group p-4"
                        >
                          <div className="w-11 h-11 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-500 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
                            <Plus className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <span className="text-xs font-bold text-stone-600 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            + პროდუქტის დამატება
                          </span>
                        </Link>
                      </th>
                    )}
                  </tr>

                  {/* Row 2: Category & Title */}
                  <tr className="border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/40 dark:bg-stone-950/30">
                    <th className="p-3.5 sm:p-4 text-xs font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70 align-middle">
                      დასახელება
                    </th>
                    {compareProducts.map((p) => (
                      <th key={p.id} className="p-3.5 sm:p-4 align-top">
                        <div className="h-16 flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 line-clamp-1">
                            {p.categoryLabel}
                          </span>
                          <h4
                            className="font-extrabold text-stone-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-tight"
                            title={p.name}
                          >
                            {p.name}
                          </h4>
                        </div>
                      </th>
                    ))}
                    {compareProducts.length < 4 && (
                      <th className="p-3.5 sm:p-4 align-middle text-center text-xs text-stone-400 italic">
                        —
                      </th>
                    )}
                  </tr>

                  {/* Row 3: Action Button */}
                  <tr className="border-b border-stone-200/80 dark:border-stone-800/80">
                    <th className="p-3.5 sm:p-4 text-xs font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70 align-middle">
                      დეტალები
                    </th>
                    {compareProducts.map((p) => (
                      <th key={p.id} className="p-3.5 sm:p-4 align-middle">
                        <Link
                          to={`/products/${p.id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 py-2.5 px-4 rounded-xl transition shadow-sm"
                        >
                          <span>სრული გვერდის ნახვა</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </th>
                    ))}
                    {compareProducts.length < 4 && (
                      <th className="p-3.5 sm:p-4 align-middle">
                        <Link
                          to="/products"
                          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 py-2.5 px-3 rounded-xl transition border border-dashed border-stone-300 dark:border-stone-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>არჩევა</span>
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
                  {/* Row 4: Price */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70">
                      ღირებულება
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                            {p.price ? `${p.price} ₾` : "შეთანხმებით"}
                          </span>
                          {p.price && p.priceUnit && (
                            <span className="text-xs text-stone-500 font-medium">
                              {p.priceUnit.replace("₾", "").trim()}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareProducts.length < 4 && (
                      <td className="p-3.5 sm:p-4 text-center font-mono text-stone-300 dark:text-stone-700">—</td>
                    )}
                  </tr>

                  {/* Row 5: Dimensions */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70">
                      ზომები (მმ)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 font-mono font-medium text-stone-800 dark:text-stone-200">
                        {p.dimensions || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && (
                      <td className="p-3.5 sm:p-4 text-center font-mono text-stone-300 dark:text-stone-700">—</td>
                    )}
                  </tr>

                  {/* Row 6: Weight */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70">
                      სავარაუდო წონა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 text-stone-800 dark:text-stone-200">
                        {p.weight || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && (
                      <td className="p-3.5 sm:p-4 text-center font-mono text-stone-300 dark:text-stone-700">—</td>
                    )}
                  </tr>

                  {/* Row 7: Concrete Grade */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70">
                      ბეტონის მარკა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                          {p.concreteGrade || "B35 (M450)"}
                        </span>
                      </td>
                    ))}
                    {compareProducts.length < 4 && (
                      <td className="p-3.5 sm:p-4 text-center font-mono text-stone-300 dark:text-stone-700">—</td>
                    )}
                  </tr>

                  {/* Row 8: Frost Resistance */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70">
                      ყინვაგამძლეობა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 font-medium text-stone-800 dark:text-stone-200">
                        {p.frostResistance || "F300 (W8)"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && (
                      <td className="p-3.5 sm:p-4 text-center font-mono text-stone-300 dark:text-stone-700">—</td>
                    )}
                  </tr>

                  {/* Row 9: Surface Finish */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70">
                      ზედაპირის ფაქტურა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 text-stone-700 dark:text-stone-300">
                        {p.surface || "ქვიშაჭავლური / გლუვი"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && (
                      <td className="p-3.5 sm:p-4 text-center font-mono text-stone-300 dark:text-stone-700">—</td>
                    )}
                  </tr>

                  {/* Row 10: Description */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 sm:p-4 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60 border-r border-stone-200/70 dark:border-stone-800/70">
                      აღწერა & გამოყენება
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {p.shortDesc || p.description || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && (
                      <td className="p-3.5 sm:p-4 text-center font-mono text-stone-300 dark:text-stone-700">—</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
