import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem("monolith_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("monolith_favorites", JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn("Could not save favorites:", e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  const removeFavorite = (productId) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearFavorites,
        count: favoriteIds.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
