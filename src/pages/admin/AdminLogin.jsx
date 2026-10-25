import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const { loginAdmin } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg("გთხოვთ შეავსოთ ელფოსტა და პაროლი.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    const res = await loginAdmin(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.message || "ავტორიზაცია ვერ მოხერხდა.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-white">
      {/* Return to website link */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition bg-stone-900/80 hover:bg-stone-800 border border-stone-800 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>საიტზე დაბრუნება</span>
      </Link>

      <div className="bg-stone-900 border border-stone-800 p-7 sm:p-9 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-80" />

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>MONOLITH</span>
              <span className="text-xs bg-stone-800 text-amber-400 font-mono px-2 py-0.5 rounded">
                /admin
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
              Firebase Authentication სისტემა
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              ადმინისტრატორის ელფოსტა
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="მაგ: admin@monolith.ge"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              პაროლი
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="შეიყვანეთ პაროლი"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1 transition"
                title={showPassword ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-white hover:bg-stone-200 disabled:opacity-50 text-stone-950 font-bold py-3.5 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>მიმდინარეობს შესვლა...</span>
              </>
            ) : (
              <span>ადმინ პანელში შესვლა</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800 text-center">
          <span className="text-[11px] text-stone-500 font-medium">
            დაცულია Google Firebase Authentication სერვისით
          </span>
        </div>
      </div>
    </div>
  );
}
