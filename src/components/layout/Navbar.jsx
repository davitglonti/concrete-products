import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Layers,
  Phone,
  X,
  Menu,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Clock,
  Sun,
  Moon,
  Heart,
  Trash2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavoritesContext";

export default function Navbar() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { products, addInquiry, siteSettings } = useData();
  const { toggleTheme, isDark } = useTheme();
  const { favoriteIds, removeFavorite, clearFavorites, count } = useFavorites();

  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);

  // Get favorite products
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  const handleSubmit = (e) => {
    e.preventDefault();
    addInquiry({ ...form, source: "Navbar Contact Modal" });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setIsContactOpen(false);
      setForm({ name: "", phone: "", comment: "" });
    }, 2000);
  };

  const handleFavoritesInquiry = () => {
    const productNames = favoriteProducts.map((p) => p.name).join(", ");
    setForm((prev) => ({
      ...prev,
      comment: `მაინტერესებს შერჩეული ფავორიტი პროდუქტები: ${productNames}`,
    }));
    setIsFavoritesOpen(false);
    setIsContactOpen(true);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3.5 py-2 rounded-lg ${
      isActive
        ? "text-stone-900 bg-stone-100 font-semibold dark:text-white dark:bg-stone-800"
        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800/60"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur border-b border-stone-200/90 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            {siteSettings?.logoType === "image" && siteSettings?.logoImage ? (
              <img
                src={siteSettings.logoImage}
                alt={siteSettings?.brandName || "Logo"}
                style={{ maxHeight: `${siteSettings?.logoHeight || 38}px` }}
                className="w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-800 text-white dark:bg-white dark:text-stone-950 rounded-xl flex items-center justify-center font-black transition-transform duration-200 group-hover:scale-105 shadow-sm">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
            )}
            {(siteSettings?.logoType !== "image" || siteSettings?.showBrandTextWithLogo !== false) && (
              <div>
                <span className="text-base sm:text-xl font-extrabold tracking-wider text-stone-900 dark:text-white block leading-none">
                  {siteSettings?.brandName || "MONOLITH"}
                  <span className="text-amber-600 dark:text-amber-400">
                    {siteSettings?.brandSuffix || ".GE"}
                  </span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 tracking-widest uppercase font-medium mt-0.5 sm:mt-1 hidden sm:block">
                  {siteSettings?.brandTagline || "არქიტექტურული ბეტონი"}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {(siteSettings?.navbarLinks || [])
              .filter((l) => l.enabled)
              .map((link) =>
                link.isExternal ? (
                  <a
                    key={link.id}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800/60 px-3.5 py-2 rounded-lg transition"
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink key={link.id} to={link.path} className={navLinkClass}>
                    {link.label}
                  </NavLink>
                )
              )}
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800/60 px-3.5 py-2 rounded-lg transition"
            >
              ჩვენ შესახებ & კონტაქტი
            </button>
          </nav>

          {/* Right Actions: Favorites + Dark Mode + Contact CTA + Hamburger */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Favorites Icon Button with Counter Badge */}
            {siteSettings?.showNavbarFavorites !== false && (
              <button
                onClick={() => setIsFavoritesOpen(true)}
                title="შენახული პროდუქტები (ფავორიტები)"
                className="relative p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-600 hover:text-red-500 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-red-400 dark:hover:bg-stone-800 transition"
                aria-label="Favorites"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {count > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {count}
                  </span>
                )}
              </button>
            )}

            {/* Dark Mode Toggle */}
            {siteSettings?.showNavbarThemeToggle !== false && (
              <button
                onClick={toggleTheme}
                title={isDark ? "ღია თემაზე გადართვა (Light Mode)" : "მუქ თემაზე გადართვა (Dark Mode)"}
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800 transition"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700" />
                )}
              </button>
            )}

            {/* Contact Button (Desktop / Tablet only) */}
            {siteSettings?.showNavbarCta !== false && (
              <button
                onClick={() => setIsContactOpen(true)}
                className="hidden sm:inline-flex bg-stone-800 hover:bg-stone-700 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 font-semibold px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition shadow-sm items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{siteSettings?.navbarCtaText || "დაგვიკავშირდით"}</span>
              </button>
            )}

            {/* Hamburger Button (Mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="მენიუს გახსნა"
              title="მენიუ"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-20 left-0 right-0 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-2xl p-5 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-1">
              {(siteSettings?.navbarLinks || [])
                .filter((l) => l.enabled)
                .map((link) =>
                  link.isExternal ? (
                    <a
                      key={link.id}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-4 h-4 opacity-40" />
                    </a>
                  ) : (
                    <NavLink
                      key={link.id}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                          isActive
                            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-sm"
                            : "text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                        }`
                      }
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </NavLink>
                  )
                )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactOpen(true);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center justify-between"
              >
                <span>ჩვენ შესახებ & კონტაქტი</span>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </button>
            </nav>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
              <a
                href="tel:+995555123456"
                className="w-full bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 font-bold py-3 rounded-xl text-xs sm:text-sm transition shadow flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>+995 555 12 34 56 (დარეკვა)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Drawer / Modal */}
      {isFavoritesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-stone-200 dark:border-stone-800 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-lg">ფავორიტები</h3>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    შენახულია {count} პროდუქტი
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsFavoritesOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-grow overflow-y-auto py-4 space-y-3">
              {favoriteProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                  <Heart className="w-12 h-12 stroke-1 text-stone-300 dark:text-stone-700 mb-3" />
                  <p className="text-base font-semibold text-stone-700 dark:text-stone-300">
                    ფავორიტების სია ცარიელია
                  </p>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    დაათვალიერეთ პროდუქცია და დააჭირეთ გულის ხატულას სასურველი ნივთების შესანახად.
                  </p>
                  <Link
                    to="/products"
                    onClick={() => setIsFavoritesOpen(false)}
                    className="mt-5 text-xs font-bold text-stone-800 dark:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 px-4 py-2.5 rounded-xl transition"
                  >
                    კატალოგის დათვალიერება
                  </Link>
                </div>
              ) : (
                favoriteProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 bg-stone-50 dark:bg-stone-950/60 p-3 rounded-2xl border border-stone-200 dark:border-stone-800"
                  >
                    <img
                      src={p.images?.[0] || p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {p.dimensions}
                      </p>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-extrabold text-sm text-stone-900 dark:text-white">
                          {p.price ? `${p.price} ₾` : "შეთანხმებით"}
                        </span>
                        {p.priceUnit && (
                          <span className="text-[10px] text-stone-500">
                            {p.priceUnit.replace("₾", "").trim()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(p.id)}
                      className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-stone-800 transition"
                      title="წაშლა"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Actions */}
            {favoriteProducts.length > 0 && (
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
                <button
                  onClick={handleFavoritesInquiry}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 font-bold py-3.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  <span>შერჩეულის შეკვეთა / ხარჯთაღრიცხვა</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={clearFavorites}
                  className="w-full text-xs text-stone-500 hover:text-red-500 py-1.5 transition text-center"
                >
                  სიის გასუფთავება
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative transition-colors duration-200">
            <button
              onClick={() => setIsContactOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-white bg-stone-100 dark:bg-stone-800 p-2 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                საკონტაქტო ინფორმაცია
              </span>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mt-1">დაგვიკავშირდით</h2>
              <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
                ჩვენი ინჟინრები გაგიწევენ დეტალურ კონსულტაციას და მოგაწვდიან ხარჯთაღრიცხვას.
              </p>

              <div className="mt-6 space-y-3 bg-[#f7f5f0] dark:bg-stone-950/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-800/80 text-sm">
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                  <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <a href={`tel:${(siteSettings?.contactPhone || "+995555123456").replace(/\s+/g, "")}`} className="font-semibold hover:underline">
                    {siteSettings?.contactPhone || "+995 555 12 34 56"}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                  <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{siteSettings?.contactAddress || "თბილისი, საქართველო (საწარმო & შოურუმი)"}</span>
                </div>
                <div className="flex items-center gap-3 text-stone-700 dark:text-stone-300">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{siteSettings?.contactWorkingHours || "ორშაბათი - შაბათი: 09:00 - 19:00"}</span>
                </div>
              </div>

              {sent ? (
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-700 dark:text-emerald-400 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>მადლობა! მოთხოვნა მიღებულია, მალე დაგიკავშირდებით.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      required
                      placeholder="თქვენი სახელი"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-800 dark:focus:border-stone-100"
                    />
                    <input
                      required
                      placeholder="ტელეფონის ნომერი"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-800 dark:focus:border-stone-100"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="რა ნაკეთობა ან პროექტი გაინტერესებთ?"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-800 dark:focus:border-stone-100"
                  />
                  <button
                    type="submit"
                    className="w-full bg-stone-800 hover:bg-stone-700 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 font-bold py-3 rounded-xl text-sm transition shadow-md"
                  >
                    მოთხოვნის გაგზავნა
                  </button>
                </form>
              )}

              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
                <Link
                  to="/faq"
                  onClick={() => setIsContactOpen(false)}
                  className="text-xs text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 transition font-medium inline-flex items-center gap-1.5"
                >
                  ხშირად დასმული კითხვები &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
