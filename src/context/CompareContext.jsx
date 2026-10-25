import React, { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareIds, setCompareIds] = useState(() => {
    try {
      const saved = localStorage.getItem("monolith_compare");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("monolith_compare", JSON.stringify(compareIds));
    } catch (e) {
      console.warn("Could not save compare items:", e);
    }
  }, [compareIds]);

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const toggleCompare = (productId) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showNotice("შედარებისთვის შესაძლებელია მაქსიმუმ 4 პროდუქტის არჩევა.");
        return prev;
      }
      return [...prev, productId];
    });
  };

  const addToCompare = (productId) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 4) {
        showNotice("შედარებისთვის შესაძლებელია მაქსიმუმ 4 პროდუქტის არჩევა.");
        return prev;
      }
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId) => {
    setCompareIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const isInCompare = (productId) => compareIds.includes(productId);

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        toggleCompare,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        count: compareIds.length,
        isCompareModalOpen,
        setIsCompareModalOpen,
        notice,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
