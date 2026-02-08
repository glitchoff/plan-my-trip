"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

function FlightContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();

    // Helper to get local date string YYYY-MM-DD
    const getLocalDate = () => {
        const d = new Date();
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - (offset * 60 * 1000));
        return local.toISOString().split('T')[0];
    };

    // Search State
    const [sourceQuery, setSourceQuery] = useState("");
    const [destQuery, setDestQuery] = useState("");
    const [date, setDate] = useState(getLocalDate()); // Default to today local time
    const [sourceOptions, setSourceOptions] = useState([]);
    const [destOptions, setDestOptions] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [selectedDest, setSelectedDest] = useState(null);
    const [isSearchingSource, setIsSearchingSource] = useState(false);
    const [isSearchingDest, setIsSearchingDest] = useState(false);

    // Results State
    const [loading, setLoading] = useState(false);
    const [flights, setFlights] = useState([]);
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

    // Airport Search API (Amadeus)
    const searchAirports = async (query, setOptions, setIsSearching) => {
        if (!query || query.length < 2) {
            setOptions([]);
            return;
        }
        setIsSearching(true);
        try {
            const res = await fetch(`/api/amadeus?action=searchAirports&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data.data) {
                setOptions(data.data);
            } else {
                setOptions([]);
            }
        } catch (err) {
            console.error("Airport search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounced Search Functions
    const debouncedSourceSearch = useCallback(debounce((q) => searchAirports(q, setSourceOptions, setIsSearchingSource), 500), []);
    const debouncedDestSearch = useCallback(debounce((q) => searchAirports(q, setDestOptions, setIsSearchingDest), 500), []);

    // Handle Input Changes
    const handleSourceChange = (e) => {
        const val = e.target.value;
        setSourceQuery(val);
        setSelectedSource(null);
        debouncedSourceSearch(val);
    };

    const handleDestChange = (e) => {
        const val = e.target.value;
        setDestQuery(val);
        setSelectedDest(null);
        debouncedDestSearch(val);
    };

    // Select Airport
    const selectSource = (airport) => {
        setSelectedSource(airport);
        setSourceQuery(`${airport.name} (${airport.iataCode})`);
        setSourceOptions([]);
    };

    const selectDest = (airport) => {
        setSelectedDest(airport);
        setDestQuery(`${airport.name} (${airport.iataCode})`);
        setDestOptions([]);
    };

    // Main Flight Search (Amadeus)
    const handleSearch = async () => {
        if (!selectedSource || !selectedDest || !date) return;

        setLoading(true);
        setFlights([]);
        setError(null);
        setHasSearched(true);

        try {
            const res = await fetch(`/api/amadeus?action=searchFlights&origin=${selectedSource.iataCode}&destination=${selectedDest.iataCode}&date=${date}`);
            const data = await res.json();

            if (data.data && Array.isArray(data.data)) {
                // Map Amadeus response
                const mappedFlights = data.data.map(offer => {
                    const itinerary = offer.itineraries[0];
                    const firstSegment = itinerary.segments[0];
                    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                    const airlineCode = firstSegment.carrierCode;

                    // Helper to format duration (PT2H30M -> 2h 30m)
                    const formatDuration = (pt) => {
                        return pt.replace('PT', '').toLowerCase();
                    };

                    return {
                        id: offer.id,
                        airline: airlineCode, // In a real app we'd map this code to a name via dictionary
                        flightNumber: `${firstSegment.carrierCode} ${firstSegment.number}`,
                        departureTime: firstSegment.departure.at,
                        arrivalTime: lastSegment.arrival.at,
                        price: `${offer.price.currency} ${offer.price.total}`,
                        duration: formatDuration(itinerary.duration),
                        stops: itinerary.segments.length - 1
                    };
                });

                // Sort by stops (ascending)
                mappedFlights.sort((a, b) => a.stops - b.stops);

                setFlights(mappedFlights);
            } else if (data.errors) {
                setError(data.errors[0].detail || "Search failed");
            } else {
                setFlights([]);
            }
        } catch (err) {
            console.error("Flight search error", err);
            setError("Failed to fetch flight details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to find nearest airport (Stub - Amadeus might have a 'nearest' endpoint but simplistic for now)
    const findNearestAirport = async (query, setSelected) => {
        // Logic remains somewhat similar to before but resolving to Amadeus objects.
        // For now, let's trust the Amadeus autocomplete which is quite robust.
    };

    // Initialize from URL params
    useEffect(() => {
        // ... (Keep param init logic if needed, or simplify)
        const sParam = searchParams.get("source");
        const dParam = searchParams.get("destination");

        const sanitize = (str) => str ? str.split(',')[0].trim() : "";
        const cleanSource = sanitize(sParam);
        const cleanDest = sanitize(dParam);

        if (cleanSource && !selectedSource) {
            setSourceQuery(cleanSource);
            searchAirports(cleanSource, setSourceOptions, setIsSearchingSource);
        }
        if (cleanDest && !selectedDest) {
            setDestQuery(cleanDest);
            searchAirports(cleanDest, setDestOptions, setIsSearchingDest);
        }
    }, []);

    // Auto-search logic
    useEffect(() => {
        if (selectedSource && selectedDest && date) {
            handleSearch();
        }
    }, [selectedSource, selectedDest, date]);


    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-8 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 text-base-content">Find Your Flight</h1>
                <p className="text-base-content/60">Search for real-time flight deals (Powered by Amadeus)</p>
            </div>

            {/* Search Interface */}
            <div className="card bg-base-100 shadow-xl border border-base-200 p-6 z-20 overflow-visible">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

                    {/* Source Input */}
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">From</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={sourceQuery}
                                onChange={handleSourceChange}
                                placeholder="City or Airport (e.g. LON)"
                                className="input input-bordered w-full pl-10 focus:input-primary text-base-content placeholder:text-base-content/40"
                            />
                            <span className="absolute left-3 top-3 text-xl text-base-content">🛫</span>
                            {isSearchingSource && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                        </div>

                        <AnimatePresence>
                            {sourceOptions.length > 0 && !selectedSource && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                >
                                    {sourceOptions.map((apt, idx) => (
                                        <button
                                            key={apt.id || idx}
                                            onClick={() => selectSource(apt)}
                                            className="btn btn-ghost btn-sm justify-start font-normal h-auto py-2"
                                        >
                                            <span className="badge badge-primary badge-outline mr-2 w-16 shrink-0">{apt.iataCode}</span>
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-sm font-bold text-base-content">{apt.name}</span>
                                                <span className="text-xs text-base-content/60">{apt.address?.cityName}, {apt.address?.countryName}</span>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Destination Input */}
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">To</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={destQuery}
                                onChange={handleDestChange}
                                placeholder="City or Airport (e.g. NYC)"
                                className="input input-bordered w-full pl-10 focus:input-primary text-base-content placeholder:text-base-content/40"
                            />
                            <span className="absolute left-3 top-3 text-xl text-base-content">🛬</span>
                            {isSearchingDest && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                        </div>

                        <AnimatePresence>
                            {destOptions.length > 0 && !selectedDest && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                >
                                    {destOptions.map((apt, idx) => (
                                        <button
                                            key={apt.id || idx}
                                            onClick={() => selectDest(apt)}
                                            className="btn btn-ghost btn-sm justify-start font-normal h-auto py-2"
                                        >
                                            <span className="badge badge-secondary badge-outline mr-2 w-16 shrink-0">{apt.iataCode}</span>
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="text-sm font-bold text-base-content">{apt.name}</span>
                                                <span className="text-xs text-base-content/60">{apt.address?.cityName}, {apt.address?.countryName}</span>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Date Input */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold text-base-content">Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full text-base-content"
                            value={date}
                            min={getLocalDate()}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={!selectedSource || !selectedDest || !date || loading}
                        className="btn btn-primary px-8"
                    >
                        {loading ? <span className="loading loading-dots"></span> : "Search Flights ➜"}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {hasSearched && (
                <div className="space-y-4">
                    <div className="divider">Results</div>

                    {flights.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {flights.map((flight) => (
                                <div key={flight.id} className="card bg-base-100 rounded-2xl p-6 border border-base-200 hover:border-primary hover-lift shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="text-4xl text-base-content bg-base-200 p-3 rounded-xl">
                                            ✈️
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-base-content flex items-center gap-2">
                                                {flight.airline}
                                                <span className="badge badge-info text-xs">{flight.flightNumber}</span>
                                                {flight.stops === 0 && <span className="badge badge-success badge-outline text-xs">Direct</span>}
                                                {flight.stops > 0 && <span className="badge badge-warning badge-outline text-xs">{flight.stops} Stop(s)</span>}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-base-content">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="text-xs text-base-content/60">Dep</span>
                                                </div>
                                                <span className="text-base-content/40">➜</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-base-content">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <span className="text-xs text-base-content/60">Arr</span>
                                                </div>
                                                <div className="badge badge-ghost gap-1 text-base-content/70">
                                                    {flight.duration}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                        <span className="text-2xl font-bold text-primary">{flight.price}</span>
                                        <button className="btn btn-sm btn-outline btn-primary w-full">Select</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center py-12 bg-base-100 rounded-2xl border border-dashed border-base-300">
                                <div className="text-6xl mb-4">🛫</div>
                                <h3 className="text-xl font-bold text-base-content">No flights found</h3>
                                <p className="text-base-content/60 max-w-md mx-auto mt-2">
                                    We couldn't find any flights between <span className="font-semibold text-base-content">{selectedSource?.iataCode}</span> and <span className="font-semibold text-base-content">{selectedDest?.iataCode}</span> on {date}.
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

export default function FlightResults() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loading loading-spinner loading-lg text-primary"></div></div>}>
            <FlightContent />
        </Suspense>
    );
}
