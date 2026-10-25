import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Layers,
  Wrench,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    id: "q1",
    category: "quality",
    question: "რა განასხვავებს არქიტექტურულ ბეტონს ჩვეულებრივი სამშენებლო ბეტონისგან?",
    answer:
      "არქიტექტურული ბეტონი არის სპეციალური მაღალტექნოლოგიური ნარევი (M500 / B35+ მარკა), რომელიც მზადდება წვრილმარცვლოვანი კვარცის ქვიშის, გერმანული პლასტიფიკატორებისა და ფიბრო-არმირების ბაზაზე. ის გამოირჩევა განსაკუთრებული გლუვი ან ზუსტად კონტროლირებადი ფაქტურით, მაღალი სიმკვრივით, ნულოვანი მიკრობზარებითა და წყალგაუმტარობით. ის გამოიყენება როგორც საბოლოო დეკორატიული ელემენტი და არ საჭიროებს შემდგომ შელესვას ან შეღებვას.",
  },
  {
    id: "q2",
    category: "quality",
    question: "როგორია ბეტონის ნაკეთობების ყინვაგამძლეობა და ექსპლუატაციის ვადა?",
    answer:
      "ჩვენი ნაკეთობების ყინვაგამძლეობა შეესაბამება F300 სტანდარტს (უძლებს მინიმუმ 300 სრულ გაყინვა-გალღობის ციკლს), ხოლო წყალშეუღწევადობა W8 მარკას. სპეციალური ჰიდროფობიური დანამატები გამორიცხავს წყლის შიდა ფორებში შეწოვას, რაც იცავს ბეტონს მკაცრ ზამთარში დაშლისა და აშრევებისგან. სწორი მონტაჟის პირობებში ექსპლუატაციის ვადა 50+ წელს აღემატება.",
  },
  {
    id: "q3",
    category: "custom",
    question: "შესაძლებელია თუ არა ნაკეთობების დამზადება ინდივიდუალური ზომებითა და ნახაზით?",
    answer:
      "დიახ! გარდა ჩვენი სტანდარტული კატალოგისა, საწარმოში გვაქვს საყალიბე საამქრო, სადაც ვამზადებთ ინდივიდუალურ ფორმებს არქიტექტორის ან დიზაინერის ნახაზების მიხედვით: არასტანდარტული რადიუსის საფეხურები, ფასადის 3D პანელები, სპეციფიკური ზომის ქოთნები, აუზისპირა L-ბორტები და ურბანული სკამები.",
  },
  {
    id: "q4",
    category: "quality",
    question: "ხუნდება თუ არა ფერი მზეზე და ულტრაიისფერ სხივებზე?",
    answer:
      "არა, ფერი არ ხუნდება. ჩვენ ვიყენებთ გერმანული წარმოების (Bayferrox) მინერალურ არაორგანულ პიგმენტებს, რომლებიც ერევა უშუალოდ ბეტონის მასაში ჩამოსხმის პროცესში (სრული მასიური პიგმენტაცია) და არა მხოლოდ ზედაპირზე. ფერი მდგრადია მზის ულტრაიისფერი სხივების, წვიმისა და ტემპერატურული რყევების მიმართ.",
  },
  {
    id: "q5",
    category: "orders",
    question: "როგორია შეკვეთის დამზადებისა და ჩაბარების ვადები?",
    answer:
      "სტანდარტული კატალოგის პროდუქციის დამზადების ვადაა 3–7 სამუშაო დღე (მარაგში არსებობის შემთხვევაში მიწოდება ხდება მეორე დღესვე). ინდივიდუალური ყალიბების დამზადებასა და რთულ პროექტებს ესაჭიროება 10–18 სამუშაო დღე. ზუსტი ვადები ფიქსირდება ხელშეკრულებაში შეკვეთის გაფორმებისას.",
  },
  {
    id: "q6",
    category: "delivery",
    question: "როგორ ხდება ტრანსპორტირება და მიწოდება საქართველოს მასშტაბით?",
    answer:
      "მიწოდება ხორციელდება მთელი საქართველოს მასშტაბით: თბილისი, ბათუმი, ქუთაისი, თელავი და რეგიონები. ნაკეთობები საიმედოდ შეფუთულია ხის პალეტებზე და დაცულია სტრეჩ-ფირფიტით. მიწოდება შესაძლებელია როგორც მანიპულატორიანი ამწე-ავტომობილით (გადმოტვირთვის სერვისით), ასევე საწარმოდან თვითგატანის პირობით.",
  },
  {
    id: "q7",
    category: "maintenance",
    question: "რა ტიპის მოვლას საჭიროებს არქიტექტურული ბეტონი?",
    answer:
      "არქიტექტურული ბეტონი მინიმალურ მოვლას საჭიროებს. რეკომენდებულია პერიოდული გასუფთავება წყლის ჭავლით ან რბილი ჯაგრისით. ღია ტერასებისა და აუზისპირა ფილებისთვის სასურველია 3–5 წელიწადში ერთხელ ზედაპირის დამცავი ჰიდროფობიზატორით (გამჭვირვალე წყალგაუმტარი საფარით) განახლება, რაც უზრუნველყოფს მუდმივ სისუფთავესა და ლაქებისგან დაცვას.",
  },
  {
    id: "q8",
    category: "delivery",
    question: "გაქვთ თუ არა ადგილზე მონტაჟის მომსახურება?",
    answer:
      "ჩვენი საინჟინრო გუნდი გასცემს სრულ ტექნიკურ რეკომენდაციებს სწორ მონტაჟთან დაკავშირებით და გთავაზობთ ჩვენს პარტნიორ, კვალიფიციურ მემონტაჟეთა ჯგუფებს, რომლებსაც აქვთ არქიტექტურულ ბეტონთან მუშაობის მრავალწლიანი გამოცდილება და სამუშაოებს ასრულებენ გარანტიით.",
  },
  {
    id: "q9",
    category: "orders",
    question: "როგორ გამოვითვალოთ საჭირო რაოდენობა და მივიღოთ ხარჯთაღრიცხვა?",
    answer:
      "დაგვიკავშირდით ნომერზე +995 555 12 34 56, გამოგვიგზავნეთ ნახაზი ან პროექტი ელფოსტაზე info@monolith.ge, ან შეავსეთ საკონსულტაციო ფორმა საიტზე. ჩვენი ინჟინერი გაეცნობა მოთხოვნებს და 24 საათში მოგიმზადებთ დეტალურ სპეციფიკაციასა და ხარჯთაღრიცხვას.",
  },
];

