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
        router.push(`/results/bus?${params.toString()}`);
    };

    return (
        <div ref={formRef} className="max-w-5xl mx-auto bg-base-100/90 backdrop-blur-md rounded-2xl shadow-xl border border-base-200 p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column - Compact Form */}
                <div className="flex flex-col justify-center">
                    <form onSubmit={handlePlanTrip} className="flex flex-col gap-2 relative z-10">
                        {/* Source Input */}
                        <div className="relative w-full z-30">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                                    📍
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10 h-12 bg-base-200/50 focus:bg-base-100 transition-all text-sm"
                                    placeholder={t('whereFrom')}
                                    value={source}
                                    onChange={(e) => {
                                        setSource(e.target.value);
                                        setActiveField('source');
                                    }}
                                    onFocus={() => setActiveField('source')}
                                    required
                                />
                            </div>
                            {activeField === 'source' && sourceSuggestions.length > 0 && (
                                <ul className="absolute top-full left-0 right-0 bg-base-100/95 backdrop-blur-lg border-2 border-primary/20 rounded-xl shadow-2xl mt-2 max-h-48 overflow-y-auto z-[100]">
                                    {sourceSuggestions.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="p-3 hover:bg-primary/10 cursor-pointer text-sm border-b border-base-200 last:border-0 transition-colors"
                                            onClick={() => handleSelectSuggestion(feature, 'source')}
                                        >
                                            {feature.properties.formatted}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Destination Input */}
                        <div className="relative w-full z-10">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                                    🏁
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10 h-12 bg-base-200/50 focus:bg-base-100 transition-all text-sm"
                                    placeholder={t('whereTo')}
                                    value={destination}
                                    onChange={(e) => {
                                        setDestination(e.target.value);
                                        setActiveField('destination');
                                    }}
                                    onFocus={() => setActiveField('destination')}
                                    required
                                />
                            </div>
                            {activeField === 'destination' && destinationSuggestions.length > 0 && (
                                <ul className="absolute top-full left-0 right-0 bg-base-100/95 backdrop-blur-lg border-2 border-primary/20 rounded-xl shadow-2xl mt-2 max-h-48 overflow-y-auto z-[100]">
                                    {destinationSuggestions.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="p-3 hover:bg-primary/10 cursor-pointer text-sm border-b border-base-200 last:border-0 transition-colors"
                                            onClick={() => handleSelectSuggestion(feature, 'destination')}
                                        >
                                            {feature.properties.formatted}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Date & Days Row */}
                        <div className="flex gap-2">
                            <div className="relative flex-1" onClick={() => document.getElementById('dateInput')?.showPicker()}>
                                <input
                                    id="dateInput"
                                    type="date"
                                    className="input input-bordered w-full h-12 bg-base-200/50 focus:bg-base-100 transition-all text-sm cursor-pointer"
                                    value={travelDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative w-20">
                                <input
                                    type="number"
                                    min="1"
                                    className="input input-bordered w-full h-12 bg-base-200/50 focus:bg-base-100 transition-all text-sm text-center"
                                    placeholder="Days"
                                    value={duration}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setDuration(val === "" ? "" : parseInt(val));
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Go Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full h-12 rounded-xl shadow-md text-base"
                        >
                            {loading ? '...' : 'Go →'}
                        </button>
                    </form>
                </div>

                {/* Right Column - Rectangular Map */}
                <div className="flex items-center justify-center h-full">
                    <div className="w-full h-full min-h-[250px] rounded-xl overflow-hidden border border-base-200 shadow-sm">
                        <RouteMap source={sourceCoords} destination={destinationCoords} />
                    </div>
                </div>
            </div>
        </div>
    );
}
