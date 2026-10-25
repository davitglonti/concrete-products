import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CompareModal from "../ui/CompareModal";
import CompareFloatingBar from "../ui/CompareFloatingBar";
import FloatingContactWidget from "../ui/FloatingContactWidget";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CompareModal />
      <CompareFloatingBar />
      <FloatingContactWidget />
    </div>
  );
}
