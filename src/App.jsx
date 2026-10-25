import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CompareProvider } from "./context/CompareContext";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/Home";

// Route-level code splitting for lightning-fast initial page load
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Compare = lazy(() => import("./pages/Compare"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-stone-300 dark:border-stone-700 border-t-amber-500 rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <FavoritesProvider>
          <CompareProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio/:id" element={<ProjectDetails />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CompareProvider>
        </FavoritesProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
