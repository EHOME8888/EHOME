"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict } from "./dictionary";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  // Restore saved choice on load.
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? window.localStorage.getItem("ehome-lang") : null;
    if (saved === "en" || saved === "zh") setLangState(saved);
  }, []);

  // Keep <html lang> accurate for accessibility and font rendering.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    }
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    try {
      window.localStorage.setItem("ehome-lang", l);
    } catch (e) {
      /* storage unavailable — ignore */
    }
  };

  const toggle = () => setLang(lang === "en" ? "zh" : "en");

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t: dict[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
}
