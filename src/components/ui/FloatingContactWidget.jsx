import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import {
  MessageCircle,
  Phone,
  X,
  Send,
  CheckCircle2,
  Calculator,
  Clock,
  Sparkles,
} from "lucide-react";

export default function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { siteSettings, addInquiry } = useData();
  const [phoneInput, setPhoneInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [sent, setSent] = useState(false);

  const phone = siteSettings?.contactPhone || "+995 555 12 34 56";
  const whatsappUrl =
    siteSettings?.socials?.whatsapp ||
    `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      "გამარჯობა MONOLITH, მაინტერესებს ბეტონის ნაკეთობების კატალოგი და ფასები."
    )}`;

  const handleQuickCallRequest = (e) => {
    e.preventDefault();
    if (!phoneInput) return;
    addInquiry({
      name: nameInput || "სწრაფი ზარი",
      phone: phoneInput,
      source: "Floating Widget Quick Call Request",
      comment: "მომხმარებელმა მოითხოვა სწრაფი გადმორეკვა მცურავი ვიჯეტიდან.",
    });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setIsOpen(false);
      setPhoneInput("");
      setNameInput("");
    }, 2500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
      {/* Popover / Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/90 dark:border-stone-800 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                სწრაფი კავშირი
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Close widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2.5 leading-relaxed">
            დაგვიკავშირდით პირდაპირ მესენჯერში ან დაგვიტოვეთ ნომერი 10-წუთიანი კონსულტაციისთვის.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 text-white text-xs font-bold transition shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>დარეკვა</span>
            </a>
          </div>

          {/* Calculator Link Pill */}
          <div className="mt-3">
            <Link
              to="/calculator"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition"
            >
              <span className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-500" />
                <span>ონლაინ კალკულატორი</span>
              </span>
              <span>გაანგარიშება →</span>
            </Link>
          </div>

          {/* Quick Callback Form */}
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-2">
              მოითხოვეთ სწრაფი გადმორეკვა:
            </span>

            {sent ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>მოთხოვნა მიღებულია, მალე დაგიკავშირდებით!</span>
              </div>
            ) : (
              <form onSubmit={handleQuickCallRequest} className="space-y-2">
                <input
                  type="text"
                  placeholder="თქვენი სახელი"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex gap-1.5">
                  <input
                    type="tel"
                    required
                    placeholder="ტელეფონი: 599 XX XX XX"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="flex-grow px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition shrink-0"
                    title="გაგზავნა"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick contact"
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen
            ? "bg-stone-900 dark:bg-white text-white dark:text-stone-950 rotate-90 scale-95"
            : "bg-amber-500 hover:bg-amber-400 text-stone-950 hover:scale-105 ring-4 ring-amber-500/20"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-stone-950 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-stone-950 rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
}
