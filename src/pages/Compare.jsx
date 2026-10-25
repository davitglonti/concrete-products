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
              <table className="w-full min-w-[640px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800">
                    <th className="p-3 w-44 text-xs uppercase tracking-wider text-stone-400 font-bold bg-[#faf8f4] dark:bg-stone-950/60 rounded-tl-2xl">
                      პარამეტრები
                    </th>
                    {compareProducts.map((p) => (
                      <th
                        key={p.id}
                        className="p-3 sm:p-4 min-w-[200px] max-w-[280px] align-top bg-white dark:bg-stone-900"
                      >
                        <div className="relative group rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-sm mb-3">
                          <img
                            src={p.images?.[0] || p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition shadow"
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
                          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800 dark:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 py-2 rounded-xl transition"
                        >
                          <span>სრული გვერდის ნახვა</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </th>
                    ))}

                    {compareProducts.length < 4 && (
                      <th className="p-4 min-w-[180px] align-middle text-center bg-[#fbfbf9]/60 dark:bg-stone-950/30 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
                        <Link
                          to="/products"
                          className="flex flex-col items-center justify-center gap-2 p-6 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition group"
                        >
                          <div className="w-11 h-11 rounded-full bg-stone-200/80 dark:bg-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform">
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
                    <td className="p-3.5 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
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
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Dimensions */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ზომები (მმ)
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 font-mono font-medium text-stone-800 dark:text-stone-200">
                        {p.dimensions || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Weight */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      სავარაუდო წონა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 text-stone-800 dark:text-stone-200">
                        {p.weight || "—"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Concrete Grade */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ბეტონის მარკა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-lg">
                          {p.concreteGrade || "B35 (M450)"}
                        </span>
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Frost Resistance */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ყინვაგამძლეობა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 font-semibold text-stone-800 dark:text-stone-200">
                        {p.frostResistance || "F300"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Surface Finish */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      ზედაპირის ფაქტურა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 text-stone-700 dark:text-stone-300">
                        {p.surface || "ქვიშაჭავლური"}
                      </td>
                    ))}
                    {compareProducts.length < 4 && <td />}
                  </tr>

                  {/* Description */}
                  <tr className="hover:bg-stone-50/60 dark:hover:bg-stone-800/30 transition">
                    <td className="p-3.5 font-bold text-stone-500 dark:text-stone-400 bg-[#faf8f4] dark:bg-stone-950/60">
                      მოკლე აღწერა
                    </td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3.5 sm:p-4 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
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
      </div>
    </div>
  );
}
