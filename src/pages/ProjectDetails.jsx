import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Image as ImageIcon,
  Clock,
  Building,
  ShieldCheck,
  Phone,
  ArrowRight,
  Layers,
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const { projects, products, addInquiry } = useData();
  const project = projects.find((p) => p.id === id);

  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Collect project images (fallback to single image if array not present)
  const images = project
    ? Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : project.image
      ? [project.image]
      : []
    : [];

  const activeImage = images[selectedImageIndex] || images[0] || "";

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  if (!project) {
    return (
      <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen py-20 text-center transition-colors duration-200">
        <p className="text-xl text-stone-600 dark:text-stone-300 font-bold">პროექტი ვერ მოიძებნა</p>
        <Link
          to="/portfolio"
          className="text-stone-900 dark:text-white font-semibold mt-4 inline-block hover:underline text-sm"
        >
          ← პორტფოლიოში დაბრუნება
        </Link>
      </div>
    );
  }

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addInquiry({
      ...form,
      projectName: project.title,
      projectId: project.id,
      source: "Project Details Page",
    });
    setSent(true);
    setForm({ name: "", phone: "", comment: "" });
  };

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen pt-3 sm:pt-5 pb-20 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        
        {/* Luxury Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-1 text-xs">
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-medium overflow-hidden">
            <Link to="/" className="hover:text-stone-900 dark:hover:text-white transition">
              მთავარი
            </Link>
            <span className="text-stone-400 dark:text-stone-600">/</span>
            <Link to="/portfolio" className="hover:text-stone-900 dark:hover:text-white transition">
              შესრულებული სამუშაოები
            </Link>
            <span className="text-stone-400 dark:text-stone-600">/</span>
            <span className="text-stone-900 dark:text-stone-200 font-semibold truncate max-w-[200px] sm:max-w-none">
              {project.title}
            </span>
          </div>

          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-semibold transition shrink-0 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-200/80 dark:border-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> პორტფოლიო
          </Link>
        </div>

        {/* Project Header Studio Card */}
        <div className="bg-white dark:bg-[#121211] p-6 sm:p-8 lg:p-10 rounded-3xl border border-stone-200/90 dark:border-stone-800/90 shadow-xl shadow-stone-900/5 dark:shadow-black/40 mb-8 transition-colors duration-200">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              {project.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              {project.year} წელი
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-stone-600 dark:text-stone-300 mt-3 text-base sm:text-lg max-w-4xl leading-relaxed">
            {project.shortDesc || project.description}
          </p>

          {/* Key Project Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-200/80 dark:border-stone-800/80">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/70 dark:border-stone-800">
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                სამუშაოს მოცულობა
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white mt-0.5 block">
                {project.scope || "მოცულობითი სამუშაო"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/70 dark:border-stone-800">
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                დამკვეთი
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white mt-0.5 block truncate">
                {project.client || "კერძო დამკვეთი"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/70 dark:border-stone-800">
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                შესრულების ვადა
              </span>
              <span className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white mt-0.5 block">
                {project.duration || "25 სამუშაო დღე"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/70 dark:border-stone-800">
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                ბეტონის მარკა
              </span>
              <span className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">
                {project.concreteGrade || "B35 - B45 (F300)"}
              </span>
            </div>
          </div>
        </div>

        {/* Gallery & Execution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: MULTI-IMAGE GALLERY (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 aspect-[16/10] sm:aspect-[16/10] group select-none shadow-md">
              <img
                src={activeImage}
                alt={project.title}
                onClick={() => setIsLightboxOpen(true)}
                className="w-full h-full object-cover cursor-zoom-in transition-all duration-300 group-hover:scale-102"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md transition-all shadow-lg opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md border border-white/10">
                    <ImageIcon className="w-3.5 h-3.5 text-stone-300" />
                    <span>
                      {selectedImageIndex + 1} / {images.length}
                    </span>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md shadow-md transition border border-white/10"
                title="სრულ ეკრანზე ნახვა"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                      selectedImageIndex === idx
                        ? "border-amber-500 ring-2 ring-amber-500/30 scale-105 shadow-md"
                        : "border-stone-200 dark:border-stone-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Products Used in this Project */}
            {project.productsUsed && project.productsUsed.length > 0 && (
              <div className="mt-8 bg-white dark:bg-[#121211] p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-amber-500" />
                  პროექტში გამოყენებული პროდუქცია
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.productsUsed.map((pName, idx) => {
                    const matchedProd = products.find(
                      (p) => p.name.toLowerCase().includes(pName.toLowerCase()) || pName.toLowerCase().includes(p.name.toLowerCase())
                    );
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/70 dark:border-stone-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white block">
                            {pName}
                          </span>
                          <span className="text-[11px] text-stone-500">მონოლითური ბეტონი</span>
                        </div>
                        {matchedProd ? (
                          <Link
                            to={`/products/${matchedProd.id}`}
                            className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline shrink-0 flex items-center gap-1"
                          >
                            კატალოგში <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <Link
                            to="/products"
                            className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white shrink-0"
                          >
                            კატალოგი
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: DETAILED CASE STUDY - "რა და როგორ გაკეთდა" (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* The Challenge & Solution */}
            <div className="bg-white dark:bg-[#121211] p-6 sm:p-7 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                  01. არქიტექტურული გამოწვევა
                </span>
                <h4 className="text-base font-extrabold text-stone-900 dark:text-white mb-2">
                  პროექტის სპეციფიკა & ამოცანა
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {project.challenge ||
                    "ობიექტის ექსტერიერის მოწყობა მოითხოვდა ისეთი მასალების გამოყენებას, რომლებიც გაუძლებდა რთულ კლიმატურ პირობებს, ინტენსიურ ცვეთას და შეინარჩუნებდა მონოლითურ მინიმალიზმს."}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  02. საინჟინრო გადაწყვეტა
                </span>
                <h4 className="text-base font-extrabold text-stone-900 dark:text-white mb-2">
                  როგორ გადაიჭრა საინჟინრო ამოცანა
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {project.solution ||
                    "ქარხნულ პირობებში დამზადდა ინდივიდუალური ლითონის ყალიბები. გამოყენებული იქნა B40/B45 მარკის ფიბრობეტონი გერმანული ჰიდროფობიზატორით და Anti-slip ქვიშაჭავლური დამუშავებით."}
                </p>
              </div>
            </div>

            {/* Step-by-Step Execution Process ("როგორ გაკეთდა") */}
            <div className="bg-white dark:bg-[#121211] p-6 sm:p-7 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
              <h3 className="text-base font-extrabold text-stone-900 dark:text-white mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                შესრულების ეტაპები ("როგორ გაკეთდა")
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
                სამუშაოების ეტაპობრივი მიმდინარეობა ქარხნული წარმოებიდან ობიექტზე ჩაბარებამდე.
              </p>

              <div className="space-y-4">
                {(project.processSteps || [
                  {
                    step: 1,
                    title: "გეოდეზიური აზომვა და საპროექტო ნახაზების მომზადება",
                    desc: "ობიექტის 3D ლაზერული სკანირება და გრუნტის სიმკვრივის შემოწმება.",
                  },
                  {
                    step: 2,
                    title: "ინდივიდუალური ყალიბების დამზადება",
                    desc: "მეტალის ზუსტი ყალიბები მკვეთრი გეომეტრიული წიბოებით.",
                  },
                  {
                    step: 3,
                    title: "მაღალმარკიანი ბეტონის ჩასხმა და ვიბროდაწნეხვა",
                    desc: "B40 ფიბრობეტონი პლასტიფიკატორებითა და ჰიდროფობული დანამატებით.",
                  },
                  {
                    step: 4,
                    title: "მონტაჟი და საექსპლუატაციო ჩაბარება",
                    desc: "ვაკუუმური ამწე მექანიზმით მონტაჟი და ელასტიური ჰერმეტიზაცია.",
                  },
                ]).map((s, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <span className="w-7 h-7 rounded-full bg-stone-900 dark:bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-stone-700">
                      {s.step || idx + 1}
                    </span>
                    <div className="text-xs">
                      <h5 className="font-bold text-stone-900 dark:text-white">{s.title}</h5>
                      <p className="text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Order / Project Quote Form */}
            <div className="bg-gradient-to-br from-[#f8f6f0] to-[#f2eee3] dark:from-[#181816] dark:to-[#121211] p-6 sm:p-7 rounded-3xl border border-stone-300/80 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-black text-stone-950 dark:text-white">
                  გსურთ მსგავსი პროექტი თქვენს ობიექტზე?
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
                გამოგვიგზავნეთ თქვენი საკონტაქტო ნომერი და ჩვენი მთავარი ინჟინერი გაგიწევთ უფასო ხარჯთაღრიცხვასა და კონსულტაციას.
              </p>

              {sent ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>გმადლობთ! თქვენი მოთხოვნა მიღებულია. მალე დაგიკავშირდებით.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <input
                    required
                    placeholder="თქვენი სახელი *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                  />
                  <input
                    required
                    placeholder="ტელეფონის ნომერი *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                  />
                  <textarea
                    placeholder="პროექტის აღწერა ან ლოკაცია (არასავალდებულო)"
                    rows="2"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-950 font-bold py-3 rounded-xl transition text-xs shadow-md"
                  >
                    ინჟინერთან კონსულტაციის მოთხოვნა
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 select-none">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition z-10"
                aria-label="Previous"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition z-10"
                aria-label="Next"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[85vh] flex flex-col items-center">
            <img
              src={activeImage}
              alt={project.title}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            {images.length > 1 && (
              <p className="text-stone-400 text-xs mt-4">
                ფოტო {selectedImageIndex + 1} / {images.length} • {project.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
