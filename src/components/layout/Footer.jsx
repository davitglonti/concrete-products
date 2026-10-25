import React from "react";
import { Link } from "react-router-dom";
import { Layers, Phone, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-stone-950 border-t border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 py-16 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-stone-800 text-white dark:bg-white dark:text-stone-950 rounded-lg flex items-center justify-center font-black">
                <Layers className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-wider text-stone-900 dark:text-white">
                MONOLITH<span className="text-amber-600 dark:text-amber-400">.GE</span>
              </span>
            </Link>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-4 max-w-sm leading-relaxed">
              მაღალი სიმტკიცის არქიტექტურული და ლანდშაფტის ბეტონის ნაკეთობები.
              მონოლითური საფეხურები, დიდფორმატიანი ფილები, საყვავილეები და ურბანული ავეჯი.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-stone-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-4">
              ნავიგაცია
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-stone-900 dark:hover:text-white transition">
                  მთავარი
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-stone-900 dark:hover:text-white transition">
                  პროდუქციის კატალოგი
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-stone-900 dark:hover:text-white transition">
                  შესრულებული სამუშაოები
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-stone-900 dark:hover:text-white transition text-stone-400">
                  ადმინ პანელი (/admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-stone-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-4">
              კონტაქტი
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-700 dark:text-stone-300 flex-shrink-0" />
                <a href="tel:+995555123456" className="hover:text-stone-900 dark:hover:text-white transition">
                  +995 555 12 34 56
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-700 dark:text-stone-300 flex-shrink-0" />
                <span>info@monolith.ge</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-stone-700 dark:text-stone-300 flex-shrink-0" />
                <span>თბილისი, საქართველო</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200/90 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} MONOLITH.GE — ყველა უფლება დაცულია.</p>
          <p>დამზადებულია საქართველოში 🇬🇪</p>
        </div>
      </div>
    </footer>
  );
}
