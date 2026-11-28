import React, { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const { loginAdmin, loginWithGoogle, isAdminAuthenticated, authLoading, siteSettings } = useData();
  const brandName = siteSettings?.brandName || "MONOLITH";
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // If already authenticated and not loading, redirect immediately
  if (!authLoading && isAdminAuthenticated) {
    return <Navigate to={from} replace />;
  }

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

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.message || "ავტორიზაცია ვერ მოხერხდა.");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg("");

    const res = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.message || "Google-ით ავტორიზაცია ვერ მოხერხდა.");
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
              <span>{brandName}</span>
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
                placeholder={siteSettings?.contactEmail ? `მაგ: ${siteSettings.contactEmail}` : "მაგ: admin@naketobebi.ge"}
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
                placeholder="••••••••••••"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition"
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 py-3.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-950 font-black rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>მოწმდება...</span>
              </>
            ) : (
              <span>ადმინ პანელში შესვლა</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-stone-900 px-3 text-stone-400 font-medium">ან</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          className="w-full py-3 px-4 bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 disabled:opacity-60 text-white font-bold rounded-xl transition flex items-center justify-center gap-3 cursor-pointer shadow-sm group"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span className="text-sm">Google-ით ავტორიზაცია...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-sm text-stone-200 group-hover:text-white transition-colors">
                Google-ით შესვლა
              </span>
            </>
          )}
        </button>

        {/* Security badge footer */}
        <div className="mt-6 pt-5 border-t border-stone-800/80 text-center">
          <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            დაცული არხი (Firebase Auth 256-bit SSL)
          </p>
        </div>
      </div>
    </div>
  );
}
