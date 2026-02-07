"use client";

import { useState } from "react";
import Image from "next/image";
import BackgroundSlider from "./components/BackgroundSlider";
import { useRouter } from "next/navigation";
import { useLanguage } from "./context/LanguageContext";
import { useSession } from "next-auth/react";

export default function Home() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);


  const handlePlanTrip = (e) => {
    e.preventDefault();
    if (!source || !destination) return;

    setLoading(true);

    // Construct query params
    const params = new URLSearchParams({
      source,
      destination,
      date: travelDate,
      duration: duration.toString(),
    });

    // Navigate to results page
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen text-base-content font-sans">
      {/* Navbar */}


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden shadow-2xl">
        <BackgroundSlider />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {session?.user && (
            <p className="text-lg text-white/80 mb-4 font-medium">
              👋 Hello, <span className="text-primary font-bold">{session.user.name?.split(' ')[0] || 'Traveler'}</span>!
            </p>
          )}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            {t('heroTitle').split("Starts")[0]} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t('heroTitle').split("Starts")[1] || "Starts Here"}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white drop-shadow-md font-medium mb-10">
            {t('heroSubtitle')}
          </p>

          <div className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-xl border border-base-200 p-2 md:p-4">
            <form onSubmit={handlePlanTrip} className="flex flex-col gap-6">
              {/* Row 1: Locations */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    📍
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all"
                    placeholder={t('whereFrom')}
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="hidden md:block text-base-content/30">➜</div>
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    🗺️
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all"
                    placeholder={t('whereTo')}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Date, Duration, Submit */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full" onClick={() => document.getElementById('dateInput').showPicker()}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    📅
                  </div>
                  <input
                    id="dateInput"
                    type="date"
                    className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all cursor-pointer"
                    value={travelDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>
                <div className="relative w-full md:w-32">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    ⏳
                  </div>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all"
                    placeholder="Days"
                    value={duration}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDuration(val === "" ? "" : parseInt(val));
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full md:w-auto px-8 h-14 rounded-xl hover-lift shadow-lg"
                >
                  {loading ? t('planning') : t('planTrip')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50"></div>
      </section>
    </div>
  );
}


