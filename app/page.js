"use client";

import { useState } from "react";
import Image from "next/image";
import BackgroundSlider from "./components/BackgroundSlider";
import { useRouter } from "next/navigation";
import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);


  const addToWishlist = (hotel) => {
    // Implement wishlist functionality or use context
    console.log("Added to wishlist:", hotel);
    // You might want to show a toast or notification here
  };

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
    <div className="min-h-screen text-gray-900 font-sans relative">
      <BackgroundSlider />
      {/* Navbar */}


      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
            {t('heroTitle').split("Starts")[0]} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
              {t('heroTitle').split("Starts")[1] || "Starts Here"}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white drop-shadow-md font-medium mb-10">
            {t('heroSubtitle')}
          </p>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-2 md:p-4">
            <form onSubmit={handlePlanTrip} className="flex flex-col gap-6">
              {/* Row 1: Locations */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    📍
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder={t('whereFrom')}
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="hidden md:block text-gray-300">➜</div>
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    🗺️
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
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
                    className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover-lift hover-glow transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? t('planning') : t('planTrip')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-blue-50 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-teal-50 blur-3xl opacity-50"></div>
      </section>





    </div>
  );
}


