import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import { useData } from "../context/DataContext";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Building,
} from "lucide-react";

export default function Contact() {
  const { siteSettings, addInquiry } = useData();

  const phone = siteSettings?.contactPhone || "+995 593 37 20 56";
  const phone2 = siteSettings?.contactPhone2 || "";
  const email = siteSettings?.contactEmail || "info@monolith.ge";
  const address = siteSettings?.contactAddress || "თბილისი, საქართველო (საწარმო & შოურუმი)";
  const workingHours = siteSettings?.contactWorkingHours || "ორშაბათი - შაბათი: 09:00 - 19:00";
  const cleanPhone = phone.replace(/\s+/g, "");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    productInterest: "საფეხურები",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg("გთხოვთ მიუთითოთ თქვენი სახელი და ტელეფონის ნომერი.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await addInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        message: form.message.trim(),
        detailsSummary: `დაინტერესება: ${form.productInterest}. შეტყობინება: ${form.message.trim() || "მითითებული არ არის"}`,
        source: "Contact Page",
      });

      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        productInterest: "საფეხურები",
        message: "",
      });
    } catch (err) {
      setErrorMsg("მოთხოვნის გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ პირდაპირ დარეკვა.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <SEO
        title="კონტაქტი & ლოკაცია | MONOLITH არქიტექტურული ბეტონი"
        description="დაგვიკავშირდით უფასო საინჟინრო კონსულტაციისა და ხარჯთაღრიცხვის მისაღებად. საწარმო და შოურუმი თბილისში, ტელეფონი: +995 593 37 20 56."
      />

      {/* HEADER SECTION */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-stone-200/80 dark:border-stone-800 bg-gradient-to-b from-stone-100/50 dark:from-stone-900/40 to-transparent">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>კონტაქტი & ლოკაცია • Contact</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-950 dark:text-white tracking-tight leading-tight">
            დაგვიკავშირდით და დავიწყოთ თქვენი პროექტი
          </h1>
          <p className="mt-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            ჩვენი საინჟინრო გუნდი მზადაა გაგიწიოთ უფასო კონსულტაცია, დაგეხმაროთ ზომების დაგეგმვასა და მოდელების შერჩევაში
            და მოგაწოდოთ ზუსტი ხარჯთაღრიცხვა.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT: 2-COLUMN GRID */}
      <section className="py-12 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: CONTACT DETAILS & INFO CARDS (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                    პირდაპირი კავშირი
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white">
                    საკონტაქტო რეკვიზიტები
                  </h2>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Phone */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/60 dark:border-stone-800/80">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        ტელეფონი / WhatsApp:
                      </span>
                      <a
                        href={`tel:${cleanPhone}`}
                        className="text-base sm:text-lg font-bold text-stone-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition"
                      >
                        {phone}
                      </a>
                      {phone2 && (
                        <div className="mt-1">
                          <a
                            href={`tel:${phone2.replace(/\s+/g, "")}`}
                            className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-500 transition"
                          >
                            {phone2}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/60 dark:border-stone-800/80">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        ელექტრონული ფოსტა:
                      </span>
                      <a
                        href={`mailto:${email}`}
                        className="text-base font-bold text-stone-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/60 dark:border-stone-800/80">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        საწარმო & შოურუმი:
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-stone-900 dark:text-white mt-0.5">
                        {address}
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/60 dark:border-stone-800/80">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        სამუშაო განრიგი:
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-stone-900 dark:text-white mt-0.5">
                        {workingHours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct quick action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>დარეკვა</span>
                  </a>
                  <a
                    href={`https://wa.me/${cleanPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>WhatsApp ჩათი</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* FAQ banner */}
              <div className="bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-xs text-stone-600 dark:text-stone-300">
                    გაქვთ კითხვები მონტაჟსა და მოვლაზე?
                  </span>
                </div>
                <Link
                  to="/faq"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
                >
                  კითხვა-პასუხი →
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: CONSULTATION & INQUIRY FORM (7 COLS) */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl relative overflow-hidden">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                    ონლაინ განაცხადი
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-white">
                    მოითხოვეთ ხარჯთაღრიცხვა
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                    შეავსეთ ფორმა და ჩვენი ინჟინერი უმოკლეს დროში დაგიკავშირდებათ ზუსტი შეთავაზებით.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-12 px-6 text-center space-y-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-fade-in">
                    <div className="w-16 h-16 bg-emerald-500 text-stone-950 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                      გმადლობთ! თქვენი მოთხოვნა მიღებულია
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                      ჩვენი საინჟინრო სამსახური განიხილავს მონაცემებს და ოპერატიულად დაგიკავშირდებათ მითითებულ ნომერზე.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold text-xs rounded-xl transition"
                    >
                      ახალი მოთხოვნის გაგზავნა
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                          თქვენი სახელი და გვარი *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="მაგ: გიორგი ბერიძე"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                          ტელეფონის ნომერი *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="მაგ: 599 XX XX XX"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                          ელფოსტა (სურვილისამებრ)
                        </label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                        />
                      </div>

                      {/* Object Location */}
                      <div>
                        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                          ობიექტის მისამართი / ქალაქი
                        </label>
                        <input
                          type="text"
                          placeholder="მაგ: თბილისი, წყნეთი"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                        />
                      </div>
                    </div>

                    {/* Product interest selector */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                        სასურველი ნაკეთობა ან კატეგორია
                      </label>
                      <select
                        value={form.productInterest}
                        onChange={(e) => setForm({ ...form, productInterest: e.target.value })}
                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="საფეხურები">კიბის მონოლითური საფეხურები</option>
                        <option value="მოსაპირკეთებელი ფილები">ეზოსა და ტერასის მოსაპირკეთებელი ფილები</option>
                        <option value="საყვავილეები">ბეტონის საყვავილეები & ქოთნები</option>
                        <option value="რიგელები და ბორდიურები">რიგელები, სანიაღვრე & ბორდიურები</option>
                        <option value="ინდივიდუალური პროექტი">ინდივიდუალური არქიტექტურული შეკვეთა ნახაზით</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                        შეტყობინება / ზომები / დეტალები
                      </label>
                      <textarea
                        rows={4}
                        placeholder="მიუთითეთ სავარაუდო რაოდენობა, ზომები ან მოგვწერეთ თქვენი პროექტის შესახებ..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-black rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "იგზავნება..." : "ხარჯთაღრიცხვის მოთხოვნის გაგზავნა"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
