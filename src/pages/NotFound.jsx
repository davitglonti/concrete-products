import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Layers,
  Search,
  HelpCircle,
  Phone,
  Compass,
  ArrowRight,
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#fbfbf9] dark:bg-stone-950 transition-colors duration-200">
      <div className="max-w-2xl w-full text-center">
        {/* Architectural 404 Visual */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Subtle textured glow */}
          <div className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-amber-500/10 dark:bg-amber-400/5 blur-3xl pointer-events-none" />
          
          <div className="relative flex items-center justify-center">
            <span className="text-7xl sm:text-9xl font-black tracking-tighter text-stone-900/15 dark:text-white/10 select-none font-mono">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Layers className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
              </div>
            </div>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            შეცდომა 404
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            გვერდი ვერ მოიძებნა
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            მოთხოვნილი გვერდი არ არსებობს, შეცვლილია მისამართი ან დროებით მიუწვდომელია.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 text-xs sm:text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>უკან დაბრუნება</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-950 text-xs sm:text-sm font-bold transition shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>მთავარი გვერდი</span>
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white text-xs sm:text-sm font-semibold transition"
          >
            <Search className="w-4 h-4" />
            <span>კატალოგის დათვალიერება</span>
          </Link>
        </div>

        {/* Quick helpful links */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 dark:border-stone-800/80">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 block mb-3">
            შეიძლება დაგაინტერესოთ:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link
              to="/products?category=steps"
              className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
            >
              საფეხურები
            </Link>
            <Link
              to="/products?category=planters"
              className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
            >
              საყვავილეები
            </Link>
            <Link
              to="/products?category=pavers"
              className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
            >
              ეზოს ფილები
            </Link>
            <Link
              to="/portfolio"
              className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
            >
              პორტფოლიო
            </Link>
            <Link
              to="/faq"
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 font-bold transition flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>კითხვა-პასუხი (FAQ)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
