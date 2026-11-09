import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";

/**
 * Route guard component for admin area.
 * Prevents unauthorized access and redirects unauthenticated users to /admin/login.
 */
export default function ProtectedRoute({ children }) {
  const { isAdminAuthenticated, authLoading } = useData();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-stone-800 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-xs text-stone-400 font-mono">ავტორიზაციის შემოწმება...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
