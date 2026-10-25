import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { MapPin, ArrowRight, Image as ImageIcon } from "lucide-react";

export default function Portfolio() {
  const { projects } = useData();

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen pt-4 sm:pt-6 pb-20 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="mb-8 sm:mb-10">
          <span className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-widest block">
            პორტფოლიო & ქეისები
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mt-1 tracking-tight">
            შესრულებული სამუშაოები & პროექტები
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-2 max-w-2xl leading-relaxed">
            დაათვალიერეთ ჩვენი მონოლითური საფეხურებით, დიდფორმატიანი ფილებითა და არქიტექტურული საყვავილეებით მოწყობილი ობიექტები და გაეცანით დეტალებს, თუ რა და როგორ გაკეთდა.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.id}`}
              className="group bg-white dark:bg-[#121211] rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-2xl hover:border-stone-400 dark:hover:border-stone-700 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden relative bg-stone-100 dark:bg-stone-900">
                <img
                  src={project.images?.[0] || project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="bg-white/90 dark:bg-stone-950/85 backdrop-blur text-stone-900 dark:text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-stone-200 dark:border-stone-800 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    {project.location}
                  </span>
                  <span className="bg-stone-800 text-white dark:bg-white dark:text-stone-950 text-xs font-bold px-2.5 py-1.5 rounded-lg">
                    {project.year}
                  </span>
                </div>

                {project.images && project.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow">
                    <ImageIcon className="w-3 h-3 text-stone-300" />
                    <span>{project.images.length} ფოტო</span>
                  </span>
                )}
              </div>

              <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition flex items-center justify-between gap-2">
                    <span>{project.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-600 dark:text-amber-400 shrink-0" />
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2.5 line-clamp-3 leading-relaxed">
                    {project.shortDesc || project.description}
                  </p>

                  {project.productsUsed && project.productsUsed.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.productsUsed.map((p, idx) => (
                        <span
                          key={idx}
                          className="bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 text-[11px] px-2.5 py-1 rounded-md font-medium"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="truncate max-w-[200px]">
                    მოცულობა: <strong className="text-stone-900 dark:text-white">{project.scope}</strong>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 flex items-center gap-1 group-hover:underline">
                    დეტალები →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
