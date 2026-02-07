"use client";

import { useState, useEffect, useRef } from "react";

export default function BusDemoPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        fromCityName: "Delhi",
        fromCityId: "344",
        toCityName: "Una",
        toCityId: "2150",
        date: formatDate(new Date()),
        busType: "Any",
    });

    function formatDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(date.getDate()).padStart(2, "0");
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const params = new URLSearchParams(formData);
            const response = await fetch(`/bus?${params}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "API request failed");
            }

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCitySelect = (type, city) => {
        if (type === "from") {
            setFormData(prev => ({
                ...prev,
                fromCityName: city.name,
                fromCityId: city.id
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                toCityName: city.name,
                toCityId: city.id
            }));
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">🚌 Bus API Tester</h1>
                <p className="text-base-content/70">Test the AbhiBus API integration with real-time data</p>
            </div>

            <div className="card bg-base-100 shadow-xl mb-8 border border-base-200">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">From City</span>
                                </label>
                                <AutocompleteInput
                                    value={formData.fromCityName}
                                    onSelect={(city) => handleCitySelect("from", city)}
                                    placeholder="Search departure city..."
                                />
                                <label className="label">
                                    <span className="label-text-alt text-xs text-base-content/50">ID: {formData.fromCityId}</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">To City</span>
                                </label>
                                <AutocompleteInput
                                    value={formData.toCityName}
                                    onSelect={(city) => handleCitySelect("to", city)}
                                    placeholder="Search destination city..."
                                />
                                <label className="label">
                                    <span className="label-text-alt text-xs text-base-content/50">ID: {formData.toCityId}</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Date</span>
                                </label>
                                <input
                                    type="text"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    placeholder="e.g., 08-Feb-2026"
                                />
                                <label className="label">
                                    <span className="label-text-alt text-xs">Format: DD-MMM-YYYY</span>
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Bus Type</span>
                                </label>
                                <select
                                    name="busType"
                                    value={formData.busType}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="Any">Any</option>
                                    <option value="AC">AC</option>
                                    <option value="Non-AC">Non-AC</option>
                                    <option value="Sleeper">Sleeper</option>
                                    <option value="Seater">Seater</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-control mt-6">
                            <button type="submit" disabled={loading} className="btn btn-primary w-full">
                                {loading ? <span className="loading loading-spinner"></span> : "🔍 Search Buses"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div role="alert" className="alert alert-error mb-8 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-lg border border-base-200">
                        <div className="card-body">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="card-title text-2xl">
                                        {result.route.from} <span className="text-primary mx-2">→</span> {result.route.to}
                                    </h2>
                                    <p className="text-base-content/70 mt-1">
                                        📅 {result.route.date} • {result.totalBuses} buses found
                                    </p>
                                </div>
                                <div className="badge badge-outline p-3">
                                    Fetched at {new Date(result.scrapedAt).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {result.buses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {result.buses.map((bus, idx) => (
                                <div key={bus.id || idx} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200">
                                    <div className="card-body p-6">
                                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                                            {/* Left Logic: Operator & Time */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-lg">{bus.operatorName}</h3>
                                                    {bus.rating.score > 0 && (
                                                        <div className="badge badge-success gap-1 text-white">
                                                            {bus.rating.score} <span className="text-xs">★</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-base-content/60 uppercase tracking-wide mb-4">{bus.busType}</p>

                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <div className="text-xl font-bold">{bus.departure.time}</div>
                                                        <div className="text-xs text-base-content/70 truncate max-w-[150px]" title={bus.departure.place}>
                                                            {bus.departure.place || "Bus Stand"}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center flex-1 px-4">
                                                        <div className="text-xs text-base-content/50 mb-1">{bus.duration}</div>
                                                        <div className="w-full h-px bg-base-300 relative flex items-center justify-center">
                                                            <div className="absolute text-base-300">→</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xl font-bold">{bus.arrival.time}</div>
                                                        <div className="text-xs text-base-content/70 truncate max-w-[150px]" title={bus.arrival.place}>
                                                            {bus.arrival.place || "Bus Stand"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Logic: Price & Features */}
                                            <div className="flex flex-row lg:flex-col justify-between items-end lg:items-end lg:w-48 lg:border-l lg:border-base-200 lg:pl-6">
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary">₹{bus.pricing.finalPrice}</div>
                                                    {bus.pricing.originalPrice > bus.pricing.finalPrice && (
                                                        <div className="text-sm line-through text-base-content/50">₹{bus.pricing.originalPrice}</div>
                                                    )}
                                                    <div className={`text-sm mt-1 font-medium ${bus.availableSeats < 5 ? 'text-error' : 'text-success'}`}>
                                                        {bus.availableSeats} seats left
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    {bus.features.liveTracking && <div className="tooltip" data-tip="Live Tracking">📡</div>}
                                                    {bus.features.ac && <div className="tooltip" data-tip="AC">❄️</div>}
                                                    {bus.features.sleeper && <div className="tooltip" data-tip="Sleeper">🛌</div>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer: Tags/Route */}
                                        {(bus.viaRoute || bus.features.tags.length > 0) && (
                                            <div className="mt-4 pt-4 border-t border-base-200 flex flex-wrap gap-2 text-xs">
                                                {bus.viaRoute && (
                                                    <span className="text-base-content/60 mr-2">
                                                        Route: {bus.viaRoute}
                                                    </span>
                                                )}
                                                {bus.features.tags.map((tag, i) => (
                                                    <span key={i} className="badge badge-ghost badge-sm">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>No buses found for this route. Try changing the date or cities.</span>
                        </div>
                    )}

                    <div className="collapse collapse-arrow bg-base-100 border border-base-200 rounded-box">
                        <input type="checkbox" />
                        <div className="collapse-title text-xl font-medium">
                            📄 Raw JSON Response
                        </div>
                        <div className="collapse-content">
                            <pre className="bg-neutral text-neutral-content p-4 rounded-lg overflow-auto max-h-96 text-xs">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AutocompleteInput({ value, onSelect, placeholder }) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const timeoutRef = useRef(null);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            if (val.length > 2) {
                try {
                    const res = await fetch(`/api/bus/city-search?q=${encodeURIComponent(val)}`);
                    const data = await res.json();
                    if (data.success) {
                        setSuggestions(data.results);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error("Autocomplete error:", err);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
    };

    const handleSelect = (city) => {
        setQuery(city.name);
        onSelect(city);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => query.length > 2 && setShowSuggestions(true)}
                className="input input-bordered w-full"
                placeholder={placeholder}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 menu bg-base-100 p-2 rounded-box shadow-xl border border-base-200 max-h-60 overflow-y-auto">
                    {suggestions.map((city) => (
                        <li key={city.id}>
                            <button
                                type="button"
                                onClick={() => handleSelect(city)}
                                className="flex flex-col items-start gap-0 py-2"
                            >
                                <span className="font-bold">{city.name}</span>
                                <span className="text-xs text-base-content/60">{city.subtext}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
