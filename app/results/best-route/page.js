"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Train, Bus, ArrowRight, Clock, AlertCircle } from "lucide-react";

function BestRouteContent() {
    const searchParams = useSearchParams();
    
    // Params
    const sourceParam = searchParams.get("source") || "";
    const destParam = searchParams.get("destination") || "";
    const dateParam = searchParams.get("date") || new Date().toISOString().split('T')[0];

    // State
    const [loading, setLoading] = useState(true);
    const [allRoutes, setAllRoutes] = useState([]); // Store all fetched routes
    const [routes, setRoutes] = useState([]); // Displayed routes
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState("ALL"); // ALL, MORNING, AFTERNOON, EVENING, NIGHT

    // Helper: Parse Duration to Minutes
    const parseDurationToMinutes = (durationStr) => {
        if (!durationStr) return Infinity;
        // Formats: "8h 30m", "08:30", "08:30:00"
        let hours = 0;
        let minutes = 0;

        if (durationStr.includes("h") || durationStr.includes("m")) {
            // "8h 30m" format
            const hMatch = durationStr.match(/(\d+)h/);
            const mMatch = durationStr.match(/(\d+)m/);
            if (hMatch) hours = parseInt(hMatch[1]);
            if (mMatch) minutes = parseInt(mMatch[1]);
        } else if (durationStr.includes(":")) {
            // "HH:MM" or "HH:MM:SS"
            const parts = durationStr.split(":");
            hours = parseInt(parts[0]) || 0;
            minutes = parseInt(parts[1]) || 0;
        }

        return (hours * 60) + minutes;
    };

    // Helper: Clean city name
    const cleanCity = (name) => name ? name.split(',')[0].trim() : "";

    // Helper: Get Time of Day from time string "HH:MM"
    const getTimeOfDay = (timeStr) => {
        if (!timeStr) return "NIGHT";
        const hour = parseInt(timeStr.split(":")[0]);
        
        if (hour >= 6 && hour < 12) return "MORNING";
        if (hour >= 12 && hour < 17) return "AFTERNOON";
        if (hour >= 17 && hour < 21) return "EVENING";
        return "NIGHT"; // 21:00 - 05:59
    };


    useEffect(() => {
        const fetchBestRoutes = async () => {
            const sourceCity = cleanCity(sourceParam);
            const destCity = cleanCity(destParam);

            if (!sourceCity || !destCity) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // 1. Resolve Locations (Parallel)
                const [trainStationsRes, busCitiesFromRes, busCitiesToRes] = await Promise.all([
                    // Find generic stations (we'll just search for the city name)
                    // For trains we need specific station codes. We'll try to find ones matching the city.
                    // This is a bit "fuzzy" but okay for "Best Route" overview.
                    // Actually, let's just search stations for both source and dest.
                    Promise.all([
                        fetch(`/api/railradar/search/stations?query=${encodeURIComponent(sourceCity)}`).then(r => r.json()),
                        fetch(`/api/railradar/search/stations?query=${encodeURIComponent(destCity)}`).then(r => r.json())
                    ]),
                    // Bus Cities
                    fetch(`/api/bus/city-search?q=${encodeURIComponent(sourceCity)}`).then(r => r.json()),
                    fetch(`/api/bus/city-search?q=${encodeURIComponent(destCity)}`).then(r => r.json())
                ]);

                const [sourceStationsData, destStationsData] = trainStationsRes;
                const busFromData = busCitiesFromRes;
                const busToData = busCitiesToRes;

                const trainSource = sourceStationsData.stations?.[0];
                const trainDest = destStationsData.stations?.[0];
                const busFrom = busFromData.results?.[0];
                const busTo = busToData.results?.[0];

                // 2. Fetch Routes (Parallel)
                const promises = [];

                // 2. Fetch Routes (Parallel)
                // Train Fetch - Try Top 2 Stations for robust connectivity
                // e.g. Delhi (NDLS, DLI, NZM) -> Mumbai (BCT, BDTS, CSMT)
                const sourceStns = sourceStationsData.stations?.slice(0, 2) || [];
                const destStns = destStationsData.stations?.slice(0, 2) || [];

                sourceStns.forEach(src => {
                    destStns.forEach(dst => {
                        promises.push(
                            fetch(`/api/train?action=betweenStations&from=${src.code}&to=${dst.code}`)
                                .then(r => r.json())
                                .then(data => ({ type: 'TRAIN', data }))
                                .catch(err => ({ type: 'TRAIN', error: err }))
                        );
                    });
                });

                // Bus Fetch
                if (busFrom && busTo) {
                    // Use internal API route for bus
                    promises.push(
                        fetch(`/bus?fromCityId=${busFrom.id}&toCityId=${busTo.id}&fromCityName=${encodeURIComponent(busFrom.name)}&toCityName=${encodeURIComponent(busTo.name)}&date=${dateParam}`)
                            .then(r => r.json())
                            .then(data => ({ type: 'BUS', data }))
                            .catch(err => ({ type: 'BUS', error: err }))
                    );
                }

                const results = await Promise.all(promises);

                // 3. Normalize Data
                let fetchedRoutes = [];
                const addedTrainNumbers = new Set(); // To deduplicate trains

                results.forEach(res => {
                    if (res.type === 'TRAIN' && res.data?.success && Array.isArray(res.data.data)) {
                        res.data.data.forEach(item => {
                            const t = item.train_base;
                            
                            // Avoid duplicates if multiple station combos return same train
                            if (addedTrainNumbers.has(t.train_no)) return;
                            addedTrainNumbers.add(t.train_no);

                            fetchedRoutes.push({
                                type: 'TRAIN',
                                id: `train-${t.train_no}`,
                                name: t.train_name,
                                number: t.train_no,
                                operator: 'Indian Railways',
                                from: t.from_stn_code,
                                to: t.to_stn_code,
                                dep: t.from_time,
                                arr: t.to_time,
                                duration: t.travel_time, // "HH:MM"
                                durationMins: parseDurationToMinutes(t.travel_time),
                                price: null, // Train API doesn't give price easily in this endpoint
                                icon: Train,
                                color: "text-primary",
                                badge: "badge-primary"
                            });
                        });
                    }

                    if (res.type === 'BUS' && res.data?.success && Array.isArray(res.data.buses)) {
                        const buses = res.data.buses.map(b => {
                            return {
                                type: 'BUS',
                                id: b.id,
                                name: b.operatorName,
                                number: b.busType,
                                operator: b.operatorName,
                                from: b.departure.place,
                                to: b.arrival.place,
                                dep: b.departure.time,
                                arr: b.arrival.time,
                                duration: b.duration,
                                durationMins: parseDurationToMinutes(b.duration),
                                price: b.pricing.finalPrice,
                                icon: Bus,
                                color: "text-secondary",
                                badge: "badge-secondary"
                            };
                        });
                        fetchedRoutes = [...fetchedRoutes, ...buses];
                    }
                });

                // 4. Sort and Limit
                // Filter out invalid durations
                let processedRoutes = fetchedRoutes.filter(r => r.durationMins > 0 && r.durationMins !== Infinity);
                
                // Sort by Duration (Fastest first)
                processedRoutes.sort((a, b) => a.durationMins - b.durationMins);

                setAllRoutes(processedRoutes);
                // Initial display: Top 5 of ALL
                setRoutes(processedRoutes.slice(0, 5));

            } catch (err) {
                console.error("Best Route Error:", err);
                setError("Failed to calculate best routes.");
            } finally {
                setLoading(false);
            }
        };

        fetchBestRoutes();
    }, [sourceParam, destParam, dateParam]);

    // Filter Effect
    useEffect(() => {
        if (!allRoutes.length) return;

        let filtered = allRoutes;
        if (timeFilter !== "ALL") {
            filtered = allRoutes.filter(r => getTimeOfDay(r.dep) === timeFilter);
        }

        setRoutes(filtered.slice(0, 5));
    }, [timeFilter, allRoutes]);

    return (
        <div className="py-8">
            {/* Header */}
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-base-content">Best Route Recommendation</h2>
                <p className="text-lg text-base-content/70 max-w-lg mb-6">
                    Top 5 fastest connections between {cleanCity(sourceParam)} and {cleanCity(destParam)}
                </p>

                {/* Time Filter Tabs */}
                <div className="tabs tabs-boxed bg-base-200 p-1 rounded-xl inline-flex">
                    {[
                        { id: "ALL", label: "Anytime" },
                        { id: "MORNING", label: "Morning" },
                        { id: "AFTERNOON", label: "Afternoon" },
                        { id: "EVENING", label: "Evening" },
                        { id: "NIGHT", label: "Night" },
                    ].map((tab) => (
                        <a 
                            key={tab.id}
                            className={`tab tab-md rounded-lg transition-all duration-300 gap-2 ${timeFilter === tab.id ? "bg-primary text-primary-content shadow-sm font-bold" : "hover:bg-base-100/50 text-base-content"}`}
                            onClick={() => setTimeFilter(tab.id)}
                        >
                            <span>{tab.label}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <p className="opacity-60">Analyzing extensive travel databases...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-error">
                        <AlertCircle className="w-6 h-6" />
                        <span>{error}</span>
                    </div>
                ) : routes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {routes.map((route, index) => {
                            const Icon = route.icon;
                            return (
                                <div key={route.id} className={`card bg-base-100 rounded-2xl p-6 border transition-all hover:shadow-md ${index === 0 ? 'border-primary shadow-sm ring-1 ring-primary/20' : 'border-base-200'}`}>
                                    {index === 0 && (
                                        <div className="absolute -top-3 left-6">
                                            <span className="badge badge-primary font-bold shadow-sm">🚀 Fastest Option</span>
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        
                                        {/* Left Info */}
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className={`p-4 rounded-xl bg-base-200 ${route.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg text-base-content">{route.name}</h3>
                                                    <span className={`badge ${route.badge} badge-outline text-xs`}>{route.type}</span>
                                                </div>
                                                <div className="text-sm text-base-content flex items-center gap-2">
                                                    <span>{route.number}</span>
                                                    {route.price && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-semibold text-base-content">{`₹${route.price}`}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle Dates */}
                                        <div className="flex items-center gap-6 text-base-content/80 w-full md:w-auto justify-center">
                                            <div className="text-center">
                                                <div className="font-bold text-xl text-base-content">{route.dep}</div>
                                                <div className="text-xs text-base-content/70 truncate max-w-[100px]">{route.from}</div>
                                            </div>
                                            <div className="flex flex-col items-center px-2">
                                                <ArrowRight className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-xl text-base-content">{route.arr}</div>
                                                <div className="text-xs text-base-content/70 truncate max-w-[100px]">{route.to}</div>
                                            </div>
                                        </div>

                                        {/* Right Duration (Green) */}
                                        <div className="flex flex-col items-end min-w-[100px]">
                                            <div className="text-lg font-bold text-success">{route.duration}</div>
                                            <div className="text-xs text-base-content/60 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Total Time
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                   <div className="text-center py-12 bg-base-100 rounded-2xl border border-dashed border-base-300">
                        <div className="text-4xl mb-4">😕</div>
                        <h3 className="text-xl font-bold">No direct routes found</h3>
                        <p className="text-base-content/60 max-w-md mx-auto mt-2">
                            We couldn't find any direct train or bus connections between {cleanCity(sourceParam)} and {cleanCity(destParam)}.
                        </p>
                    </div> 
                )}
            </div>
        </div>
    );
}

export default function BestRoutePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loading loading-spinner loading-lg text-primary"></div></div>}>
            <BestRouteContent />
        </Suspense>
    );
}
