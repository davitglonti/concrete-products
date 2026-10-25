import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogData";
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Tag,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(BLOG_POSTS.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen py-10 sm:py-16 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-amber-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>არქიტექტურული ბეტონის გზამკვლევი & ცოდნის ბაზა</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            ბლოგი, რჩევები & ტექნოლოგიები
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
            პროფესიონალური სტატიები ბეტონის შერჩევის, ექსპლუატაციის, ფილების მონტაჟისა და თანამედროვე ლანდშაფტის დიზაინის შესახებ.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200 dark:border-stone-800">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-sm"
                    : "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {cat === "all" ? "ყველა სტატია" : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="სტატიის ძიება..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <p className="text-stone-500 text-sm">მოცემული კრიტერიუმით სტატიები ვერ მოიძებნა.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <Link
                  to={`/blog/${post.slug}`}
                  className="aspect-[16/10] overflow-hidden relative bg-stone-100 dark:bg-stone-800 block"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-stone-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">
                    {post.category}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-400 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {post.readTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        {post.date}
                      </span>
                    </div>

                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition leading-snug line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2.5 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read More footer */}
                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform shrink-0"
                    >
                      <span>სრულად</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
