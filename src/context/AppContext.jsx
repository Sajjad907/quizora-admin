import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "dark";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Subscription state with persistence
  const [subscription, setSubscription] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    
    // If shop is in URL, it's a fresh load/sync from Shopify - use URL params
    if (shop) {
      const newSub = {
        plan: params.get("plan") || "Free",
        status: params.get("status") || "ACTIVE",
        updatedAt: params.get("updatedAt") || Date.now().toString(),
        pricingUrl: params.get("pricingUrl") || "#",
        shop: shop
      };
      localStorage.setItem("quizora-subscription", JSON.stringify(newSub));
      return newSub;
    }

    // Otherwise, try to load from localStorage
    const savedSub = localStorage.getItem("quizora-subscription");
    if (savedSub) {
      try {
        return JSON.parse(savedSub);
      } catch (err) {
        console.error("Failed to parse saved subscription:", err);
      }
    }

    // Final fallback
    return {
      plan: "Free",
      status: "ACTIVE",
      updatedAt: Date.now().toString(),
      pricingUrl: "#",
      shop: ""
    };
  });

  // Apply theme class to html element whenever theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  // Sync subscription to localStorage if updated programmatically
  useEffect(() => {
    if (subscription && subscription.shop) {
      localStorage.setItem("quizora-subscription", JSON.stringify(subscription));
    }
  }, [subscription]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const value = {
    theme,
    toggleTheme,
    isSidebarOpen,
    toggleSidebar,
    subscription,
    setSubscription
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
