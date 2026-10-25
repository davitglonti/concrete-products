import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import ProductCard from "../components/ui/ProductCard";
import { CATEGORIES, HERO_SLIDES } from "../data/initialData";
import {
  ArrowRight,
  Sparkles,
  Snowflake,
  ShieldCheck,
  Compass,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function Home() {
  const { products, projects, categories, addInquiry } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleQuickConsult = (e) => {
    e.preventDefault();
    addInquiry({ ...form, source: "Home Quick Consultation" });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "" });
    }, 3500);
  };

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="flex flex-col w-full bg-[#fbfbf9] dark:bg-stone-950 transition-colors duration-200">
      {/* 1. FULL-WIDTH HERO SLIDER (Direct Text on Photo - No Boxed Window!) */}
      <section
        className="relative w-full min-h-[580px] sm:min-h-[680px] lg:h-[780px] overflow-hidden bg-stone-950 flex flex-col justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-bleed background images */}
        {HERO_SLIDES.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={item.image}
              alt={item.titleMain}
              className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
            />
            {/* Seamless, organic gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent dark:from-stone-950/90 dark:via-stone-950/55 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 w-full py-12 sm:py-16">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Dynamic Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/15 dark:bg-stone-900/60 border border-white/25 dark:border-stone-700/80 text-white text-[11px] sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-md mb-4 sm:mb-6 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{slide.badge}</span>
            </div>

            {/* Dynamic Headline */}
            <h1 className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.15] drop-shadow-lg">
              {slide.titleMain} <br />
              <span className="text-amber-400 drop-shadow">
                {slide.titleHighlight}
              </span>
            </h1>

            {/* Dynamic Subtitle */}
            <p className="text-stone-200 text-xs sm:text-base lg:text-xl mt-3 sm:mt-6 max-w-2xl leading-relaxed font-normal drop-shadow">
              {slide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-2.5 sm:gap-4">
              <Link
                to={slide.categoryLink}
                className="bg-white hover:bg-stone-100 text-stone-950 font-bold px-5 sm:px-7 py-3 sm:py-4 rounded-xl inline-flex items-center gap-2 transition shadow-xl hover:scale-[1.02] text-xs sm:text-sm"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/portfolio"
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-5 sm:px-7 py-3 sm:py-4 rounded-xl border border-white/30 backdrop-blur-md transition hover:scale-[1.02] text-xs sm:text-sm"
              >
                შესრულებული სამუშაოები
              </Link>
            </div>

            {/* Quick Specs Indicator */}
            <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/20 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-stone-300 font-medium drop-shadow">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> F300 ყინვაგამძლეობა
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> M500 სიმტკიცე
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Bayferrox პიგმენტაცია
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Floating Controls */}
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-12 z-20 flex items-center gap-2.5 sm:gap-4 bg-black/50 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-xl text-white">
          {/* Slide counter */}
          <div className="text-[11px] sm:text-xs font-mono font-bold pr-2 border-r border-white/20">
            <span>0{currentSlide + 1}</span>
            <span className="text-white/50"> / 0{HERO_SLIDES.length}</span>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-5 sm:w-6 bg-white" : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-0.5 sm:gap-1 pl-1.5 sm:pl-2 border-l border-white/20">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-1 sm:p-1.5 rounded-lg hover:bg-white/20 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-1 sm:p-1.5 rounded-lg hover:bg-white/20 transition"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION (Expanded Widescreen Layout + Mobile Horizontal Swiper) */}
      <section className="bg-[#f5f3ee] dark:bg-stone-900/40 py-12 sm:py-16 lg:py-20 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-end justify-between gap-3 mb-5 sm:mb-8">
            <div>
              <span className="text-stone-500 dark:text-stone-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest block">
                ძირითადი მიმართულებები
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-white mt-0.5 sm:mt-1">
                ბეტონის ნაკეთობების კატეგორიები
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-xs sm:text-sm font-bold transition shrink-0"
            >
              <span>სრული კატალოგის ნახვა</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: Horizontal scrollable track with 3-4 items visible | Desktop: Grid */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-6 xl:gap-8 overflow-x-auto sm:overflow-visible no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-px-4">
            {(categories && categories.length > 0 ? categories : CATEGORIES).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group flex-shrink-0 snap-start w-[27vw] min-w-[96px] max-w-[125px] sm:w-auto sm:flex-shrink-1 bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-square sm:aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {cat.badge && (
                    <span className="absolute top-1.5 left-1.5 sm:top-3.5 sm:left-3.5 bg-stone-900/85 dark:bg-stone-950/85 backdrop-blur text-white text-[8px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg border border-stone-700/60 shadow-sm truncate max-w-[85%]">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <div className="p-2 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-[11px] sm:text-lg lg:text-xl font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition line-clamp-2 leading-tight text-center sm:text-left">
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="hidden sm:block text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:flex mt-3 sm:mt-5 pt-2 sm:pt-4 border-t border-stone-100 dark:border-stone-800/80 items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:translate-x-1 transition-transform">
                    <span>დათვალიერება</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Expanded Widescreen Layout + Mobile Horizontal Swiper) */}
      <section className="bg-white dark:bg-stone-950 py-12 sm:py-16 lg:py-20 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-end justify-between gap-3 mb-5 sm:mb-8">
            <div>
              <span className="text-stone-500 dark:text-stone-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest block">
                პოპულარული მოდელები
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-white mt-0.5 sm:mt-1">
                გამორჩეული პროდუქცია
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-xs sm:text-sm font-bold transition shrink-0"
            >
              <span>ყველა პროდუქტის ნახვა</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: Horizontal scrollable track with ~2.3 - 2.5 items visible | Desktop: Grid */}
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 xl:gap-8 overflow-x-auto sm:overflow-visible no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-px-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start flex-shrink-0 w-[46vw] sm:w-auto sm:flex-shrink-1 min-w-[160px] max-w-[230px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE OUR CONCRETE? (Warm Limestone — Expanded Widescreen + Mobile Horizontal Swiper) */}
      <section className="bg-[#f5f3ee] dark:bg-stone-900/60 py-12 sm:py-16 lg:py-20 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest block">
              საწარმოო სტანდარტი
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white mt-1 sm:mt-2">
              რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm lg:text-base mt-2 sm:mt-3 leading-relaxed">
              თითოეული ნაკეთობა გადის ვიბროჩამოსხმისა და თერმული გამოშრობის სრულ ტექნოლოგიურ ციკლს.
            </p>
          </div>

          {/* Mobile: Horizontal scrollable track for 4 features | Desktop: 4-column Grid */}
          <div className="flex lg:grid lg:grid-cols-4 gap-3.5 sm:gap-6 xl:gap-8 overflow-x-auto lg:overflow-visible no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-px-4">
            {/* Feature 1 */}
            <div className="snap-start flex-shrink-0 w-[72vw] sm:w-[45vw] lg:w-auto min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 sm:mb-5 shadow-sm">
                  <Snowflake className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-2">
                  ყინვაგამძლეობა F300
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                  სპეციალური ჰიდროფობიური დანამატები გამორიცხავს წყლის შეწოვას და ბზარების გაჩენას მკაცრ ზამთარშიც.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="snap-start flex-shrink-0 w-[72vw] sm:w-[45vw] lg:w-auto min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 sm:mb-5 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-2">
                  მაღალი სიმტკიცე (M500)
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                  ბაზალტისა და პოლიპროპილენის ფიბრო-ბოჭკოთი არმირებული სტრუქტურა უძლებს მაღალ სტატიკურ და დინამიკურ დატვირთვას.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="snap-start flex-shrink-0 w-[72vw] sm:w-[45vw] lg:w-auto min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 sm:mb-5 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-2">
                  მდგრადი პიგმენტაცია
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                  ვიყენებთ გერმანულ (Bayferrox) მინერალურ პიგმენტებს, რომლებიც სრულ მასაშია შერეული და მზეზე არ ხუნდება.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="snap-start flex-shrink-0 w-[72vw] sm:w-[45vw] lg:w-auto min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 sm:mb-5 shadow-sm">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-2">
                  ინდივიდუალური ყალიბები
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                  სტანდარტული კატალოგის გარდა, ვამზადებთ არასტანდარტული ზომის საფეხურებსა და საყვავილეებს არქიტექტორის ნახაზით.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO / COMPLETED PROJECTS (Expanded Widescreen + Mobile Horizontal Swiper) */}
      <section className="bg-white dark:bg-stone-950 py-12 sm:py-16 lg:py-20 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-end justify-between gap-3 mb-5 sm:mb-8">
            <div>
              <span className="text-stone-500 dark:text-stone-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest block">
                პორტფოლიო
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 dark:text-white mt-0.5 sm:mt-1">
                შესრულებული სამუშაოები
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-xs sm:text-sm font-bold transition shrink-0"
            >
              <span>ყველა პროექტის ნახვა</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile: Horizontal scrollable track with ~1.3 cards visible | Desktop: 3-column Grid */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8 overflow-x-auto md:overflow-visible no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-px-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="snap-start flex-shrink-0 w-[78vw] sm:w-[55vw] md:w-auto md:flex-shrink-1 min-w-[270px] max-w-[360px] flex flex-col"
              >
                <Link
                  to={`/portfolio/${project.id}`}
                  className="group bg-[#fbfbf9] dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="aspect-[16/10] overflow-hidden relative bg-stone-100 dark:bg-stone-800">
                    <img
                      src={project.images?.[0] || project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Location & Year Badges */}
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 flex items-center gap-1.5 sm:gap-2">
                      <span className="bg-white/90 dark:bg-stone-950/85 backdrop-blur text-stone-900 dark:text-white text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 border border-stone-200 dark:border-stone-800 shadow-sm">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                        {project.location}
                      </span>
                      <span className="bg-stone-800 text-white dark:bg-white dark:text-stone-950 text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-lg">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm sm:text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                        {project.shortDesc || project.description}
                      </p>
                    </div>

                    <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <span className="truncate max-w-[160px] sm:max-w-[200px]">
                        მოცულობა:{" "}
                        <strong className="text-stone-800 dark:text-stone-200">{project.scope}</strong>
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">
                        დეტალები →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CONSULTATION BANNER (Expanded Widescreen Layout) */}
      <section className="bg-[#f5f3ee] dark:bg-stone-950 py-16 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="bg-stone-800 text-white dark:bg-stone-900 border border-stone-700/80 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-xl">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
                ინდივიდუალური შეკვეთა
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                გაქვთ არასტანდარტული პროექტი?
              </h3>
              <p className="text-stone-300 text-sm mt-2 leading-relaxed">
                დაგვიტოვეთ თქვენი საკონტაქტო ნომერი. ჩვენი ინჟინერი გაეცნობა
                თქვენს მოთხოვნებს და 24 საათში მოგიმზადებთ ზუსტ ხარჯთაღრიცხვას.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              {submitted ? (
                <div className="p-4 bg-stone-700/80 border border-stone-600 rounded-xl flex items-center gap-3 text-stone-100 text-sm">
                  <Check className="w-5 h-5 flex-shrink-0 text-amber-400" />
                  <span>მადლობა! მოთხოვნა მიღებულია, მალე დაგიკავშირდებით.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleQuickConsult}
                  className="flex flex-col sm:flex-row items-center gap-3 w-full"
                >
                  <input
                    required
                    placeholder="თქვენი სახელი"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-stone-400 w-full sm:w-44"
                  />
                  <input
                    required
                    placeholder="ტელეფონი"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-stone-400 w-full sm:w-48"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-stone-100 text-stone-900 font-bold px-6 py-3 rounded-xl text-sm transition shadow-md whitespace-nowrap w-full sm:w-auto"
                  >
                    კონსულტაცია
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
