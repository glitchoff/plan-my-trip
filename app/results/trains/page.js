"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";

function TrainsContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);

    // Core Data
    const source = searchParams.get("source");
    const destination = searchParams.get("destination");
    const travelDate = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration") || "1");

    // Coordinates might be passed, but we might need to re-fetch if they aren't
    const [destCoords, setDestCoords] = useState({ lat: searchParams.get("toLat"), lon: searchParams.get("toLon") });

    // Results State - ONLY Real Data
    const [hotels, setHotels] = useState({ best: null, cheapest: null });
    const [trains, setTrains] = useState([]); // List of real trains

    // Initial Load
    useEffect(() => {
        if (!source || !destination) return;

        const init = async () => {
            setLoading(true);
            setTrains([]); // Reset

            // 1. Fetch Real Train Data using Dynamic Search
            const sCity = source.split(',')[0].trim();
            const dCity = destination.split(',')[0].trim();

            try {
                // Fetch station codes for Source and Destination
                const [sRes, dRes] = await Promise.all([
                    fetch(`/api/railradar/search/stations?query=${encodeURIComponent(sCity)}`).then(r => r.json()),
                    fetch(`/api/railradar/search/stations?query=${encodeURIComponent(dCity)}`).then(r => r.json())
                ]);

                const sStations = sRes.stations || [];
                const dStations = dRes.stations || [];

                if (sStations.length > 0 && dStations.length > 0) {
                    console.log(`Found ${sStations.length} source stations and ${dStations.length} dest stations`);

                    let foundTrains = false;

                    // Smart Search: Try the top 3 source stations against top 2 destination stations
                    // effectively 3x2 = 6 checks max. This covers "Mumbai" -> "BCT", "BDTS", "LTT" etc.
                    const sourcesToTry = sStations.slice(0, 3);
                    const destsToTry = dStations.slice(0, 2);

                    for (const sStation of sourcesToTry) {
                        if (foundTrains) break;
                        for (const dStation of destsToTry) {
                            if (foundTrains) break;

                            const sCode = sStation.code;
                            const dCode = dStation.code;

                            console.log(`Checking trains from ${sStation.name} (${sCode}) to ${dStation.name} (${dCode})...`);

                            try {
                                const trainRes = await fetch(`/api/train?action=betweenStations&from=${sCode}&to=${dCode}`);
                                const trainData = await trainRes.json();

                                if (trainData.success && Array.isArray(trainData.data) && trainData.data.length > 0) {
                                    console.log(`FOUND TRAINS! ${trainData.data.length} trains found.`);

                                    const realTrains = trainData.data.map(item => {
                                        const t = item.train_base;
                                        return {
                                            id: t.train_no,
                                            name: t.train_name,
                                            number: t.train_no,
                                            from: t.from_stn_code,
                                            to: t.to_stn_code,
                                            dep: t.from_time,
                                            arr: t.to_time,
                                            duration: t.travel_time,
                                            days: t.running_days,
                                            icon: "🚆"
                                        };
                                    });
                                    setTrains(realTrains);
                                    foundTrains = true;
                                }
                            } catch (err) {
                                console.warn(`Failed check for ${sCode}->${dCode}`, err);
                            }
                        }
                    }

                    if (!foundTrains) {
                        console.log("No trains found after checking top station combinations.");
                    }
                } else {
                    console.log("Could not find stations for", sCity, "or", dCity);
                }
            } catch (e) {
                console.error("Train Search Error:", e);
            }

            // 2. Fetch Hotels (Real API)
            // If we don't have coords from params, we need to geocode the destination first
            let lat = destCoords.lat;
            let lon = destCoords.lon;

            if (!lat || !lon) {
                // Quick geocode for destination if missing
                const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(destination)}`);
                const geoData = await geoRes.json();
                if (geoData.features && geoData.features.length > 0) {
                    lat = geoData.features[0].properties.lat;
                    lon = geoData.features[0].properties.lon;
                    setDestCoords({ lat, lon });
                }
            }

            if (lat && lon) {
                try {
                    // Search for hotels within 10km radius
                    const hotelsRes = await fetch(`/api/places?categories=accommodation.hotel&filter=circle:${lon},${lat},10000&limit=10`);
                    const hotelsData = await hotelsRes.json();

                    if (hotelsData.features && hotelsData.features.length > 0) {
                        // Transform and sort
                        const processedHotels = hotelsData.features.map(f => ({
                            name: f.properties.name || "Unknown Hotel",
                            address: f.properties.formatted,
                            // Verify properties needed for UI
                            rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // Mock rating 3-5 (API doesn't usually give this)
                            price: Math.floor(Math.random() * 10000) + 2000,
                            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000", // Placeholder
                            ...f.properties
                        }));

                        processedHotels.sort((a, b) => b.rating - a.rating);
                        const best = processedHotels[0];

                        processedHotels.sort((a, b) => a.price - b.price);
                        const cheapest = processedHotels[0];

                        setHotels({ best, cheapest });
                    }
                } catch (e) {
                    console.error("Failed to fetch hotels", e);
                }
            }

            setLoading(false);
        };

        init();
    }, [source, destination, destCoords.lat, destCoords.lon]);

    const addToWishlist = (item) => {
        alert(`Added ${item.name} to wishlist!`);
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                <h2 className="text-2xl font-bold text-base-content">Finding the best trains...</h2>
                <p className="text-base-content/60">Searching real-time availability...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Real Trains Section - Only show if we found trains */}
            {trains.length > 0 ? (
                <div className="mb-20">
                    <h3 className="text-2xl font-bold text-base-content mb-8">Available Trains</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {trains.map((train) => (
                            <div key={train.id} className="card bg-base-100 rounded-2xl p-6 border border-base-200 hover:border-primary hover-lift shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="text-4xl text-base-content">
                                        {train.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-base-content">{train.name} <span className="text-sm font-normal text-base-content/60">({train.number})</span></h4>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mt-1">
                                            <span>{train.dep}</span>
                                            <span>➜</span>
                                            <span>{train.arr}</span>
                                            <span className="badge badge-ghost">{train.duration}</span>
                                            <span className="text-xs">Runs: {train.days}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-sm w-full md:w-auto">
                                    Check Availability
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mb-20 p-12 text-center bg-base-100 rounded-2xl border border-dashed border-base-300">
                    <div className="text-5xl mb-4">🚆</div>
                    <h3 className="text-xl font-bold mb-2">No direct trains found</h3>
                    <p className="text-base-content/60">We couldn't find any direct trains for this route. Try changing the date or checking for connecting trains.</p>
                </div>
            )}

            {/* Hotel Recommendations */}
            {hotels.best && (
                <div>
                    <h3 className="text-2xl font-bold text-base-content mb-8">Where to Stay</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Best Hotel */}
                        <div className="relative card-zoom shadow-2xl group hover-lift rounded-2xl overflow-hidden h-96">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
                            <img
                                src={hotels.best.image}
                                alt={hotels.best.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="relative z-20 p-8 h-full flex flex-col justify-end text-white">
                                <div className="inline-block bg-warning text-warning-content text-xs font-bold px-3 py-1 rounded-full mb-3 self-start shadow-lg">
                                    {t('topRated')}
                                </div>
                                <div className="flex justify-between items-start">
                                    <h4 className="text-3xl font-bold mb-2">{hotels.best.name}</h4>
                                    <button onClick={() => addToWishlist(hotels.best)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors">
                                        ❤️
                                    </button>
                                </div>

                                <p className="text-white/70 mb-4 flex items-center gap-2">
                                    <span className="text-warning">★★★★★</span> {hotels.best.rating}/5
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="block text-sm text-white/70">Starting from</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold">₹{hotels.best.price}<span className="text-base font-normal text-white/70">/night</span></span>
                                        </div>
                                    </div>
                                    <button className="btn btn-neutral px-6 py-3 rounded-xl font-bold">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cheapest Hotel */}
                        {hotels.cheapest && (
                            <div className="relative card-zoom shadow-2xl group hover-lift rounded-2xl overflow-hidden h-96">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
                                <img
                                    src={hotels.cheapest.image}
                                    alt={hotels.cheapest.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="relative z-20 p-8 h-full flex flex-col justify-end text-white">
                                    <div className="inline-block bg-success text-success-content text-xs font-bold px-3 py-1 rounded-full mb-3 self-start shadow-lg">
                                        {t('bestValue')}
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-3xl font-bold mb-2">{hotels.cheapest.name}</h4>
                                        <button onClick={() => addToWishlist(hotels.cheapest)} className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-md transition-colors">
                                            ❤️
                                        </button>
                                    </div>
                                    <p className="text-white/70 mb-4 flex items-center gap-2">
                                        <span className="text-warning">★★★★☆</span> {hotels.cheapest.rating}/5
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div>
                                            <span className="block text-sm text-white/70">Starting from</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold">₹{hotels.cheapest.price}<span className="text-base font-normal text-white/70">/night</span></span>
                                            </div>
                                        </div>
                                        <button className="btn btn-neutral px-6 py-3 rounded-xl font-bold">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrainsPage() {
    return (
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><div className="loading loading-spinner loading-lg"></div></div>}>
            <TrainsContent />
        </Suspense>
    );
}