const CATEGORIES = [
  { id: "all", label: "ყველა კითხვა", icon: HelpCircle },
  { id: "quality", label: "ხარისხი & ტექნოლოგია", icon: ShieldCheck },
  { id: "custom", label: "ინდივიდუალური შეკვეთა", icon: Sparkles },
  { id: "delivery", label: "მიწოდება & მონტაჟი", icon: Truck },
  { id: "orders", label: "შეკვეთა & ვადები", icon: Layers },
  { id: "maintenance", label: "მოვლა & ექსპლუატაცია", icon: Wrench },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState("q1");

  const toggleAccordion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen pt-4 sm:pt-6 pb-20 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-6 sm:mb-8">
          <Link to="/" className="hover:text-stone-900 dark:hover:text-white transition">
            მთავარი
          </Link>
          <span>/</span>
          <span className="text-stone-900 dark:text-white font-bold">კითხვა-პასუხი</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (Sticky Sidebar on Desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div>
              <span className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-widest block">
                ცოდნის ბაზა & მხარდაჭერა
              </span>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black text-stone-900 dark:text-white mt-1 tracking-tight leading-tight">
                ხშირად დასმული კითხვები
              </h1>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                ყველაფერი არქიტექტურული ბეტონის მახასიათებლებზე, ინდივიდუალურ დამზადებაზე, მიწოდებასა და ექსპლუატაციაზე.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="მოძებნეთ კითხვა (მაგ. ყინვაგამძლეობა, ფერი)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#121211] border border-stone-200 dark:border-stone-800 rounded-xl placeholder-stone-400 text-stone-900 dark:text-white focus:outline-none focus:border-stone-800 dark:focus:border-white shadow-sm transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-white font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Desktop Vertical Category Menu */}
            <div className="space-y-1.5 hidden lg:block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-2 px-1">
                თემატური კატეგორიები
              </span>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const count =
                  cat.id === "all"
                    ? FAQ_ITEMS.length
                    : FAQ_ITEMS.filter((item) => item.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-left ${
                      isActive
                        ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-sm"
                        : "bg-white/70 dark:bg-[#121211]/80 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-amber-400 dark:text-amber-600" : "text-stone-400"}`} />
                      <span>{cat.label}</span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                        isActive
                          ? "bg-white/20 text-white dark:bg-stone-900/20 dark:text-stone-950"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Contact Card (Desktop) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121211] border border-stone-200/90 dark:border-stone-800 hidden lg:block shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>ვერ იპოვეთ პასუხი?</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                ჩვენი საინჟინრო გუნდი მზადაა გაგიწიოთ დეტალური ტექნიკური კონსულტაცია.
              </p>
              <div className="mt-3.5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                <a
                  href="tel:+995555123456"
                  className="inline-flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>+995 555 12 34 56</span>
                </a>
                <Link
                  to="/products"
                  className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white transition flex items-center gap-1"
                >
                  <span>კატალოგი</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (Questions List) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Mobile Category Bar (Horizontal Scroll) */}
            <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                      isActive
                        ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-sm"
                        : "bg-white dark:bg-[#121211] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/90 dark:border-stone-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filter Status Bar */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
              <span>
                ნაჩვენებია{" "}
                <strong className="text-stone-900 dark:text-white font-bold">
                  {filteredItems.length}
                </strong>{" "}
                კითხვა
              </span>
              {(activeCategory !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  ფილტრის გასუფთავება
                </button>
              )}
            </div>

            {/* Accordion Cards */}
            <div className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#121211] rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
                  <HelpCircle className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                    კითხვა ვერ მოიძებნა
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    სცადეთ სხვა საძიებო სიტყვა ან დაგვიკავშირდით პირდაპირ.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    ფილტრის გასუფთავება
                  </button>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isOpen = openId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`group rounded-2xl transition-all duration-200 border overflow-hidden ${
                        isOpen
                          ? "bg-white dark:bg-[#121211] border-stone-300 dark:border-stone-700 shadow-sm"
                          : "bg-white/80 dark:bg-[#121211]/60 hover:bg-white dark:hover:bg-[#121211] border-stone-200/90 dark:border-stone-800"
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-start sm:items-center justify-between gap-4 transition"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                              isOpen
                                ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950"
                                : "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-white leading-snug">
                            {item.question}
                          </span>
                        </div>
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen
                              ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 rotate-180"
                              : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80 animate-fade-in pl-12 sm:pl-14">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Mobile Contact Box */}
            <div className="lg:hidden p-5 rounded-2xl bg-white dark:bg-[#121211] border border-stone-200/90 dark:border-stone-800 shadow-sm mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                ვერ იპოვეთ პასუხი?
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                დაგვიკავშირდით ნომერზე ან მოგვწერეთ კონსულტაციისთვის:
              </p>
              <div className="mt-3 flex items-center justify-between">
                <a
                  href="tel:+995555123456"
                  className="inline-flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-white"
                >
                  <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>+995 555 12 34 56</span>
                </a>
                <Link
                  to="/products"
                  className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white transition flex items-center gap-1"
                >
                  <span>კატალოგი</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
