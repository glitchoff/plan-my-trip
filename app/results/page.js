"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

// Mock Data (Moved from Home)
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

function ResultsContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [profession, setProfession] = useState(searchParams.get("profession") || "none");

    const source = searchParams.get("source");
    const destination = searchParams.get("destination");
    const travelDate = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "1");

    useEffect(() => {
        if (!source || !destination) return;

        // Simulate API call
        const timer = setTimeout(() => {
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

        return () => clearTimeout(timer);
    }, [source, destination]);

    const calculateDiscount = (price) => {
        switch (profession) {
            case "student": return Math.round(price * 0.85);
            case "military": return Math.round(price * 0.80);
            case "senior": return Math.round(price * 0.90);
            default: return price;
        }
    };

    const addToWishlist = (item) => {
        alert(`Added ${item.name} to wishlist!`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin text-4xl mb-4">🌍</div>
                <h2 className="text-2xl font-bold text-gray-700">Finding the best deals for you...</h2>
                <p className="text-gray-500">Searching flights, trains, and hotels</p>
            </div>
        );
    }

    if (!results) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-black">
                            Trip Options: {source} to {destination}
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Estimated distance: <span className="font-semibold text-blue-600">{results.distance} km</span>
                            <span className="mx-2">•</span>
                            Date: <span className="font-semibold text-blue-600">{travelDate}</span>
                            <span className="mx-2">•</span>
                            Duration: <span className="font-semibold text-blue-600">{duration} Day{duration > 1 ? 's' : ''}</span>
                        </p>
                    </div>
                </div>

                {/* Discount Toggle */}
                <section className="mb-12 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{t('discounts')}</h2>
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
                </section>

                {/* Transport Costs */}
                <div className="mb-20">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Traveling There</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.costs.map((mode) => (
                            <div key={mode.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover-lift group cursor-pointer shadow-sm">
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
                        <div className="relative card-zoom shadow-2xl group hover-lift rounded-2xl overflow-hidden">
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
                        <div className="relative card-zoom shadow-2xl group hover-lift rounded-2xl overflow-hidden">
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
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
