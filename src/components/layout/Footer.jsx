import React from "react";
import { Link } from "react-router-dom";
import { Layers, Phone, MapPin, Mail, ExternalLink } from "lucide-react";
import { useData } from "../../context/DataContext";

export default function Footer() {
  const { siteSettings } = useData();

  const brandName = siteSettings?.brandName || "MONOLITH";
  const brandSuffix = siteSettings?.brandSuffix || ".GE";
  const logoType = siteSettings?.logoType || "icon";
  const logoImage = siteSettings?.logoImage || "";
  const logoHeight = siteSettings?.logoHeight || 36;
  const showTextWithLogo = siteSettings?.showBrandTextWithLogo !== false;

  const phone = siteSettings?.contactPhone || "+995 555 12 34 56";
  const email = siteSettings?.contactEmail || "info@monolith.ge";
  const address = siteSettings?.contactAddress || "თბილისი, საქართველო";

  const description =
    siteSettings?.footerDescription ||
    "მაღალი სიმტკიცის არქიტექტურული და ლანდშაფტის ბეტონის ნაკეთობები. მონოლითური საფეხურები, დიდფორმატიანი ფილები, საყვავილეები და ურბანული ავეჯი.";

  const copyright =
    siteSettings?.footerCopyright ||
    `© ${new Date().getFullYear()} ${brandName}${brandSuffix} — ყველა უფლება დაცულია.`;

  const madeIn = siteSettings?.footerMadeInText || "დამზადებულია საქართველოში 🇬🇪";

  const links = (siteSettings?.footerLinks || []).filter((l) => l.enabled !== false);
  const socials = siteSettings?.socials || {};

  return (
    <footer className="bg-white dark:bg-stone-950 border-t border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 py-14 sm:py-16 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              {logoType === "image" && logoImage ? (
                <img
                  src={logoImage}
                  alt={brandName}
                  style={{ maxHeight: `${logoHeight}px` }}
                  className="w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="w-9 h-9 bg-stone-800 text-white dark:bg-white dark:text-stone-950 rounded-lg flex items-center justify-center font-black transition-transform duration-200 group-hover:scale-105">
                  <Layers className="w-5 h-5 stroke-[2.5]" />
                </div>
              )}
              {(!logoImage || showTextWithLogo) && (
                <span className="text-xl font-extrabold tracking-wider text-stone-900 dark:text-white">
                  {brandName}
                  <span className="text-amber-600 dark:text-amber-400">{brandSuffix}</span>
                </span>
              )}
            </Link>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-4 max-w-sm leading-relaxed">
              {description}
            </p>

            {/* Social Media Links */}
            {(socials.facebook || socials.instagram || socials.whatsapp) && (
              <div className="mt-5 flex items-center gap-3">
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </a>
                )}
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {socials.whatsapp && (
                  <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-stone-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-4">
              ნავიგაცია
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {links.map((link) => (
                <li key={link.id}>
                  {link.isExternal ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-stone-900 dark:hover:text-white transition inline-flex items-center gap-1"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="hover:text-stone-900 dark:hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
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
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:text-stone-900 dark:hover:text-white transition font-medium"
                >
                  {phone}
                </a>
              </li>
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-stone-700 dark:text-stone-300 flex-shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-stone-900 dark:hover:text-white transition"
                  >
                    {email}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-stone-700 dark:text-stone-300 flex-shrink-0" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200/90 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>{copyright}</p>
          <p>{madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
