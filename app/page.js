"use client";

import BackgroundSlider from "./components/BackgroundSlider";
import TripPlannerForm from "./components/TripPlannerForm";
import { useLanguage } from "./context/LanguageContext";
import { useSession } from "next-auth/react";

export default function Home() {
  const { t } = useLanguage();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen text-base-content font-sans">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-12 lg:pb-28 overflow-hidden shadow-2xl">
        <BackgroundSlider />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {session?.user && (
            <p className="text-3xl md:text-4xl text-white/90 mb-4 hover:scale-105 transition-transform duration-200 cursor-default inline-block" style={{ fontFamily: 'var(--font-pacifico), cursive' }}>
              Hello, <span className="text-primary capitalize">{session.user.name?.split(' ')[0] || 'Traveler'}</span>!
            </p>
          )}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 hover:scale-105 transition-transform duration-200 cursor-default">
            {t('heroTitle').split("Starts")[0]} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t('heroTitle').split("Starts")[1] || "Starts Here"}
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
