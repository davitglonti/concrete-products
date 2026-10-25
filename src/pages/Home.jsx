import React, { useState, useEffect, useRef } from "react";
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
  Calculator,
  Award,
  Building2,
  Clock,
  Calendar,
} from "lucide-react";

export default function Home() {
  const { products, projects, categories, addInquiry } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Lighthouse 100 Optimization: Only mount slide 0 on initial load to avoid downloading 3 hidden carousel images (saves 203 KiB)
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0]));

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

  // Track slides that need rendering as user navigates
  useEffect(() => {
    setLoadedSlides((prev) => {
      if (prev.has(currentSlide)) return prev;
      const next = new Set(prev);
      next.add(currentSlide);
      return next;
    });
  }, [currentSlide]);

  // Preload slide 1 gently after 2.5s once initial LCP is recorded
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedSlides((prev) => new Set([...prev, 1]));
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Touch swipe gesture support for mobile carousel
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

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
  const latestProjects = [...projects].slice(0, 3);
  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="flex flex-col w-full bg-[#fbfbf9] dark:bg-stone-950 transition-colors duration-200">
      {/* 1. CLASSIC FULL-BLEED ARCHITECTURAL HERO CAROUSEL (Simple, Beautiful & Centered) */}
      <section
        className="relative w-full h-[85vh] min-h-[560px] max-h-[780px] lg:h-[82vh] overflow-hidden bg-stone-950 flex flex-col justify-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full-bleed background images with crossfade & gentle Ken Burns zoom */}
        {HERO_SLIDES.map((item, index) => {
          const isLoaded = loadedSlides.has(index);
          const isActive = index === currentSlide;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isActive ? "opacity-100 z-1" : "opacity-0 pointer-events-none z-0"
              }`}
            >
              {isLoaded ? (
                <img
                  src={item.image}
                  srcSet={`
                    ${item.image.replace("w=1280", "w=640&q=75")} 640w,
                    ${item.image} 1280w
                  `}
                  sizes="(max-width: 640px) 100vw, 1280px"
                  alt={item.titleMain}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding={index === 0 ? "sync" : "async"}
                  className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
              ) : (
                <div className="w-full h-full bg-stone-950" />
              )}
              {/* Natural cinematic vignette: ensures pure text contrast on the left without drowning the photo */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent sm:from-black/80 sm:via-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>
          );
        })}

        {/* Content Container (Lifted higher up, vertically centered) */}
        <div className="relative z-10 max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 w-full py-12">
          <div className="max-w-2xl lg:max-w-3xl">

            {/* Clean Tag */}
            <span className="inline-block text-amber-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-2 sm:mb-3 drop-shadow">
              {slide.tag}
            </span>

            {/* Grand Headline: Bold Title + Amber Highlight */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-lg">
              {slide.titleMain} <br />
              <span className="text-amber-400 drop-shadow">
                {slide.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-stone-200 text-sm sm:text-base lg:text-lg mt-3 sm:mt-5 max-w-xl leading-relaxed drop-shadow font-normal line-clamp-2 sm:line-clamp-3">
              {slide.subtitle}
            </p>

            {/* Action Buttons Row */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to={slide.categoryLink}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-xl shadow-amber-500/25 transition hover:scale-105 active:scale-95"
              >
                <span>{slide.buttonText}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                to="/portfolio"
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl backdrop-blur-md border border-white/25 text-xs sm:text-sm transition hover:scale-105 active:scale-95"
              >
                შესრულებული სამუშაოები
              </Link>
            </div>

          </div>
        </div>

        {/* Floating Left Arrow (Desktop / Tablet) */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-xl hidden sm:flex"
          aria-label="Previous slide"
          title="წინა"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Floating Right Arrow (Desktop / Tablet) */}
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-xl hidden sm:flex"
          aria-label="Next slide"
          title="შემდეგი"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Clean Minimalist Dots at Bottom Center */}
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`სლაიდი ${idx + 1}`}
              className="p-1 flex items-center justify-center focus:outline-none"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 block ${
                  idx === currentSlide
                    ? "w-8 bg-amber-400 shadow-md shadow-amber-400/50"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES SECTION (Desktop Carousel Slider + Mobile Horizontal Swiper) */}
      <section className="bg-[#f5f3ee] dark:bg-stone-900/40 py-10 sm:py-16 lg:py-20 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
            <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              კატეგორიები
            </h2>

            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white text-xs sm:text-sm font-semibold transition shrink-0"
            >
              <span className="sm:hidden">სრული კატალოგი</span>
              <span className="hidden sm:inline">სრული კატალოგის ნახვა</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500" />
            </Link>
          </div>

          {/* Desktop Slider Track: exactly 4 cards fit on screen, 5th+ slides smoothly! */}
          <div
            className="hidden sm:flex overflow-x-auto no-scrollbar gap-6 xl:gap-8 pb-3 pt-1 scroll-smooth snap-x snap-mandatory"
          >
            {(categories && categories.length > 0 ? categories : CATEGORIES).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group flex-shrink-0 snap-start w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] xl:w-[calc((100%-3*2rem)/4)] bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                  <img
                    src={cat.image}
                    srcSet={
                      cat.image.includes("w=800")
                        ? `${cat.image.replace("w=800", "w=400&q=75")} 400w, ${cat.image} 800w`
                        : undefined
                    }
                    sizes="(max-width: 640px) 120px, (max-width: 1024px) 300px, 400px"
                    alt={cat.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {cat.badge && (
                    <span className="absolute top-3.5 left-3.5 bg-stone-800/90 dark:bg-stone-950/85 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-lg border border-stone-700/60 shadow-sm truncate max-w-[80%]">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition line-clamp-1">
                      {cat.title}
                    </h3>
                    {cat.description && (
                      <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:translate-x-1 transition-transform">
                    <span>დათვალიერება</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Horizontal Swiper (Visible only on Mobile < sm, 3-4 visible) */}
          <div className="flex sm:hidden overflow-x-auto no-scrollbar gap-2.5 pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
            {(categories && categories.length > 0 ? categories : CATEGORIES).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group flex-shrink-0 snap-start w-[27vw] min-w-[96px] max-w-[125px] bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                  <img
                    src={cat.image.includes("w=800") ? cat.image.replace("w=800", "w=200&q=70") : cat.image}
                    alt={cat.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  {cat.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-stone-900/85 backdrop-blur text-white text-[8px] font-bold px-1.5 py-0.5 rounded border border-stone-700/50 shadow-sm truncate max-w-[85%]">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <div className="p-2 flex-grow flex flex-col justify-center">
                  <h3 className="text-[11px] font-bold text-stone-900 dark:text-white line-clamp-2 leading-tight text-center">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Original Desktop Grid + Mobile Horizontal Swiper) */}
      <section className="bg-white dark:bg-stone-950 py-10 sm:py-16 lg:py-20 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
            <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              გამორჩეული პროდუქცია
            </h2>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white text-xs sm:text-sm font-semibold transition shrink-0"
            >
              <span className="sm:hidden">სრული კატალოგი</span>
              <span className="hidden sm:inline">სრული კატალოგის ნახვა</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500" />
            </Link>
          </div>

          {/* Desktop Grid (Original Layout — Hidden on Mobile) */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Mobile Horizontal Swiper (Visible only on Mobile < sm) */}
          <div className="flex sm:hidden overflow-x-auto no-scrollbar gap-2.5 pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="snap-start flex-shrink-0 w-[48vw] min-w-[165px] max-w-[210px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE OUR CONCRETE? (Original Desktop Grid + Mobile Horizontal Swiper) */}
      <section className="bg-[#f5f3ee] dark:bg-stone-900/60 py-16 lg:py-24 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-widest block">
              საწარმოო სტანდარტი
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white mt-2">
              რატომ ირჩევენ ჩვენს არქიტექტურულ ბეტონს?
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm lg:text-base mt-3 leading-relaxed">
              თითოეული ნაკეთობა გადის ვიბროჩამოსხმისა და თერმული გამოშრობის სრულ ტექნოლოგიურ ციკლს.
            </p>
          </div>

          {/* Desktop Grid (Original Layout — Hidden on Mobile) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-5 shadow-sm">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                ყინვაგამძლეობა F300
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                სპეციალური ჰიდროფობიური დანამატები გამორიცხავს წყლის შეწოვას და ბზარების გაჩენას მკაცრ ზამთარშიც.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-5 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                მაღალი სიმტკიცე (M500)
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                ბაზალტისა და პოლიპროპილენის ფიბრო-ბოჭკოთი არმირებული სტრუქტურა უძლებს მაღალ სტატიკურ და დინამიკურ დატვირთვას.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-5 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                მდგრადი პიგმენტაცია
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                ვიყენებთ გერმანულ (Bayferrox) მინერალურ პიგმენტებს, რომლებიც სრულ მასაშია შერეული და მზეზე არ ხუნდება.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-5 shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                ინდივიდუალური ყალიბები
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
                სტანდარტული კატალოგის გარდა, ვამზადებთ არასტანდარტული ზომის საფეხურებსა და საყვავილეებს არქიტექტორის ნახაზით.
              </p>
            </div>
          </div>

          {/* Mobile Horizontal Swiper (Visible only on Mobile < md) */}
          <div className="flex md:hidden overflow-x-auto no-scrollbar gap-3.5 pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
            {/* Feature 1 */}
            <div className="snap-start flex-shrink-0 w-[72vw] min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 shadow-sm">
                  <Snowflake className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                  ყინვაგამძლეობა F300
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                  სპეციალური ჰიდროფობიური დანამატები გამორიცხავს წყლის შეწოვას და ბზარების გაჩენას მკაცრ ზამთარშიც.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="snap-start flex-shrink-0 w-[72vw] min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                  მაღალი სიმტკიცე (M500)
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                  ბაზალტისა და პოლიპროპილენის ფიბრო-ბოჭკოთი არმირებული სტრუქტურა უძლებს მაღალ სტატიკურ და დინამიკურ დატვირთვას.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="snap-start flex-shrink-0 w-[72vw] min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                  მდგრადი პიგმენტაცია
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                  ვიყენებთ გერმანულ (Bayferrox) მინერალურ პიგმენტებს, რომლებიც სრულ მასაშია შერეული და მზეზე არ ხუნდება.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="snap-start flex-shrink-0 w-[72vw] min-w-[240px] max-w-[320px] bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-800 dark:text-stone-100 mb-4 shadow-sm">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
                  ინდივიდუალური ყალიბები
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                  სტანდარტული კატალოგის გარდა, ვამზადებთ არასტანდარტული ზომის საფეხურებსა და საყვავილეებს არქიტექტორის ნახაზით.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. TRUST & PARTNERS SECTION („ჩვენ გვენდობიან“) */}
      <section className="bg-white dark:bg-stone-950 py-12 sm:py-16 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-1.5">
              სანდო პარტნიორობა
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              ჩვენ გვენდობიან წამყვანი დეველოპერები & არქიტექტორები
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
              ჩვენი არქიტექტურული ბეტონის ნაკეთობები ამშვენებს პრემიუმ საცხოვრებელ კომპლექსებს, სასტუმროებსა და კერძო ვილებს.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-10">
            <div className="p-4 sm:p-6 rounded-2xl bg-[#fbfbf9] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-center">
              <span className="text-2xl sm:text-4xl font-black text-stone-950 dark:text-white block font-mono">
                150+
              </span>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1 block">
                დასრულებული ობიექტი
              </span>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#fbfbf9] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-center">
              <span className="text-2xl sm:text-4xl font-black text-stone-950 dark:text-white block font-mono">
                15 000+
              </span>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1 block">
                მ² დაგებული ფილა
              </span>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#fbfbf9] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-center">
              <span className="text-2xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 block font-mono">
                M500 / F300
              </span>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1 block">
                სერტიფიცირებული ბეტონი
              </span>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#fbfbf9] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-center">
              <span className="text-2xl sm:text-4xl font-black text-stone-950 dark:text-white block font-mono">
                10 წელი
              </span>
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 mt-1 block">
                მასალის ოფიციალური გარანტია
              </span>
            </div>
          </div>

          {/* Partner Brands Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: "ARCHI", role: "Development" },
              { name: "m²", role: "Real Estate" },
              { name: "SILK", role: "Development" },
              { name: "ALLIANCE", role: "Group" },
              { name: "ROOMS", role: "Hotels & Resorts" },
              { name: "TBILISI HILLS", role: "Golf & Villas" },
              { name: "RADISSON", role: "BLU Collection" },
              { name: "DOMUS", role: "Architectural" },
            ].map((partner) => (
              <div
                key={partner.name}
                className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 flex flex-col items-center justify-center text-center transition-all duration-200 hover:border-stone-400 dark:hover:border-stone-700 hover:scale-102"
              >
                <span className="text-xs sm:text-sm font-black tracking-widest text-stone-800 dark:text-stone-200">
                  {partner.name}
                </span>
                <span className="text-[9px] text-stone-400 uppercase tracking-wider mt-0.5 font-medium">
                  {partner.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO / COMPLETED PROJECTS (Latest 3 Projects) */}
      <section className="bg-white dark:bg-stone-950 py-10 sm:py-16 lg:py-20 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between gap-2 mb-4 sm:mb-8">
            <div>
              <span className="text-stone-400 dark:text-stone-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest block mb-0.5">
                პორტფოლიო
              </span>
              <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
                შესრულებული სამუშაოები
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white text-xs sm:text-sm font-semibold transition shrink-0"
            >
              <span className="sm:hidden">ყველა პროექტი</span>
              <span className="hidden sm:inline">ყველა პროექტის ნახვა</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500" />
            </Link>
          </div>

          {/* Desktop Grid (Original Layout — Hidden on Mobile) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {latestProjects.map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.id}`}
                className="group bg-[#fbfbf9] dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-stone-100 dark:bg-stone-800">
                  <img
                    src={project.images?.[0] || project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Location & Year Badges */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="bg-white/90 dark:bg-stone-950/85 backdrop-blur text-stone-900 dark:text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-stone-200 dark:border-stone-800 shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      {project.location}
                    </span>
                    <span className="bg-stone-800 text-white dark:bg-white dark:text-stone-950 text-xs font-bold px-2 py-1 rounded-lg">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                      {project.shortDesc || project.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span className="truncate max-w-[200px]">
                      მოცულობა:{" "}
                      <strong className="text-stone-800 dark:text-stone-200">{project.scope}</strong>
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">
                      დეტალები →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Horizontal Swiper (Visible only on Mobile < md, 2 cards visible!) */}
          <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2.5 pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory scroll-px-4">
            {latestProjects.map((project) => (
              <div
                key={project.id}
                className="snap-start flex-shrink-0 w-[48vw] min-w-[165px] max-w-[220px] flex flex-col"
              >
                <Link
                  to={`/portfolio/${project.id}`}
                  className="group bg-[#fbfbf9] dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="aspect-[4/3] overflow-hidden relative bg-stone-100 dark:bg-stone-800">
                    <img
                      src={project.images?.[0] || project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 max-w-[85%]">
                      <span className="bg-black/75 backdrop-blur text-white text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-sm truncate">
                        <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </span>
                      <span className="bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition line-clamp-2 leading-snug min-h-[2rem]">
                        {project.title}
                      </h3>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
                      <span className="truncate max-w-[95px]">
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

      {/* 5.5. CALCULATOR PROMO BANNER */}
      <section className="bg-[#f5f3ee] dark:bg-stone-900/40 py-12 sm:py-16 border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-stone-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Background architectural glow */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-amber-500/30">
                <Calculator className="w-3.5 h-3.5" />
                <span>ინტერაქტიული ხელსაწყო</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                დაითვალეთ თქვენი კიბის ან ეზოს ზუსტი ბიუჯეტი
              </h2>
              <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed">
                მიუთითეთ საფეხურების რაოდენობა ან ეზოს ფართობი და ჩვენი ონლაინ კალკულატორი მყისიერად დაგიანგარიშებთ საჭირო ერთეულებს, საერთო წონასა და სავარაუდო ხარჯთაღრიცხვას.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-400" /> L-საფეხურებისა და ფილების გათვლა
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-400" /> წონის & ბიუჯეტის შეფასება
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-400" /> 1-კლიკით ოფიციალური შეთავაზება
                </span>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition-all shadow-xl hover:scale-105"
              >
                <Calculator className="w-5 h-5" />
                <span>კალკულატორის გახსნა →</span>
              </Link>
            </div>
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
