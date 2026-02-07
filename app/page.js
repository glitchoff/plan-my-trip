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
  const [profession, setProfession] = useState("none");
  const [results, setResults] = useState(null);

  const calculateDiscount = (price) => {
    if (profession === "none") return price;
    const discountMap = {
      student: 0.15,
      military: 0.20,
      senior: 0.10,
    };
    return Math.floor(price * (1 - (discountMap[profession] || 0)));
  };

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
                    onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
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

      {/* Discount Section */}
      <section className="py-10 bg-base-200/50 backdrop-blur-md border-y border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">{t('discounts')}</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {["none", "student", "military", "senior"].map((p) => (
              <button
                key={p}
                onClick={() => setProfession(p)}
                className={`px-6 py-2 rounded-full capitalize font-semibold hover-lift transition-all ${profession === p
                  ? "btn btn-primary shadow-lg"
                  : "btn btn-ghost bg-base-100 text-base-content hover:bg-base-200"
                  }`}
              >
                {t(p === "none" ? "generalPublic" : p)}
              </button>
            ))}
          </div>
          {profession !== "none" && (
            <p className="mt-4 text-success font-medium animate-bounce">
              {t('unlockDiscount')}
            </p>
          )}
        </div>
      </section>

      {/* Results Section */}
      {results && (
        <section id="results" className="py-20 bg-base-100/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-base-content sm:text-4xl">
                Trip Options: {source} to {destination}
              </h2>
              <p className="mt-4 text-lg text-base-content/70">
                Estimated distance: <span className="font-semibold text-primary">{results.distance} km</span>
              </p>
            </div>

            {/* Transport Costs */}
            <div className="mb-20">
              <h3 className="text-2xl font-bold text-base-content mb-8">Traveling There</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.costs.map((mode) => (
                  <div key={mode.id} className="card bg-base-100 border border-base-200 hover:border-primary hover-lift shadow-sm p-6">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">
                      {mode.icon}
                    </div>
                    <h4 className="text-xl font-bold text-base-content">{mode.name}</h4>
                    <p className="text-base-content/60 text-sm mb-4">
                      Approx. {Math.floor(mode.duration / 60)}h {mode.duration % 60}m
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-base-content/50 uppercase font-semibold">Estimate</span>
                        <div className="text-2xl font-bold text-primary">₹{mode.cost}</div>
                      </div>
                      <button className="btn btn-link btn-sm text-primary no-underline hover:underline">
                        Book &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Recommendations */}
            <div>
              <h3 className="text-2xl font-bold text-base-content mb-8">Where to Stay</h3>
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
                    <div className="inline-block bg-warning text-warning-content text-xs font-bold px-3 py-1 rounded-full mb-3 self-start shadow-lg">
                      {t('topRated')}
                    </div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-3xl font-bold mb-2">{results.hotels.best.name}</h4>
                      <button onClick={() => addToWishlist(results.hotels.best)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors">
                        ❤️
                      </button>
                    </div>

                    <p className="text-white/70 mb-4 flex items-center gap-2">
                      <span className="text-warning">★★★★★</span> {results.hotels.best.rating}/5 (1,234 reviews)
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="block text-sm text-white/70">Starting from</span>
                        <div className="flex items-baseline gap-2">
                          {profession !== "none" && (
                            <span className="text-lg text-white/50 line-through">₹{results.hotels.best.price}</span>
                          )}
                          <span className="text-2xl font-bold">₹{calculateDiscount(results.hotels.best.price)}<span className="text-base font-normal text-white/70">/night</span></span>
                        </div>
                      </div>
                      <button className="btn btn-neutral px-6 py-3 rounded-xl font-bold">
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
                    <div className="inline-block bg-success text-success-content text-xs font-bold px-3 py-1 rounded-full mb-3 self-start shadow-lg">
                      {t('bestValue')}
                    </div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-3xl font-bold mb-2">{results.hotels.cheapest.name}</h4>
                      <button onClick={() => addToWishlist(results.hotels.cheapest)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors">
                        ❤️
                      </button>
                    </div>
                    <p className="text-white/70 mb-4 flex items-center gap-2">
                      <span className="text-warning">★★★★☆</span> {results.hotels.cheapest.rating}/5 (856 reviews)
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="block text-sm text-white/70">Starting from</span>
                        <div className="flex items-baseline gap-2">
                          {profession !== "none" && (
                            <span className="text-lg text-white/50 line-through">₹{results.hotels.cheapest.price}</span>
                          )}
                          <span className="text-2xl font-bold">₹{calculateDiscount(results.hotels.cheapest.price)}<span className="text-base font-normal text-white/70">/night</span></span>
                        </div>
                      </div>
                      <button className="btn btn-neutral px-6 py-3 rounded-xl font-bold">
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
      <footer className="bg-base-200/80 backdrop-blur-md border-t border-base-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="font-bold text-base-content mb-4">Company</h5>
              <ul className="space-y-2 text-base-content/70">
                <li><a href="#" className="hover:text-primary">{t('about')}</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Press</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-base-content mb-4">{t('support')}</h5>
              <ul className="space-y-2 text-base-content/70">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-base-300 text-center text-base-content/50">
            &copy; {new Date().getFullYear()} PlanMyTrip. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}


