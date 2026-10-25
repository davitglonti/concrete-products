import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/blogData";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function BlogPost() {
  const { id } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === id || p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!post) {
    return (
      <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen py-20 text-center transition-colors duration-200">
        <p className="text-xl text-stone-600 dark:text-stone-300 font-bold">სტატია ვერ მოიძებნა</p>
        <Link
          to="/blog"
          className="text-stone-900 dark:text-white font-semibold mt-4 inline-block hover:underline"
        >
          ← ბლოგში დაბრუნება
        </Link>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("სტატიის ბმული დაკოპირებულია!");
  };

  return (
    <div className="bg-[#fbfbf9] dark:bg-stone-950 min-h-screen py-8 sm:py-14 transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Top Breadcrumb & Back */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-semibold transition bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200/80 dark:border-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> ბლოგში დაბრუნება
          </Link>

          <button
            onClick={handleCopyLink}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white font-semibold transition bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200/80 dark:border-stone-800"
            title="ბმულის კოპირება"
          >
            <Share2 className="w-3.5 h-3.5" /> გაზიარება
          </button>
        </div>

        {/* Article Container */}
        <article className="max-w-4xl mx-auto bg-white dark:bg-[#121211] p-6 sm:p-10 lg:p-12 rounded-3xl border border-stone-200/90 dark:border-stone-800/90 shadow-xl shadow-stone-900/5">
          
          {/* Category & Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                {post.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                {post.date}
              </span>
              <span>•</span>
              <span>{post.author}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          {/* Hero Image */}
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 border border-stone-200/80 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
            <img
              src={post.image}
              alt={post.title}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="space-y-6 text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
            {post.content.map((block, idx) => {
              if (block.type === "paragraph") {
                return (
                  <p key={idx} className="leading-relaxed">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "heading") {
                return (
                  <h2
                    key={idx}
                    className="text-lg sm:text-2xl font-black text-stone-950 dark:text-white pt-4 pb-1 border-b border-stone-200/80 dark:border-stone-800"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={idx}
                    className="p-5 sm:p-6 my-6 rounded-2xl bg-[#f8f6f0] dark:bg-stone-900 border-l-4 border-amber-500 italic text-stone-800 dark:text-stone-200 text-sm sm:text-base shadow-sm"
                  >
                    „{block.text}“
                  </blockquote>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={idx} className="space-y-2.5 my-4 pl-2">
                    {block.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-stone-400 mr-1" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 px-3 py-1 rounded-lg border border-stone-200 dark:border-stone-800"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Conversion Callout Banner */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white">
                გეგმავთ კიბის ან ეზოს მოპირკეთებას?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                გამოიყენეთ ჩვენი ონლაინ კალკულატორი ან გაეცანით მონოლითური პროდუქციის სრულ კატალოგს.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition shadow-md"
              >
                <Calculator className="w-4 h-4" />
                <span>კალკულატორი</span>
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold text-xs hover:bg-stone-800 dark:hover:bg-stone-100 transition"
              >
                <span>კატალოგი</span>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mb-6">
              სხვა საინტერესო სტატიები
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:shadow-lg transition flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white group-hover:text-amber-600 transition line-clamp-2">
                      {rel.title}
                    </h3>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-3 flex items-center gap-1">
                      კითხვა →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
