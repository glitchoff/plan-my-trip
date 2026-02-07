"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

function TrainsContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();

    // Search State
    const [sourceQuery, setSourceQuery] = useState("");
    const [destQuery, setDestQuery] = useState("");
    const [sourceOptions, setSourceOptions] = useState([]);
    const [destOptions, setDestOptions] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [selectedDest, setSelectedDest] = useState(null);
    const [isSearchingSource, setIsSearchingSource] = useState(false);
    const [isSearchingDest, setIsSearchingDest] = useState(false);

    // Results State
    const [loading, setLoading] = useState(false);
    const [trains, setTrains] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState(null);

    // Debounce Utility
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Station Search API
    const searchStations = async (query, setOptions, setIsSearching) => {
        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/api/railradar/search/stations?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.stations) {
                setOptions(data.stations);
            }
        } catch (err) {
            console.error("Station search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounced Search Functions
    const debouncedSourceSearch = useCallback(debounce((q) => searchStations(q, setSourceOptions, setIsSearchingSource), 300), []);
    const debouncedDestSearch = useCallback(debounce((q) => searchStations(q, setDestOptions, setIsSearchingDest), 300), []);

    // Handle Input Changes
    const handleSourceChange = (e) => {
        const val = e.target.value;
        setSourceQuery(val);
        setSelectedSource(null); // Reset selection on edit
        debouncedSourceSearch(val);
    };

    const handleDestChange = (e) => {
        const val = e.target.value;
        setDestQuery(val);
        setSelectedDest(null); // Reset selection on edit
        debouncedDestSearch(val);
    };

    // Select Station
    const selectSource = (station) => {
        setSelectedSource(station);
        setSourceQuery(`${station.name} (${station.code})`);
        setSourceOptions([]);
    };

    const selectDest = (station) => {
        setSelectedDest(station);
        setDestQuery(`${station.name} (${station.code})`);
        setDestOptions([]);
    };

    // Main Train Search
    const handleSearch = async () => {
        if (!selectedSource || !selectedDest) return;

        setLoading(true);
        setTrains([]);
        setError(null);
        setHasSearched(true);

        try {
            const res = await fetch(`/api/train?action=betweenStations&from=${selectedSource.code}&to=${selectedDest.code}`);
            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {
                const realTrains = data.data.map(item => {
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
            } else {
                setTrains([]);
            }
        } catch (err) {
            console.error("Train search error", err);
            setError("Failed to fetch train details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Initialize from URL params if available
    useEffect(() => {
        const sParam = searchParams.get("source");
        const dParam = searchParams.get("destination");

        const sanitize = (str) => str ? str.split(',')[0].trim() : "";

        const cleanSource = sanitize(sParam);
        const cleanDest = sanitize(dParam);

        if (cleanSource && !selectedSource) {
            setSourceQuery(cleanSource);
            searchStations(cleanSource, setSourceOptions, setIsSearchingSource);
        }
        if (cleanDest && !selectedDest) {
            setDestQuery(cleanDest);
            searchStations(cleanDest, setDestOptions, setIsSearchingDest);
        }
    }, []);

    // Auto-search when both stations are selected
    useEffect(() => {
        if (selectedSource && selectedDest) {
            handleSearch();
        }
    }, [selectedSource, selectedDest]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto px-4 py-8 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Find Your Train</h1>
                <p className="text-base-content/60">Search for trains between any two stations in India</p>
            </div>

            {/* Search Interface */}
            <div className="card bg-base-100 shadow-xl border border-base-200 p-6 z-20 overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">

                    {/* Source Input */}
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text font-semibold">From Station</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={sourceQuery}
                                onChange={handleSourceChange}
                                placeholder="Type city or station (e.g., Mumbai)"
                                className="input input-bordered w-full pl-10 focus:input-primary"
                            />
                            <span className="absolute left-3 top-3 text-xl">🚉</span>
                            {isSearchingSource && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                        </div>

                        {/* Source Suggestions */}
                        <AnimatePresence>
                            {sourceOptions.length > 0 && !selectedSource && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                >
                                    {sourceOptions.map((stn) => (
                                        <button
                                            key={stn.code}
                                            onClick={() => selectSource(stn)}
                                            className="btn btn-ghost btn-sm justify-start font-normal h-auto py-2"
                                        >
                                            <span className="badge badge-primary badge-outline mr-2 w-16 shrink-0">{stn.code}</span>
                                            {stn.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Destination Input */}
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text font-semibold">To Station</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={destQuery}
                                onChange={handleDestChange}
                                placeholder="Type city or station (e.g., Delhi)"
                                className="input input-bordered w-full pl-10 focus:input-primary"
                            />
                            <span className="absolute left-3 top-3 text-xl">🏁</span>
                            {isSearchingDest && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                        </div>

                        {/* Dest Suggestions */}
                        <AnimatePresence>
                            {destOptions.length > 0 && !selectedDest && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                >
                                    {destOptions.map((stn) => (
                                        <button
                                            key={stn.code}
                                            onClick={() => selectDest(stn)}
                                            className="btn btn-ghost btn-sm justify-start font-normal h-auto py-2"
                                        >
                                            <span className="badge badge-secondary badge-outline mr-2 w-16 shrink-0">{stn.code}</span>
                                            {stn.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={!selectedSource || !selectedDest || loading}
                        className="btn btn-primary px-8"
                    >
                        {loading ? <span className="loading loading-dots"></span> : "Search Trains ➜"}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {hasSearched && (
                <div className="space-y-4">
                    <div className="divider">Results</div>

                    {trains.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {trains.map((train) => (
                                <div key={train.id} className="card bg-base-100 rounded-2xl p-6 border border-base-200 hover:border-primary hover-lift shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="text-4xl text-base-content bg-base-200 p-3 rounded-xl">
                                            {train.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-base-content flex items-center gap-2">
                                                {train.name}
                                                <span className="badge badge-neutral text-xs">{train.number}</span>
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold">{train.dep}</span>
                                                    <span className="text-xs">{train.from}</span>
                                                </div>
                                                <span className="text-base-content/30">➜</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold">{train.arr}</span>
                                                    <span className="text-xs">{train.to}</span>
                                                </div>
                                                <div className="badge badge-ghost gap-1">
                                                    ⏱ {train.duration}
                                                </div>
                                                <div className="text-xs opacity-60">
                                                    Runs: {train.days}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center py-12 bg-base-100 rounded-2xl border border-dashed border-base-300">
                                <div className="text-6xl mb-4">🚄</div>
                                <h3 className="text-xl font-bold">No direct trains found</h3>
                                <p className="text-base-content/60 max-w-md mx-auto mt-2">
                                    We couldn't find any direct trains between <span className="font-semibold">{selectedSource?.name}</span> and <span className="font-semibold">{selectedDest?.name}</span>.
                                </p>
                            </div>
                        )
                    )}

                    {error && (
                        <div className="alert alert-error">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function TrainsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loading loading-spinner loading-lg text-primary"></div></div>}>
            <TrainsContent />
        </Suspense>
    );
}
