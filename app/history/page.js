"use client";
import BackgroundSlider from "../components/BackgroundSlider";
import { useState, useEffect } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";

export default function History() {
    const { isAuthenticated, isLoading: authLoading, user } = useAuthProtection();

    const [trips, setTrips] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    // Fetch trips from API
    useEffect(() => {
        const fetchTrips = async () => {
            if (isAuthenticated && user) {
                try {
                    const res = await fetch('/api/supabase/history');
                    if (res.ok) {
                        const data = await res.json();
                        setTrips(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch history", error);
                } finally {
                    setIsLoadingItems(false);
                }
            } else if (!authLoading && !isAuthenticated) {
                setIsLoadingItems(false);
            }
        };

        fetchTrips();
    }, [isAuthenticated, user, authLoading]);

    const handleEditClick = (trip) => {
        setEditingId(trip.id);
        setEditText(trip.review || "");
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditText("");
    };

    const handleSaveClick = async (id) => {
        // Optimistic update
        const previousTrips = [...trips];
        const updatedTrips = trips.map(trip =>
            trip.id === id ? { ...trip, review: editText } : trip
        );
        setTrips(updatedTrips);
        setEditingId(null);

        try {
            const res = await fetch('/api/supabase/history', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    review: editText
                })
            });

            if (!res.ok) {
                throw new Error("Failed to save review");
            }
        } catch (error) {
            console.error("Failed to save review", error);
            setTrips(previousTrips); // Revert on error
            alert("Failed to save review. Please try again.");
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen pt-20 bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen pt-20 pb-16 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-6xl animate-fade-in-up hover:scale-105 transition-transform duration-200 cursor-default">
                        My Past Trips
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-base-content/70 animate-fade-in-up delay-100 hover:scale-105 transition-transform duration-200 cursor-default">
                        Relive your travel memories and adventures.
                    </p>
                </div>

                <div className="bg-base-100/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
                    {isLoadingItems ? (
                        <div className="flex justify-center py-20">
                            <span className="loading loading-spinner loading-md text-primary"></span>
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-base-content/60 text-lg">No past trips found.</p>
                            <p className="text-sm text-base-content/40 mt-2">Book a trip to see it here!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {trips.map((trip) => {
                                // Parse itinerary to get search params
                                let searchParams = "";
                                try {
                                    if (trip.itinerary) {
                                        // If it's already an object (which it should be for jsonb), use it directly.
                                        // If it's a string (legacy or double encoded), parse it.
                                        const itineraryData = typeof trip.itinerary === 'string'
                                            ? JSON.parse(trip.itinerary)
                                            : trip.itinerary;

                                        // filter out any non-string/number/boolean values to be safe for URLSearchParams
                                        const cleanParams = Object.entries(itineraryData || {})
                                            .filter(([_, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
                                            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

                                        searchParams = new URLSearchParams(cleanParams).toString();
                                    }
                                } catch (e) {
                                    console.error("Failed to parse itinerary", e);
                                }

                                return (
                                    <div key={trip.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                                        <div className="md:w-72 h-48 md:h-64 relative shrink-0">
                                            <img
                                                src={trip.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000"}
                                                alt={trip.destination}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-2xl font-bold text-gray-900">{trip.destination}</h3>
                                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                        {trip.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 mb-1">📅 {new Date(trip.start_date || trip.created_at).toLocaleDateString()}</p>
                                                <p className="text-gray-500">💰 Total Cost: ${trip.total_cost || 0}</p>

                                                {editingId === trip.id ? (
                                                    <div className="mt-3">
                                                        <textarea
                                                            className="textarea textarea-bordered w-full text-base-content bg-white"
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            rows={3}
                                                            autoFocus
                                                        />
                                                    </div>
                                                ) : (
                                                    trip.review && (
                                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 italic text-gray-600 text-sm">
                                                            "{trip.review}"
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div className="mt-2 flex justify-end gap-3">
                                                {editingId === trip.id ? (
                                                    <>
                                                        <button
                                                            onClick={handleCancelClick}
                                                            className="text-red-500 font-semibold hover:text-red-700 text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveClick(trip.id)}
                                                            className="text-green-600 font-semibold hover:text-green-800 text-sm"
                                                        >
                                                            Save
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(trip)}
                                                            className="text-gray-600 font-semibold hover:text-gray-900 text-sm"
                                                        >
                                                            Edit Review ✍️
                                                        </button>
                                                        {searchParams && (
                                                            <a
                                                                href={`/results/bus?${searchParams}`}
                                                                className="text-blue-600 font-semibold hover:text-blue-800 text-sm flex items-center gap-1"
                                                            >
                                                                View Deal &rarr;
                                                            </a>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
