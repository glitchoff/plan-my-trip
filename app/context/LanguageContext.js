"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [currentLang, setCurrentLang] = useState("en");

    const t = (key) => {
        const langData = translations[currentLang] || translations["en"];
        return langData[key] || key;
    };

    const changeLanguage = (langCode) => {
        setCurrentLang(langCode);
    };

    return (
        <LanguageContext.Provider value={{ currentLang, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
