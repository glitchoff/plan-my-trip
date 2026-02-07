"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function TripPlannerForm() {
    const { t } = useLanguage();
    const router = useRouter();
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState(1);
    const [loading, setLoading] = useState(false);

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
        });

        // Navigate to results page
        router.push(`/results?${params.toString()}`);
    };

    return (
        <div className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-xl border border-base-200 p-2 md:p-4">
            <form onSubmit={handlePlanTrip} className="flex flex-col gap-6">
                {/* Row 1: Locations */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            📍
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all"
                            placeholder={t('whereFrom')}
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            required
                        />
                    </div>
                    <div className="hidden md:block text-base-content/30">➜</div>
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            🗺️
                        </div>
                        <input
                            type="text"
                            className="input input-bordered w-full pl-10 h-14 bg-base-200 focus:bg-base-100 transition-all"
                            placeholder={t('whereTo')}
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Row 2: Date, Duration, Submit */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
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
        </div>
    );
}
