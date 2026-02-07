"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function BusContent() {
    const searchParams = useSearchParams();

    // Helper to get local date string YYYY-MM-DD
    const getLocalDate = () => {
        const d = new Date();
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - (offset * 60 * 1000));
        return local.toISOString().split('T')[0];
    };

    // State
    const [fromQuery, setFromQuery] = useState("");
    const [toQuery, setToQuery] = useState("");
    const [date, setDate] = useState(getLocalDate());

    // Autocomplete State
    const [fromOptions, setFromOptions] = useState([]);
    const [toOptions, setToOptions] = useState([]);
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [selectedTo, setSelectedTo] = useState(null);
    const [isSearchingFrom, setIsSearchingFrom] = useState(false);
    const [isSearchingTo, setIsSearchingTo] = useState(false);

    // Results State
    const [loading, setLoading] = useState(false);
    const [buses, setBuses] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState(null);

    // Filter State (Basic)
    const [sortBy, setSortBy] = useState("price"); // price, duration, departure

    // Debounce
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // City Search API
    const searchCities = async (query, setOptions, setIsSearching) => {
        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/api/bus/city-search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.results)) {
                setOptions(data.results);
            } else {
                setOptions([]);
            }
        } catch (err) {
            console.error("City search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedFromSearch = useCallback(debounce((q) => searchCities(q, setFromOptions, setIsSearchingFrom), 400), []);
    const debouncedToSearch = useCallback(debounce((q) => searchCities(q, setToOptions, setIsSearchingTo), 400), []);

    // Handlers
    const handleFromChange = (e) => {
        const val = e.target.value;
        setFromQuery(val);
        setSelectedFrom(null);
        debouncedFromSearch(val);
    };

    const handleToChange = (e) => {
        const val = e.target.value;
        setToQuery(val);
        setSelectedTo(null);
        debouncedToSearch(val);
    };

    const selectFrom = (city) => {
        setSelectedFrom(city);
        setFromQuery(city.name);
        setFromOptions([]);
    };

    const selectTo = (city) => {
        setSelectedTo(city);
        setToQuery(city.name);
        setToOptions([]);
    };

    // Swap Inputs
    const handleSwap = () => {
        const tempQuery = fromQuery;
        const tempSelected = selectedFrom;

        setFromQuery(toQuery);
        setSelectedFrom(selectedTo);

        setToQuery(tempQuery);
        setSelectedTo(tempSelected);
    };

    // Main Bus Search
    const handleSearch = async () => {
        if (!selectedFrom || !selectedTo || !date) return;

        setLoading(true);
        setBuses([]);
        setError(null);
        setHasSearched(true);

        try {
            // NOTE: The endpoint is /bus (based on app/bus/route.js), not /api/bus
            const res = await fetch(`/bus?fromCityId=${selectedFrom.id}&toCityId=${selectedTo.id}&fromCityName=${encodeURIComponent(selectedFrom.name)}&toCityName=${encodeURIComponent(selectedTo.name)}&date=${date}`);
            const data = await res.json();

            if (data.success && Array.isArray(data.buses)) {
                let results = data.buses;

                // Sort results
                if (sortBy === 'price') {
                    results.sort((a, b) => a.pricing.finalPrice - b.pricing.finalPrice);
                } else if (sortBy === 'duration') {
                    // Simple string comparison for HH:MM works for ISO-like time durations if padded
                    results.sort((a, b) => a.duration.localeCompare(b.duration));
                }

                setBuses(results);
            } else {
                setError(data.error || "No buses found");
            }
        } catch (err) {
            console.error("Bus search error", err);
            setError("Failed to fetch bus list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-search from URL params (optional, implemented for consistency)
    useEffect(() => {
        const sParam = searchParams.get("source");
        const dParam = searchParams.get("destination");

        const sanitize = (str) => str ? str.split(',')[0].trim() : "";
        const cleanFrom = sanitize(sParam);
        const cleanTo = sanitize(dParam);

        if (cleanFrom && !selectedFrom) {
            setFromQuery(cleanFrom);
            searchCities(cleanFrom, setFromOptions, setIsSearchingFrom);
        }
        if (cleanTo && !selectedTo) {
            setToQuery(cleanTo);
            searchCities(cleanTo, setToOptions, setIsSearchingTo);
        }
    }, []);

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-8 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Book Bus Tickets</h1>
                <p className="text-base-content/60">Find and book bus tickets online (Powered by AbhiBus)</p>
            </div>

            {/* Search Interface */}
            <div className="card bg-base-100 shadow-xl border border-base-200 p-6 z-20 overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end relative">

                    {/* From Input */}
                    <div className="form-control relative w-full">
                        <label className="label">
                            <span className="label-text font-semibold">From</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={fromQuery}
                                onChange={handleFromChange}
                                placeholder="Enter City (e.g. Hyderabad)"
                                className="input input-bordered w-full pl-10 focus:input-primary"
                            />
                            <span className="absolute left-3 top-3 text-xl">🚌</span>
                            {isSearchingFrom && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                        </div>

                        <AnimatePresence>
                            {fromOptions.length > 0 && !selectedFrom && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                >
                                    {fromOptions.map((city) => (
                                        <button
                                            key={city.id}
                                            onClick={() => selectFrom(city)}
                                            className="btn btn-ghost btn-sm justify-start font-normal h-auto py-2"
                                        >
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-sm font-bold">{city.name}</span>
                                                <span className="text-xs opacity-60">{city.subtext}</span>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center pb-2">
                        <button onClick={handleSwap} className="btn btn-circle btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        </button>
                    </div>

                    {/* To Input */}
                    <div className="form-control relative w-full">
                        <label className="label">
                            <span className="label-text font-semibold">To</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={toQuery}
                                onChange={handleToChange}
                                placeholder="Enter City (e.g. Bangalore)"
                                className="input input-bordered w-full pl-10 focus:input-primary"
                            />
                            <span className="absolute left-3 top-3 text-xl">📍</span>
                            {isSearchingTo && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                        </div>

                        <AnimatePresence>
                            {toOptions.length > 0 && !selectedTo && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                >
                                    {toOptions.map((city) => (
                                        <button
                                            key={city.id}
                                            onClick={() => selectTo(city)}
                                            className="btn btn-ghost btn-sm justify-start font-normal h-auto py-2"
                                        >
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-sm font-bold">{city.name}</span>
                                                <span className="text-xs opacity-60">{city.subtext}</span>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Date Input */}
                    <div className="form-control w-full md:w-auto min-w-[150px]">
                        <label className="label">
                            <span className="label-text font-semibold">Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full"
                            value={date}
                            min={getLocalDate()}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={!selectedFrom || !selectedTo || loading}
                        className="btn btn-primary px-8 w-full md:w-auto"
                    >
                        {loading ? <span className="loading loading-dots"></span> : "Search Buses ➜"}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {hasSearched && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="divider flex-1">Results</div>
                        <div className="flex gap-2 ml-4">
                            <select className="select select-sm select-bordered" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="price">Price: Low to High</option>
                                <option value="duration">Duration: Shortest</option>
                            </select>
                        </div>
                    </div>

                    {buses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {buses.map((bus) => (
                                <div key={bus.id} className="card bg-base-100 rounded-2xl p-6 border border-base-200 hover:border-primary hover-lift shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
                                    <div className="flex flex-col gap-3 w-full md:w-[60%]">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-bold text-base-content">{bus.operatorName}</h4>
                                            <span className="badge badge-neutral text-xs">{bus.busType}</span>
                                        </div>

                                        <div className="flex items-center gap-6 text-base-content/80">
                                            <div className="text-center">
                                                <div className="font-bold text-xl">{bus.departure.time}</div>
                                                <div className="text-xs opacity-60">{bus.departure.place}</div>
                                            </div>
                                            <div className="flex flex-col items-center opacity-40">
                                                <span className="text-xs">{bus.duration}</span>
                                                <span>⎯⎯⎯⎯➜</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-xl">{bus.arrival.time}</div>
                                                <div className="text-xs opacity-60">{bus.arrival.place}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {bus.features.ac && <span className="badge badge-accent badge-outline badge-xs">AC</span>}
                                            {bus.features.sleeper && <span className="badge badge-secondary badge-outline badge-xs">Sleeper</span>}
                                            {bus.features.liveTracking && <span className="badge badge-success badge-outline badge-xs">Live Tracking</span>}
                                            <span className="text-xs text-warning ml-2">★ {bus.rating.score} ({bus.rating.reviewCount})</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 w-full md:w-[30%] border-t md:border-t-0 md:border-l border-base-200 pt-4 md:pt-0 md:pl-4">
                                        <div className="text-right">
                                            <span className="text-xs opacity-60 block">Starting from</span>
                                            <span className="text-2xl font-bold text-primary">₹{bus.pricing.finalPrice}</span>
                                            {bus.pricing.originalPrice > bus.pricing.finalPrice && (
                                                <span className="text-xs line-through opacity-40 block">₹{bus.pricing.originalPrice}</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-success">{bus.availableSeats} Seats Left</div>
                                        <button className="btn btn-sm btn-primary w-full">Select Seat</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center py-12 bg-base-100 rounded-2xl border border-dashed border-base-300">
                                <div className="text-6xl mb-4">🚌</div>
                                <h3 className="text-xl font-bold">No buses found</h3>
                                <p className="text-base-content/60 max-w-md mx-auto mt-2">
                                    We couldn't find any buses between these cities for the selected date. Try changing the date or route.
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

export default function BusResults() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loading loading-spinner loading-lg text-primary"></div></div>}>
            <BusContent />
        </Suspense>
    );
}
