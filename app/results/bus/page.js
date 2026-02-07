"use client";

import { useState, useEffect, Suspense, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, MapPin, ArrowRight, AlertCircle } from "lucide-react";

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

    // Cache
    const resultsCache = useRef({});

    // Alternatives State
    const [fromAlternatives, setFromAlternatives] = useState([]);
    const [toAlternatives, setToAlternatives] = useState([]);

    // Autocomplete State
    const [fromOptions, setFromOptions] = useState([]);
    const [toOptions, setToOptions] = useState([]);
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [selectedTo, setSelectedTo] = useState(null);
    const [isSearchingFrom, setIsSearchingFrom] = useState(false);
    const [isSearchingTo, setIsSearchingTo] = useState(false);
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    // Results State
    const [loading, setLoading] = useState(false);
    const [buses, setBuses] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState(null);

    // Filter State (Basic)
    const [sortBy, setSortBy] = useState("price"); // price, duration, departure

    // Derived State: Sorted Buses
    const sortedBuses = useMemo(() => {
        if (!buses.length) return [];
        const sorted = [...buses];
        if (sortBy === 'price') {
            sorted.sort((a, b) => a.pricing.finalPrice - b.pricing.finalPrice);
        } else if (sortBy === 'duration') {
            sorted.sort((a, b) => a.duration.localeCompare(b.duration));
        }
        return sorted;
    }, [buses, sortBy]);

    // Debounce
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // City Search API with optional auto-select callback
    const searchCities = async (query, setOptions, setIsSearching, autoSelectCallback = null) => {
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
                // Auto-select the first result if callback provided
                if (autoSelectCallback && data.results.length > 0) {
                    autoSelectCallback(data.results[0]);
                }
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
        setShowFromDropdown(true);
        debouncedFromSearch(val);
    };

    const handleToChange = (e) => {
        const val = e.target.value;
        setToQuery(val);
        setSelectedTo(null);
        setShowToDropdown(true);
        debouncedToSearch(val);
    };

    const handleFromFocus = () => {
        setShowFromDropdown(true);
        // If there's already a query but no options, trigger search
        if (fromQuery.length >= 2 && fromOptions.length === 0) {
            searchCities(fromQuery, setFromOptions, setIsSearchingFrom);
        }
    };

    const handleToFocus = () => {
        setShowToDropdown(true);
        // If there's already a query but no options, trigger search
        if (toQuery.length >= 2 && toOptions.length === 0) {
            searchCities(toQuery, setToOptions, setIsSearchingTo);
        }
    };

    const selectFrom = (city) => {
        // Save other options as alternatives
        const alts = fromOptions.filter(o => o.id !== city.id);
        setFromAlternatives(alts);

        setSelectedFrom(city);
        setFromQuery(city.name);
        setFromOptions([]);
        setShowFromDropdown(false);
    };

    const selectTo = (city) => {
        // Save other options as alternatives
        const alts = toOptions.filter(o => o.id !== city.id);
        setToAlternatives(alts);

        setSelectedTo(city);
        setToQuery(city.name);
        setToOptions([]);
        setShowToDropdown(false);
    };

    const selectFromAlternative = (city) => {
        console.log("Selecting alternative:", city);
        // Add current selected to alternatives list if it exists
        let newAlts = [...fromAlternatives];
        if (selectedFrom) {
            newAlts = [...newAlts, selectedFrom];
        }
        // Remove new selected from alternatives
        newAlts = newAlts.filter(c => c.id !== city.id);

        setFromAlternatives(newAlts);
        setSelectedFrom(city);
        setFromQuery(city.name);
    }

    const selectToAlternative = (city) => {
        let newAlts = [...toAlternatives];
        if (selectedTo) {
            newAlts = [...newAlts, selectedTo];
        }
        newAlts = newAlts.filter(c => c.id !== city.id);

        setToAlternatives(newAlts);
        setSelectedTo(city);
        setToQuery(city.name);
    }


    // Swap Inputs
    const handleSwap = () => {
        const tempQuery = fromQuery;
        const tempSelected = selectedFrom;
        const tempAlts = fromAlternatives;

        setFromQuery(toQuery);
        setSelectedFrom(selectedTo);
        setFromAlternatives(toAlternatives);

        setToQuery(tempQuery);
        setSelectedTo(tempSelected);
        setToAlternatives(tempAlts);
    };

    // Main Bus Search
    const handleSearch = useCallback(async () => {
        if (!selectedFrom || !selectedTo || !date) return;

        const cacheKey = `${selectedFrom.id}-${selectedTo.id}-${date}`;

        // Instant load from cache
        if (resultsCache.current[cacheKey]) {
            setBuses(resultsCache.current[cacheKey]);
            setHasSearched(true);
            return;
        }

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
                resultsCache.current[cacheKey] = results;
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
    }, [selectedFrom, selectedTo, date]);

    // Auto-Search Effect
    useEffect(() => {
        if (selectedFrom && selectedTo && date) {
            handleSearch();
        }
    }, [selectedFrom, selectedTo, date, handleSearch]);


    // Auto-search from URL params and auto-select top suggestion
    useEffect(() => {
        const sParam = searchParams.get("source");
        const dParam = searchParams.get("destination");

        const sanitize = (str) => str ? str.split(',')[0].trim() : "";
        const cleanFrom = sanitize(sParam);
        const cleanTo = sanitize(dParam);

        if (cleanFrom && !selectedFrom) {
            setFromQuery(cleanFrom);
            // Auto-select the first result when loading from URL
            searchCities(cleanFrom, setFromOptions, setIsSearchingFrom, (city) => {
                setSelectedFrom(city);
                setFromQuery(city.name);
            });
        }
        if (cleanTo && !selectedTo) {
            setToQuery(cleanTo);
            // Auto-select the first result when loading from URL
            searchCities(cleanTo, setToOptions, setIsSearchingTo, (city) => {
                setSelectedTo(city);
                setToQuery(city.name);
            });
        }
    }, []);

    const BookLink = ({ from, to, date }) => {
        if (!from || !to || !date) return <button className="btn btn-sm btn-disabled w-full">Select Details</button>;

        // Format date to DD-MM-YYYY for AbhiBus URL
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}-${month}-${year}`;

        const url = `https://www.abhibus.com/bus_search/${from.name}/${from.id}/${to.name}/${to.id}/${formattedDate}/O`;

        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary w-full"
            >
                Book Now
            </a>
        );
    };

    return (
        <div className="bg-base-200 min-h-screen text-base-content">
            <div className="space-y-8 max-w-5xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Book Bus Tickets</h1>
                    <p className="text-base-content/60">Find and book bus tickets online (Powered by AbhiBus)</p>
                </div>

                {/* Search Interface */}
                <div className="card bg-base-100 shadow-xl border border-base-200 p-6 z-20 overflow-visible">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 items-start relative">

                        {/* From Input */}
                        <div className="form-control relative w-full" style={{ minHeight: '120px' }}>
                            <label className="label">
                                <span className="label-text font-semibold">From</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={fromQuery}
                                    onChange={handleFromChange}
                                    onFocus={handleFromFocus}
                                    onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                                    placeholder="Enter City (e.g. Hyderabad)"
                                    className="input input-bordered w-full pl-10 focus:input-primary"
                                />
                                <div className="absolute left-3 top-3">
                                    <Bus className="w-5 h-5 text-base-content/50" />
                                </div>
                                {isSearchingFrom && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                            </div>

                            {/* Alternatives Chips */}
                            {fromAlternatives.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {fromAlternatives.slice(0, 3).map((alt) => (
                                        <button
                                            key={alt.id}
                                            onClick={() => selectFromAlternative(alt)}
                                            className="badge badge-outline badge-sm hover:badge-primary cursor-pointer transition-colors"
                                        >
                                            {alt.name}
                                        </button>
                                    ))}
                                </div>
                            )}


                            <AnimatePresence>
                                {fromOptions.length > 0 && showFromDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                        style={{ top: '80px' }}
                                    >
                                        {fromOptions.map((city, index) => (
                                            <button
                                                key={city.id ? `from-${city.id}-${index}` : index}
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
                            <button
                                type="button"
                                onClick={() => {
                                    // Don't fully clear, just re-trigger dropdown to show options?
                                    // Or just let them type.
                                    // User said "choose alternative source".
                                    // Let's make it just focus the input.
                                    setSelectedFrom(null); // Clear selection to allow typing
                                    // But keep query?
                                    // setFromQuery(""); // clearing query makes sense if they want to change
                                    setShowFromDropdown(true);
                                }}
                                className="btn btn-sm btn-link text-info no-underline hover:underline p-0 h-auto min-h-0 mt-2 self-start"
                            >
                                Choose alternative source
                            </button>
                        </div>

                        {/* Swap Button */}
                        <div className="hidden md:flex items-center justify-center self-center mt-[-22px]" style={{ paddingTop: '-20px' }}>
                            <button onClick={handleSwap} className="btn btn-circle btn-primary btn-sm shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </button>
                        </div>
                        {/* Mobile Swap Button */}
                        <div className="flex md:hidden items-center justify-center w-full">
                            <button onClick={handleSwap} className="btn btn-circle btn-primary btn-sm shadow-lg rotate-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </button>
                        </div>

                        {/* To Input */}
                        <div className="form-control relative w-full" style={{ minHeight: '120px' }}>
                            <label className="label">
                                <span className="label-text font-semibold">To</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={toQuery}
                                    onChange={handleToChange}
                                    onFocus={handleToFocus}
                                    onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                                    placeholder="Enter City (e.g. Bangalore)"
                                    className="input input-bordered w-full pl-10 focus:input-primary"
                                />
                                <div className="absolute left-3 top-3">
                                    <MapPin className="w-5 h-5 text-base-content/50" />
                                </div>
                                {isSearchingTo && <span className="loading loading-spinner loading-xs absolute right-3 top-3 text-primary"></span>}
                            </div>

                            {/* Alternatives Chips */}
                            {toAlternatives.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {toAlternatives.slice(0, 3).map((alt) => (
                                        <button
                                            key={alt.id}
                                            onClick={() => selectToAlternative(alt)}
                                            className="badge badge-outline badge-sm hover:badge-primary cursor-pointer transition-colors"
                                        >
                                            {alt.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <AnimatePresence>
                                {toOptions.length > 0 && showToDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 p-2 bg-base-100 rounded-xl shadow-2xl border border-base-200 max-h-60 overflow-y-auto z-50 grid gap-1"
                                        style={{ top: '80px' }}
                                    >
                                        {toOptions.map((city, index) => (
                                            <button
                                                key={city.id ? `to-${city.id}-${index}` : index}
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
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedTo(null);
                                    // setToQuery(""); 
                                    setShowToDropdown(true);
                                }}
                                className="btn btn-sm btn-link text-info no-underline hover:underline p-0 h-auto min-h-0 mt-2 self-start"
                            >
                                Choose alternative destination
                            </button>
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
                    {/* Search Button Removed */}
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

                        {sortedBuses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {sortedBuses.map((bus) => (
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
                                                    <div className="flex items-center text-primary/50">
                                                        <span className="h-[2px] w-8 bg-current"></span>
                                                        <ArrowRight className="w-4 h-4 ml-[-2px]" />
                                                    </div>
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
                                            <BookLink from={selectedFrom} to={selectedTo} date={date} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !loading && (
                                <div className="text-center py-12 bg-base-100 rounded-2xl border border-dashed border-base-300">
                                    <div className="flex justify-center mb-4">
                                        <Bus className="w-16 h-16 text-base-content/20" />
                                    </div>
                                    <h3 className="text-xl font-bold">No buses found</h3>
                                    <p className="text-base-content/60 max-w-md mx-auto mt-2">
                                        {loading ? "Searching..." : "We couldn't find any buses between these cities for the selected date. Try changing the date or route."}
                                    </p>
                                </div>
                            )
                        )}

                        {error && (
                            <div className="alert alert-error">
                                <AlertCircle className="w-6 h-6 stroke-current shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                )}

            </div>
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
