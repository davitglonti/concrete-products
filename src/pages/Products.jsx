import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { CATEGORIES } from "../data/initialData";
import ProductCard from "../components/ui/ProductCard";
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  LayoutGrid,
  Grid,
  Sparkles,
} from "lucide-react";

export default function Products() {
  const { products, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'price-asc' | 'price-desc' | 'name-asc'
  const [visibleCount, setVisibleCount] = useState(10);
  const [columns, setColumns] = useState(5); // 4 or 5 items per row on desktop/widescreen

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Reset visibleCount to 10 whenever category, search, or sort changes
  useEffect(() => {
    setVisibleCount(10);
  }, [selectedCategory, search, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const sortedAndFiltered = [...filtered].sort((a, b) => {
    const priceA =
      a.price !== undefined && a.price !== null && a.price !== ""
        ? Number(a.price)
        : null;
    const priceB =
      b.price !== undefined && b.price !== null && b.price !== ""
        ? Number(b.price)
        : null;

    if (sortBy === "price-asc") {
      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return priceA - priceB;
    }
    if (sortBy === "price-desc") {
      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return priceB - priceA;
    }
    if (sortBy === "name-asc") {
      return (a.name || "").localeCompare(b.name || "", "ka");
    }
    return 0;
  });

  // Load more slice
  const totalItems = sortedAndFiltered.length;
  const displayedProducts = sortedAndFiltered.slice(0, visibleCount);

  const categoryList = [
    { id: "all", label: "ყველა" },
    ...(categories && categories.length > 0 ? categories : CATEGORIES),
  ];

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen pt-3 sm:pt-6 pb-20 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12">
        {/* Page Header */}
        <div className="mb-4 sm:mb-8">
          <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest block">
            კატალოგი
          </span>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-white mt-0.5 sm:mt-1">
            ბეტონის ნაკეთობების კატალოგი
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 sm:mt-2">
            აირჩიეთ სასურველი კატეგორია და გაეცანით ტექნიკურ მახასიათებლებსა და ზომებს.
          </p>
        </div>

        {/* Filter, Search & Sort Control Panel */}
        <div className="space-y-3 bg-white dark:bg-stone-900 p-3 sm:p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm transition-colors duration-200">
          {/* Top Row: Categories (Smooth edge-to-edge touch scroll on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-sm"
                    : "bg-[#f5f3ee] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Bottom Row: Search + Sort + Desktop Columns Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-2.5 border-t border-stone-100 dark:border-stone-800">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ძებნა დასახელებით..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#f5f3ee] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl pl-9 sm:pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-800 dark:focus:border-stone-100 focus:bg-white dark:focus:bg-stone-900 transition"
              />
            </div>

            {/* Right: Sort + Desktop Column Switcher */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-[#f5f3ee] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 sm:px-3 py-1.5 flex-1 sm:flex-initial">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 flex-shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer w-full sm:w-auto"
                  aria-label="დალაგება"
                >
                  <option value="default" className="dark:bg-stone-900">სტანდარტული</option>
                  <option value="price-asc" className="dark:bg-stone-900">ფასი: დაბლიდან მაღლისკენ ↑</option>
                  <option value="price-desc" className="dark:bg-stone-900">ფასი: მაღლიდან დაბლისკენ ↓</option>
                  <option value="name-asc" className="dark:bg-stone-900">დასახელება: ა-ჰ</option>
                </select>
              </div>

              {/* Desktop Column Toggle: 4 or 5 items per row */}
              <div className="hidden lg:flex items-center gap-1 bg-[#f5f3ee] dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setColumns(4)}
                  title="4 ნივთი ხაზზე"
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    columns === 4
                      ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                      : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setColumns(5)}
                  title="5 ნივთი ხაზზე"
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    columns === 5
                      ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm"
                      : "text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>5</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid: 2 on mobile, 3 on tablet, 4 or 5 on desktop */}
        {sortedAndFiltered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 mt-6 sm:mt-8">
            <p className="text-stone-500 dark:text-stone-400 font-medium">პროდუქცია ვერ მოიძებნა</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 ${
              columns === 4 ? "lg:grid-cols-4 xl:grid-cols-4" : "lg:grid-cols-4 xl:grid-cols-5"
            } gap-2.5 sm:gap-4 lg:gap-5 mt-4 sm:mt-8`}
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* LOAD MORE SECTION (Replaces old pagination) */}
        {sortedAndFiltered.length > 0 && (
          <div className="mt-10 sm:mt-14 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col items-center gap-3">
            <span className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
              ნაჩვენებია{" "}
              <strong className="text-stone-900 dark:text-white font-bold">
                {Math.min(visibleCount, totalItems)}
              </strong>{" "}
              / {totalItems} პროდუქტიდან
            </span>

            {visibleCount < totalItems ? (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 font-bold px-7 sm:px-9 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group cursor-pointer"
              >
                <span>მეტის ნახვა (+10 პროდუქტი)</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            ) : (
              <span className="text-xs text-stone-400 dark:text-stone-500 font-medium bg-stone-100 dark:bg-stone-900 px-4 py-2 rounded-full border border-stone-200/80 dark:border-stone-800 mt-2">
                ყველა ({totalItems}) პროდუქტი ნაჩვენებია
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
