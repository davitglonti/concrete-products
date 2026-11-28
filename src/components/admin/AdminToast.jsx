import React from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

/**
 * Floating bottom-right notification toast for the Admin Panel.
 */
export default function AdminToast({ message, type = "success", onClose }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] max-w-sm px-4 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in ${
        isError
          ? "bg-red-950/95 border-red-500/60 text-red-100 shadow-red-950/50"
          : "bg-emerald-950/95 border-emerald-500/60 text-emerald-100 shadow-emerald-950/50"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          isError ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <CheckCircle2 className="w-5 h-5" />
        )}
      </div>
      <span className="text-xs sm:text-sm font-bold leading-snug">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`p-1 rounded-lg transition shrink-0 ${
            isError
              ? "text-red-300 hover:text-white hover:bg-red-900/50"
              : "text-emerald-300 hover:text-white hover:bg-emerald-900/50"
          }`}
          aria-label="დახურვა"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
