import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CompareProvider } from "./context/CompareContext";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Portfolio from "./pages/Portfolio";
import ProjectDetails from "./pages/ProjectDetails";
import Compare from "./pages/Compare";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <FavoritesProvider>
          <CompareProvider>
            <BrowserRouter>
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
            </BrowserRouter>
          </CompareProvider>
        </FavoritesProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
