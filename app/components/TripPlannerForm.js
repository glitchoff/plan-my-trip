"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import dynamic from 'next/dynamic';

// Dynamically import RouteMap with no SSR to avoid Leaflet window errors
const RouteMap = dynamic(() => import('./RouteMap'), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-base-200 animate-pulse rounded-xl"></div>
});

export default function TripPlannerForm() {
    const { t } = useLanguage();
    const router = useRouter();

    // Form Inputs
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState(1);

    // Coordinates for Map
    const [sourceCoords, setSourceCoords] = useState(null); // { lat, lon, name }
    const [destinationCoords, setDestinationCoords] = useState(null); // { lat, lon, name }

    // Autocomplete State
    const [sourceSuggestions, setSourceSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null); // 'source' or 'destination'
    const [loading, setLoading] = useState(false);

    // Click outside to close suggestions
    const formRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setActiveField(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch suggestions from internal API
    const fetchSuggestions = async (query, type) => {
        if (!query || query.length < 3) {
            if (type === 'source') setSourceSuggestions([]);
            if (type === 'destination') setDestinationSuggestions([]);
            return;
        }

        try {
            const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&type=autocomplete`);
            const data = await res.json();

            if (data.features) {
                if (type === 'source') setSourceSuggestions(data.features);
                if (type === 'destination') setDestinationSuggestions(data.features);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    // Debounce helper
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeField === 'source') fetchSuggestions(source, 'source');
            if (activeField === 'destination') fetchSuggestions(destination, 'destination');
        }, 300);

        return () => clearTimeout(timer);
    }, [source, destination, activeField]);

    const handleSelectSuggestion = (feature, type) => {
        const name = feature.properties.formatted;
        const coords = {
            lat: feature.properties.lat,
            lon: feature.properties.lon,
            name: feature.properties.city || feature.properties.name || name
        };

        if (type === 'source') {
            setSource(name);
            setSourceSuggestions([]);
            setSourceCoords(coords);
        } else {
            setDestination(name);
            setDestinationSuggestions([]);
            setDestinationCoords(coords);
        }
        setActiveField(null);
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
            // Pass coordinates if available to avoid re-geocoding on results page
            ...(sourceCoords && { fromLat: sourceCoords.lat, fromLon: sourceCoords.lon }),
            ...(destinationCoords && { toLat: destinationCoords.lat, toLon: destinationCoords.lon }),
        });

        // Navigate to results page
        router.push(`/results?${params.toString()}`);
    };

    return (
        <div ref={formRef} className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-xl border border-base-200 p-2 md:p-4">
            <form onSubmit={handlePlanTrip} className="flex flex-col gap-6 relative z-10">
                {/* Row 1: Locations */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Source Input */}
                    <div className="relative flex-1 w-full z-20">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            📍
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all"
                            placeholder={t('whereFrom')}
                            value={source}
                            onChange={(e) => {
                                setSource(e.target.value);
                                setActiveField('source');
                            }}
                            onFocus={() => setActiveField('source')}
                            required
                        />
                        {/* Suggestions Dropdown */}
                        {activeField === 'source' && sourceSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 bg-base-100 border border-base-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto z-50">
                                {sourceSuggestions.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="p-3 hover:bg-base-200 cursor-pointer flex items-center gap-2 border-b border-base-200 last:border-0"
                                        onClick={() => handleSelectSuggestion(feature, 'source')}
                                    >
                                        <span className="text-lg">📍</span>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{feature.properties.address_line1}</span>
                                            <span className="text-xs text-base-content/60">{feature.properties.address_line2}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="hidden md:block text-base-content/30">➜</div>

                    {/* Destination Input */}
                    <div className="relative flex-1 w-full z-20">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            🗺️
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all"
                            placeholder={t('whereTo')}
                            value={destination}
                            onChange={(e) => {
                                setDestination(e.target.value);
                                setActiveField('destination');
                            }}
                            onFocus={() => setActiveField('destination')}
                            required
                        />
                        {/* Suggestions Dropdown */}
                        {activeField === 'destination' && destinationSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 bg-base-100 border border-base-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto z-50">
                                {destinationSuggestions.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="p-3 hover:bg-base-200 cursor-pointer flex items-center gap-2 border-b border-base-200 last:border-0"
                                        onClick={() => handleSelectSuggestion(feature, 'destination')}
                                    >
                                        <span className="text-lg">🏁</span>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{feature.properties.address_line1}</span>
                                            <span className="text-xs text-base-content/60">{feature.properties.address_line2}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Row 2: Date, Duration, Submit */}
                <div className="flex flex-col md:flex-row gap-4 items-center z-10">
                    <div className="relative flex-1 w-full" onClick={() => document.getElementById('dateInput')?.showPicker()}>
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
                            onChange={(e) => {
                                const val = e.target.value;
                                setDuration(val === "" ? "" : parseInt(val));
                            }}
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

            <RouteMap source={sourceCoords} destination={destinationCoords} />
        </div>
    );
}
