import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";
import { useData } from "../context/DataContext";
import {
  ShieldCheck,
  Layers,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  Hammer,
  CheckCircle2,
  Phone,
  Factory,
  PenTool,
  Droplets,
  Sun,
  Flame,
} from "lucide-react";

export default function About() {
  const { siteSettings } = useData();

  const brandName = siteSettings?.brandName || "MONOLITH";
  const phone = siteSettings?.contactPhone || "+995 593 37 20 56";

  const stats = [
    { value: "10+", label: "წლიანი საგარანტიო პერიოდი" },
    { value: "M500", label: "ბეტონის სიმტკიცის უმაღლესი მარკა (B40)" },
    { value: "F300", label: "ყინვაგამძლეობის გარანტირებული ციკლი" },
    { value: "500+", label: "წარმატებით შესრულებული ობიექტი" },
  ];

  const advantages = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: "M500 / B40 არქიტექტურული სიმტკიცე",
      desc: "ვიყენებთ მხოლოდ წვრილმარცვლოვან კვარცის ქვიშას, გერმანულ პლასტიფიკატორებსა და ფიბრო-არმირებას, რაც უზრუნველყოფს ნულოვან მიკრობზარებსა და ექსტრემალურ სიმტკიცეს.",
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      title: "F300 ყინვაგამძლეობა და ჰიდროფობიურობა",
      desc: "სპეციალური ჰიდროფობიური დანამატების დამსახურებით, ბეტონი წყალს არ იწოვს, რაც იცავს მას ზამთარში გაყინვა-გალღობისას აშრევებისა და ზედაპირული დაშლისგან.",
    },
    {
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      title: "Bayferrox მასიური პიგმენტაცია",
      desc: "გერმანული მინერალური პიგმენტები ერევა ბეტონის მთელ მოცულობაში. ფერი არ ხუნდება ულტრაიისფერ სხივებზე, წვიმასა და ატმოსფერულ ნალექებზე.",
    },
    {
      icon: <PenTool className="w-6 h-6 text-amber-500" />,
      title: "ინდივიდუალური საყალიბე საამქრო",
      desc: "გარდა კატალოგის სტანდარტული მოდელებისა, ვამზადებთ არასტანდარტულ რადიუსებს, L-ფორმის მონოლითებსა და ინდივიდუალურ გეომეტრიებს თქვენი არქიტექტურული ნახაზით.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "კომპიუტერული დაგეგმარება და ყალიბი",
      desc: "ყოველი პროდუქტისთვის მზადდება მილიმეტრული სიზუსტის მეტალისა და პოლიმერის საყალიბე სისტემა.",
    },
    {
      num: "02",
      title: "ვაკუუმ-ვიბროჩამოსხმა",
      desc: "მაღალსიხშირული ვიბრომაგიდები სრულად ათავისუფლებს ნარევს ჰაერის ფორებისგან, რაც ქმნის მონოლითურ სიმკვრივეს.",
    },
    {
      num: "03",
      title: "თერმული მომწიფება და კონტროლი",
      desc: "ნაკეთობები გადის ტემპერატურულად კონტროლირებად ჰიდრატაციას, რაც უზრუნველყოფს მაქსიმალურ საპროექტო მარკას.",
    },
    {
      num: "04",
      title: "საბოლოო დამუშავება & შეფუთვა",
      desc: "ზედაპირის ქვიშაჭავლით ან ალმასით დამუშავება, ჰიდროფობიზატორით გაჟღენთვა და ევროპალეტებზე დაცული შეფუთვა.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbf9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <SEO
        title="ჩვენს შესახებ | არქიტექტურული ბეტონის საწარმო MONOLITH"
        description="გაიგეთ მეტი MONOLITH-ის საწარმოო შესაძლებლობებზე: M500 / B40 მარკის არქიტექტურული ბეტონი, მონოლითური საფეხურები, ფილები და ინდივიდუალური პროექტები 10 წლიანი გარანტიით."
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200/80 dark:border-stone-800 overflow-hidden">
        {/* Subtle background ambient gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Factory className="w-3.5 h-3.5" />
              <span>ჩვენს შესახებ • About {brandName}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-950 dark:text-white tracking-tight leading-[1.15]">
              არქიტექტურული ბეტონი — ფორმისა და სიმტკიცის სინთეზი
            </h1>
            <p className="mt-5 text-base sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {brandName} არის მაღალტექნოლოგიური არქიტექტურული და ლანდშაფტური ბეტონის საწარმო საქართველოში.
              ჩვენ ვქმნით მონოლითურ საფეხურებს, დიდფორმატიან ეზოს ფილებს, საყვავილეებსა და ურბანულ ელემენტებს,
              რომლებიც ათწლეულების განმავლობაში ინარჩუნებენ პირვანდელ სილამაზესა და სიმტკიცეს.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 p-5 sm:p-7 rounded-2xl sm:rounded-3xl shadow-sm hover:border-amber-500/40 transition"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY & STORY */}
      <section className="py-16 sm:py-24 border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
                ჩვენი ფილოსოფია
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-stone-950 dark:text-white tracking-tight">
                რატომ ვირჩევთ არქიტექტურულ ბეტონს?
              </h2>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
                ტრადიციული სამშენებლო ბეტონისგან განსხვავებით, არქიტექტურული ბეტონი არ არის მხოლოდ კონსტრუქციული მასალა —
                ის არის საბოლოო, ესთეტიკური და დახვეწილი საფარი, რომელიც არ საჭიროებს შემდგომ შელესვას, ღებვას ან ფილით მოპირკეთებას.
              </p>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
                ჩვენი მიზანია შევთავაზოთ ქართველ არქიტექტორებს, დეველოპერებსა და კერძო დამკვეთებს ისეთი დონის ნაკეთობები,
                რომლებიც სრულად პასუხობს ევროპულ DIN EN და ASTM სტანდარტებს — მინიმალიზმი, ზუსტი გეომეტრიული ხაზები და უმაღლესი სიმკვრივე.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition"
                >
                  <span>პროდუქციის კატალოგი</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 font-bold text-sm transition"
                >
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span>კონტაქტი & კონსულტაცია</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl bg-stone-900 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&fm=webp&w=1200&q=80"
                  alt="Monolith Architecture Concrete"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white">
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
                      საწარმოო ხარისხი
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold mt-1">
                      თანამედროვე ვიბროჩამოსხმა და მონოლითური გეომეტრია
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE ADVANTAGES */}
      <section className="py-16 sm:py-24 bg-white dark:bg-stone-900/50 border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-2">
              ტექნოლოგიური სტანდარტები
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-950 dark:text-white tracking-tight">
              რატომ არის ჩვენი ბეტონი განსაკუთრებული?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {advantages.map((adv, i) => (
              <div
                key={i}
                className="bg-stone-50 dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/40 transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {adv.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-950 dark:text-white mb-2">
                  {adv.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCTION PROCESS */}
      <section className="py-16 sm:py-24 border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-2">
              წარმოების ეტაპები
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-950 dark:text-white tracking-tight">
              იდეიდან მზა მონოლითურ ნაკეთობამდე
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div
                key={i}
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 relative shadow-sm"
              >
                <span className="text-4xl font-black text-amber-500/30 dark:text-amber-500/20 block mb-3 font-mono">
                  {st.num}
                </span>
                <h3 className="text-base font-bold text-stone-950 dark:text-white mb-2">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-stone-900 to-stone-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
            გაქვთ პროექტი ან გსურთ კონსულტაცია?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            შევარჩიოთ თქვენი სივრცისთვის იდეალური ბეტონის გადაწყვეტა
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            დაგვიკავშირდით ნომერზე <strong className="text-amber-400">{phone}</strong> ან გამოგვიგზავნეთ ნახაზი
            უფასო საინჟინრო კონსულტაციისა და ხარჯთაღრიცხვის მისაღებად.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
            >
              კონტაქტის გვერდზე გადასვლა
            </Link>
            <Link
              to="/calculator"
              className="px-8 py-3.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl text-sm border border-stone-700 transition"
            >
              ონლაინ კალკულატორი
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
