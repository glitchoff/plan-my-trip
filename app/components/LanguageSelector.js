"use client";

import { useState } from "react";

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिंदी)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
];

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentLang, changeLanguage } = useLanguage();

    const selectedLang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-base-200 transition-colors text-sm font-medium text-base-content"
            >
                <span>🌐</span>
                <span>{selectedLang.name.split(" ")[0]}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg py-1 ring-1 ring-base-content/10 z-50">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                changeLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-base-content hover:bg-base-200"
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
