"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Train, Bus, ArrowRight, Clock, AlertCircle, Plane, Car, User, MapPin, Search } from "lucide-react";

function BestRouteContent() {
    const searchParams = useSearchParams();

    // Params
    const sourceParam = searchParams.get("source") || "";
    const destParam = searchParams.get("destination") || "";
    const dateParam = searchParams.get("date") || new Date().toISOString().split('T')[0];

    // Helpers
    const cleanCity = (name) => name ? name.split(',')[0].trim() : "";
    const parseDurationToMinutes = (durationStr) => {
        if (!durationStr) return Infinity;
        let hours = 0, minutes = 0;
        if (durationStr.includes("h") || durationStr.includes("m")) {
            const hMatch = durationStr.match(/(\d+)h/);
            const mMatch = durationStr.match(/(\d+)m/);
            if (hMatch) hours = parseInt(hMatch[1]);
            if (mMatch) minutes = parseInt(mMatch[1]);
        } else if (durationStr.includes(":")) {
            const parts = durationStr.split(":");
            hours = parseInt(parts[0]) || 0;
            minutes = parseInt(parts[1]) || 0;
        }
        return (hours * 60) + minutes;
    };

    // State
    const [isAIMode, setIsAIMode] = useState(true);

    // AI State
    const [aiRoutes, setAiRoutes] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    // Legacy State
    const [legacyRoutes, setLegacyRoutes] = useState([]);
    const [legacyLoading, setLegacyLoading] = useState(false);
    const [legacyError, setLegacyError] = useState(null);
    const [fetchedLegacy, setFetchedLegacy] = useState(false); // To prevent refetching
    const [fetchedAI, setFetchedAI] = useState(false);

    // --- AI Fetch Logic ---
    useEffect(() => {
        if (!isAIMode || fetchedAI || !sourceParam || !destParam) return;

        const fetchAIRoutes = async () => {
            setAiLoading(true);
            setAiError(null);
            try {
                const res = await fetch('/api/ai/best-route', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source: cleanCity(sourceParam),
                        destination: cleanCity(destParam),
                        date: dateParam
                    })
                });
                const data = await res.json();

                if (data.routes && Array.isArray(data.routes)) {
                    setAiRoutes(data.routes);
                } else if (data.error) {
                    throw new Error(data.error);
                } else {
                    throw new Error("Invalid AI response format");
                }
            } catch (err) {
                console.error("AI Fetch Error:", err);
                setAiError(err.message || "Failed to generate AI routes");
            } finally {
                setAiLoading(false);
                setFetchedAI(true);
            }
        };

        fetchAIRoutes();
    }, [isAIMode, fetchedAI, sourceParam, destParam, dateParam]);


    // --- Legacy Fetch Logic ---
    useEffect(() => {
        if (isAIMode || fetchedLegacy || !sourceParam || !destParam) return;

        const fetchLegacyRoutes = async () => {
            setLegacyLoading(true);
            setLegacyError(null);
            const sourceCity = cleanCity(sourceParam);
            const destCity = cleanCity(destParam);

            try {
                // 1. Resolve Locations (Parallel)
                const [trainStationsRes, busCitiesFromRes, busCitiesToRes] = await Promise.all([
                    Promise.all([
                        fetch(`/api/railradar/search/stations?query=${encodeURIComponent(sourceCity)}`).then(r => r.json()),
                        fetch(`/api/railradar/search/stations?query=${encodeURIComponent(destCity)}`).then(r => r.json())
                    ]),
                    fetch(`/api/bus/city-search?q=${encodeURIComponent(sourceCity)}`).then(r => r.json()),
                    fetch(`/api/bus/city-search?q=${encodeURIComponent(destCity)}`).then(r => r.json())
                ]);

                const [sourceStationsData, destStationsData] = trainStationsRes;
                const busFrom = busCitiesFromRes.results?.[0];
                const busTo = busCitiesToRes.results?.[0];

                const promises = [];

                // Train Fetch
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
                    promises.push(
                        fetch(`/bus?fromCityId=${busFrom.id}&toCityId=${busTo.id}&fromCityName=${encodeURIComponent(busFrom.name)}&toCityName=${encodeURIComponent(busTo.name)}&date=${dateParam}`)
                            .then(r => r.json())
                            .then(data => ({ type: 'BUS', data }))
                            .catch(err => ({ type: 'BUS', error: err }))
                    );
                }

                const results = await Promise.all(promises);

                // Normalize
                let fetched = [];
                const addedTrainNumbers = new Set();

                results.forEach(res => {
                    if (res.type === 'TRAIN' && res.data?.success && Array.isArray(res.data.data)) {
                        res.data.data.forEach(item => {
                            const t = item.train_base;
                            if (addedTrainNumbers.has(t.train_no)) return;
                            addedTrainNumbers.add(t.train_no);
                            fetched.push({
                                type: 'TRAIN',
                                id: `train-${t.train_no}`,
                                name: t.train_name,
                                number: t.train_no,
                                operator: 'Indian Railways',
                                from: t.from_stn_code,
                                to: t.to_stn_code,
                                dep: t.from_time,
                                arr: t.to_time,
                                duration: t.travel_time,
                                durationMins: parseDurationToMinutes(t.travel_time),
                                price: null,
                                icon: Train,
                                color: "text-primary",
                                badge: "badge-primary"
                            });
                        });
                    }

                    if (res.type === 'BUS' && res.data?.success && Array.isArray(res.data.buses)) {
                        res.data.buses.forEach(b => {
                            fetched.push({
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
                            });
                        });
                    }
                });

                fetched.sort((a, b) => a.durationMins - b.durationMins);
                setLegacyRoutes(fetched.slice(0, 10)); // Top 10

            } catch (err) {
                console.error("Legacy Route Error:", err);
                setLegacyError("Failed to fetch live availability.");
            } finally {
                setLegacyLoading(false);
                setFetchedLegacy(true);
            }
        };

        fetchLegacyRoutes();
    }, [isAIMode, fetchedLegacy, sourceParam, destParam, dateParam]);

    // Helpers for Icons
    const getTransportIcon = (type) => {
        const t = type.toLowerCase();
        if (t.includes('train')) return Train;
        if (t.includes('bus')) return Bus;
        if (t.includes('flight') || t.includes('plane')) return Plane;
        if (t.includes('cab') || t.includes('taxi') || t.includes('car')) return Car;
        if (t.includes('auto')) return Car; // close enough
        return MapPin;
    };

    return (
        <div className="py-8 min-h-screen bg-base-100">
            {/* Header */}
            <div className="flex flex-col items-center justify-center text-center mb-8 px-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 ring-4 ring-base-100 shadow-lg">
                    {isAIMode ? <Sparkles className="w-8 h-8 text-primary animate-pulse" /> : <Search className="w-8 h-8 text-secondary" />}
                </div>
                <h2 className="text-3xl font-bold mb-3 text-base-content">
                    {isAIMode ? "AI Smart Analysis" : "Live Availability"}
                </h2>
                <p className="text-lg text-base-content/70 max-w-lg mb-6">
                    Finding the best way to get from <span className="font-semibold text-primary">{cleanCity(sourceParam)}</span> to <span className="font-semibold text-primary">{cleanCity(destParam)}</span>
                </p>

                {/* Hybrid Toggle */}
                <div role="tablist" className="tabs tabs-boxed p-2 bg-base-200/50 rounded-2xl">
                    <a
                        role="tab"
                        className={`tab h-12 px-6 rounded-xl transition-all duration-300 gap-2 text-base ${isAIMode ? "bg-primary text-primary-content font-bold shadow-md" : "hover:bg-base-200"}`}
                        onClick={() => setIsAIMode(true)}
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Recommendation
                    </a>
                    <a
                        role="tab"
                        className={`tab h-12 px-6 rounded-xl transition-all duration-300 gap-2 text-base ${!isAIMode ? "bg-secondary text-secondary-content font-bold shadow-md" : "hover:bg-base-200"}`}
                        onClick={() => setIsAIMode(false)}
                    >
                        <Search className="w-4 h-4" />
                        Live Data
                    </a>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-3xl mx-auto px-4">

                {/* AI MODE */}
                {isAIMode && (
                    <div className="space-y-6">
                        {aiLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <div className="text-center">
                                    <p className="font-bold text-lg">Designing your perfect trip...</p>
                                    <p className="text-base-content/60 text-sm">Analyzing connections, checking modes, and optimizing for comfort.</p>
                                </div>
                            </div>
                        ) : aiError ? (
                            <div className="alert alert-error shadow-lg">
                                <AlertCircle className="w-6 h-6" />
                                <div>
                                    <h3 className="font-bold">AI Generation Failed</h3>
                                    <div className="text-xs">{aiError}</div>
                                </div>
                                <button className="btn btn-sm" onClick={() => { setFetchedAI(false); }}>Retry</button>
                            </div>
                        ) : aiRoutes.length > 0 ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {aiRoutes.map((route, i) => (
                                    <div key={i} className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden group hover:border-primary/50 transition-all">
                                        {/* Route Header */}
                                        <div className="bg-base-200/50 p-6 flex flex-wrap items-center justify-between gap-4 border-b border-base-200">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`badge ${i === 0 ? 'badge-primary' : 'badge-neutral'} badge-lg font-bold`}>
                                                        {route.name || "Option " + (i + 1)}
                                                    </span>
                                                    {route.tags?.map((tag, t) => (
                                                        <span key={t} className="badge badge-ghost badge-sm">{tag}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-base-content/70 mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {route.totalDuration}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-bold text-base-content">₹{route.totalPrice}</span>
                                                        <span className="text-xs">(est.)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary btn-sm rounded-full">Book This Trip</button>
                                        </div>

                                        {/* Segments Timeline */}
                                        <div className="p-6">
                                            <ul className="timeline timeline-vertical timeline-compact -my-4">
                                                {route.segments.map((seg, s) => {
                                                    const SegIcon = getTransportIcon(seg.type);
                                                    return (
                                                        <li key={s}>
                                                            <div className="timeline-middle">
                                                                <div className={`p-2 rounded-full ${s === 0 ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'}`}>
                                                                    <SegIcon className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                            <div className="timeline-end timeline-box mb-4 w-full bg-base-100 border-none shadow-none p-0 pl-4">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-base-200/30 hover:bg-base-200/60 transition-colors">
                                                                    <div className="flex-1">
                                                                        <div className="font-bold text-base-content">{seg.from} <span className="opacity-50">→</span> {seg.to}</div>
                                                                        <div className="text-sm font-medium text-primary flex items-center gap-2">
                                                                            <span className="capitalize">{seg.type}</span>
                                                                            <span className="w-1 h-1 rounded-full bg-base-content/30"></span>
                                                                            <span className="text-base-content/70 font-normal">{seg.details}</span>
                                                                        </div>
                                                                        <div className="text-xs text-base-content/50 mt-1">
                                                                            {seg.startTime} - {seg.endTime} • {seg.duration}
                                                                        </div>
                                                                    </div>
                                                                    {seg.price && (
                                                                        <div className="text-right">
                                                                            <div className="font-bold text-base-content">₹{seg.price}</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {/* Connection Line Text (optional, if we want to show wait time etc in future) */}
                                                            </div>
                                                            {s < route.segments.length - 1 && <hr className="bg-base-200" />}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                                <div className="alert alert-info bg-info/10 border-info/20 text-xs">
                                    <AlertCircle className="w-4 h-4 text-info" />
                                    <span>AI generated itineraries are estimates based on general schedules. Please verify actual timings before booking.</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p>No AI routes found. Try switching to Live Data.</p>
                            </div>
                        )}
                    </div>
                )}


                {/* LEGACY MODE */}
                {!isAIMode && (
                    <div className="space-y-4">
                        {legacyLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-secondary mb-4"></span>
                                <p className="opacity-60">Checking live railway and bus databases...</p>
                            </div>
                        ) : legacyError ? (
                            <div className="alert alert-error">
                                <AlertCircle className="w-6 h-6" />
                                <span>{legacyError}</span>
                            </div>
                        ) : legacyRoutes.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {legacyRoutes.map((route, index) => {
                                    const Icon = route.icon;
                                    return (
                                        <div key={route.id} className={`card bg-base-100 rounded-2xl p-6 border transition-all hover:shadow-md ${index === 0 ? 'border-primary shadow-sm ring-1 ring-primary/20' : 'border-base-200'}`}>
                                            {index === 0 && (
                                                <div className="absolute -top-3 left-6">
                                                    <span className="badge badge-primary font-bold shadow-sm">🚀 Fastest Found</span>
                                                </div>
                                            )}

                                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
                                    We couldn't find any direct train or bus connections. Try the AI Recommendation tab!
                                </p>
                            </div>
                        )}
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
