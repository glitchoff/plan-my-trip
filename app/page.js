"use client";

import { useState } from "react";
import Image from "next/image";
import BackgroundSlider from "./components/BackgroundSlider";
import { useLanguage } from "./context/LanguageContext";

// Mock Data
const TRANSPORT_MODES = [
  { id: "flight", name: "Flight", icon: "✈️", baseRate: 12, speed: 800 }, // ₹/km, km/h
  { id: "train", name: "Train", icon: "🚆", baseRate: 2, speed: 120 },
  { id: "bus", name: "Bus", icon: "🚌", baseRate: 1.5, speed: 80 },
  { id: "cab", name: "Cab", icon: "🚖", baseRate: 10, speed: 60 },
];

const MOCK_HOTELS = {
  best: {
    name: "Grand Luxury Plaza",
    rating: 4.8,
    price: 15000,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
  },
  cheapest: {
    name: "Cozy Budget Inn",
    rating: 4.2,
    price: 2500,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
  },
};

export default function Home() {
  const { t } = useLanguage();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlanTrip = (e) => {
    e.preventDefault();
    if (!source || !destination) return;

    setLoading(true);
    // Simulate API call/processing
    setTimeout(() => {
      // Mock distance calculation (random for demo)
      const distance = Math.floor(Math.random() * 500) + 100; // 100-600km

      const tripCosts = TRANSPORT_MODES.map((mode) => ({
        ...mode,
        cost: Math.round(distance * mode.baseRate),
        duration: Math.round((distance / mode.speed) * 60), // minutes
      }));

      setResults({
        distance,
        costs: tripCosts,
        hotels: MOCK_HOTELS,
      });
      setLoading(false);
    }, 1500);
  };

  // Discount Logic
  const [profession, setProfession] = useState("none");
  const calculateDiscount = (price) => {
    switch (profession) {
      case "student": return Math.round(price * 0.85); // 15% off
      case "military": return Math.round(price * 0.80); // 20% off
      case "senior": return Math.round(price * 0.90); // 10% off
      default: return price;
    }
  };

  const addToWishlist = (item) => {
    alert(`Added ${item.name} to wishlist!`);
  };

  return (
    <div className="min-h-screen text-gray-900 font-sans">
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
            <form onSubmit={handlePlanTrip} className="flex flex-col md:flex-row gap-4 items-center">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover-lift hover-glow transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? t('planning') : t('planTrip')}
              </button>
            </form>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-blue-50 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-teal-50 blur-3xl opacity-50"></div>
      </section>

      {/* Discount Section */}
      <section className="py-10 bg-blue-50/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('discounts')}</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {["none", "student", "military", "senior"].map((p) => (
              <button
                key={p}
                onClick={() => setProfession(p)}
                className={`px-6 py-2 rounded-full capitalize font-semibold hover-lift transition-all ${profession === p
                  ? "bg-blue-600 text-white shadow-lg hover-glow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {t(p === "none" ? "generalPublic" : p)}
              </button>
            ))}
          </div>
          {profession !== "none" && (
            <p className="mt-4 text-green-600 font-medium animate-bounce">
              {t('unlockDiscount')}
            </p>
          )}
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section id="results" className="py-20 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Trip Options: {source} to {destination}
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Estimated distance: <span className="font-semibold text-blue-600">{results.distance} km</span>
              </p>
            </div>

            {/* Transport Costs */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Traveling There</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.costs.map((mode) => (
                  <div key={mode.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover-lift group cursor-pointer bg-white shadow-sm">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">
                      {mode.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{mode.name}</h4>
                    <p className="text-gray-500 text-sm mb-4">
                      Approx. {Math.floor(mode.duration / 60)}h {mode.duration % 60}m
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-gray-400 uppercase font-semibold">Estimate</span>
                        <div className="text-2xl font-bold text-blue-600">₹{mode.cost}</div>
                      </div>
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                        Book &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Recommendations */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Where to Stay</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Best Hotel */}
                <div className="relative card-zoom shadow-2xl group hover-lift">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
                  <img
                    src={results.hotels.best.image}
                    alt={results.hotels.best.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-20 p-8 h-full flex flex-col justify-end text-white">
                    <div className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-3 self-start shadow-lg">
                      {t('topRated')}
                    </div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-3xl font-bold mb-2">{results.hotels.best.name}</h4>
                      <button onClick={() => addToWishlist(results.hotels.best)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors">
                        ❤️
                      </button>
                    </div>

                    <p className="text-gray-200 mb-4 flex items-center gap-2">
                      <span className="text-yellow-400">★★★★★</span> {results.hotels.best.rating}/5 (1,234 reviews)
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="block text-sm text-gray-300">Starting from</span>
                        <div className="flex items-baseline gap-2">
                          {profession !== "none" && (
                            <span className="text-lg text-gray-400 line-through">₹{results.hotels.best.price}</span>
                          )}
                          <span className="text-2xl font-bold">₹{calculateDiscount(results.hotels.best.price)}<span className="text-base font-normal text-gray-300">/night</span></span>
                        </div>
                      </div>
                      <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cheapest Hotel */}
                <div className="relative card-zoom shadow-2xl group hover-lift">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
                  <img
                    src={results.hotels.cheapest.image}
                    alt={results.hotels.cheapest.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="relative z-20 p-8 h-full flex flex-col justify-end text-white">
                    <div className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start shadow-lg">
                      {t('bestValue')}
                    </div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-3xl font-bold mb-2">{results.hotels.cheapest.name}</h4>
                      <button onClick={() => addToWishlist(results.hotels.cheapest)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors">
                        ❤️
                      </button>
                    </div>
                    <p className="text-gray-200 mb-4 flex items-center gap-2">
                      <span className="text-yellow-400">★★★★☆</span> {results.hotels.cheapest.rating}/5 (856 reviews)
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="block text-sm text-gray-300">Starting from</span>
                        <div className="flex items-baseline gap-2">
                          {profession !== "none" && (
                            <span className="text-lg text-gray-400 line-through">₹{results.hotels.cheapest.price}</span>
                          )}
                          <span className="text-2xl font-bold">₹{calculateDiscount(results.hotels.cheapest.price)}<span className="text-base font-normal text-gray-300">/night</span></span>
                        </div>
                      </div>
                      <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="font-bold text-gray-900 mb-4">Company</h5>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-blue-600">{t('about')}</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Press</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-gray-900 mb-4">{t('support')}</h5>
              <ul className="space-y-2 text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center text-gray-400">
            &copy; {new Date().getFullYear()} PlanMyTrip. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

