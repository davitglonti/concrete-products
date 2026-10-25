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
  const [openId, setOpenId] = useState("q1"); // First item open by default

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
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen py-10 sm:py-16 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-4">
          <Link to="/" className="hover:text-stone-900 dark:hover:text-white transition">
            მთავარი
          </Link>
          <span>/</span>
          <span className="text-stone-900 dark:text-white font-bold">კითხვა-პასუხი</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>ხშირად დასმული კითხვები</span>
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
            ყველაფერი არქიტექტურული ბეტონის შესახებ
          </h1>
          <p className="text-xs sm:text-base text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
            პასუხები ტექნოლოგიურ მახასიათებლებზე, ინდივიდუალურ დამზადებაზე,
            მიწოდების პირობებსა და ექსპლუატაციის წესებზე.
          </p>

          {/* Search Input */}
          <div className="relative mt-6 max-w-lg mx-auto">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="მოძებნეთ კითხვა (მაგ. ყინვაგამძლეობა, ფერი, მიწოდება)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl placeholder-stone-400 text-stone-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md scale-105"
                    : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/90 dark:border-stone-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
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
                  className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                    isOpen
                      ? "bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 shadow-md"
                      : "bg-white/80 dark:bg-stone-900/60 hover:bg-white dark:hover:bg-stone-900 border-stone-200/90 dark:border-stone-800"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 shrink-0">
                        0{index + 1}
                      </span>
                      <span className="text-xs sm:text-base font-bold text-stone-900 dark:text-white leading-snug">
                        {item.question}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-amber-500 text-stone-950 rotate-180"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80 animate-fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA Banner */}
        <div className="mt-14 max-w-3xl mx-auto bg-stone-900 dark:bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
              დამატებითი კითხვები
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              ვერ იპოვეთ თქვენთვის საინტერესო პასუხი?
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-md">
              დაგვიკავშირდით პირდაპირ და ჩვენი მთავარი ინჟინერი უპასუხებს თქვენს
              ნებისმიერ ტექნიკურ შეკითხვას.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:+995555123456"
              className="w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow"
            >
              <Phone className="w-4 h-4" />
              <span>დაგვირეკეთ</span>
            </a>
            <Link
              to="/products"
              className="w-full sm:w-auto bg-stone-800 hover:bg-stone-700 text-white font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-stone-700"
            >
              <span>კატალოგი</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
