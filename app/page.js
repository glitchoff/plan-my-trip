"use client";

import { useState, useEffect } from "react";
import BackgroundSlider from "./components/BackgroundSlider";
import TripPlannerForm from "./components/TripPlannerForm";
import { useLanguage } from "./context/LanguageContext";
import { useSession } from "next-auth/react";

// Typewriter Hook with language cycling
function useMultiLangTypewriter(userName, typingSpeed = 80, pauseDuration = 2000) {
  const greetings = [
    `Hello, ${userName}!`,           // English
    `नमस्ते, यात्री!`,                 // Hindi (Traveler)
    `नमस्कार, मित्रा!`,                // Marathi (Friend)
    `നമസ്കാരം, സുഹൃത്തേ!`,           // Malayalam (Friend)
    `Bonjour, Voyageur!`,            // French (Traveler)
    `¡Hola, Viajero!`,               // Spanish (Traveler)
  ];
  
  const [displayedText, setDisplayedText] = useState('');
  const [greetingIndex, setGreetingIndex] = useState(0);
  
  const currentGreeting = greetings[greetingIndex];
  
  useEffect(() => {
    let timeout;
    if (displayedText.length < currentGreeting.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentGreeting.slice(0, displayedText.length + 1));
      }, typingSpeed);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText('');
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
      }, pauseDuration);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, currentGreeting, typingSpeed, pauseDuration, greetings.length]);
  
  return displayedText;
}

export default function Home() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  
  const userName = session?.user?.name?.split(' ')[0] || 'Traveler';
  const displayedGreeting = useMultiLangTypewriter(userName, 80, 2000);

  return (
    <div className="min-h-screen text-base-content font-sans">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-12 lg:pb-28 overflow-hidden shadow-2xl">
        <BackgroundSlider />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {session?.user && (
            <p className="text-3xl md:text-4xl text-white/90 mb-4 hover:scale-105 transition-transform duration-200 cursor-default inline-block" style={{ fontFamily: 'var(--font-pacifico), cursive' }}>
              {displayedGreeting}
              <span className="inline-block w-0.5 h-8 bg-primary ml-1 align-middle animate-pulse"></span>
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 hover:scale-105 transition-transform duration-200 cursor-default drop-shadow-lg">
            {t('heroTitle').split(",")[0]},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-lg" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
              {t('heroTitle').split(",")[1]?.trim() || "Worry Less"}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white drop-shadow-md font-medium mb-10 hover:scale-105 transition-transform duration-200 cursor-default">
            {t('heroSubtitle')}
          </p>

          <TripPlannerForm />
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50"></div>
      </section>
    </div>
  );
}
