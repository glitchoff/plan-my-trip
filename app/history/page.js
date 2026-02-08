"use client";
import BackgroundSlider from "../components/BackgroundSlider";
import { useState, useEffect } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";
import { MapPin, Calendar, Clock, ArrowRight, Wallet, ExternalLink } from "lucide-react";

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
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl">
                        Your Travel Journal
                    </h1>
                    <p className="mt-4 text-lg text-base-content/70 max-w-2xl mx-auto">
                        Track your adventures, reviews, and future plans all in one place.
                    </p>
                </div>

                <div className="bg-base-100 rounded-3xl p-4 md:p-8">
                    {isLoadingItems ? (
                        <div className="flex justify-center py-20">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-base-300 rounded-2xl">
                            <MapPin className="w-12 h-12 text-base-content/20 mx-auto mb-4" />
                            <p className="text-base-content/60 text-lg font-medium">No trips saved yet.</p>
                            <p className="text-sm text-base-content/40 mt-1">Start planning your next getaway!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip) => {
                                // Parse itinerary details
                                let itineraryData = {};
                                let searchParams = "";

                                try {
                                    if (trip.itinerary) {
                                        itineraryData = typeof trip.itinerary === 'string'
                                            ? JSON.parse(trip.itinerary)
                                            : trip.itinerary;

                                        const cleanParams = Object.entries(itineraryData || {})
                                            .filter(([_, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
                                            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

                                        searchParams = new URLSearchParams(cleanParams).toString();
                                    }
                                } catch (e) {
                                    console.error("Failed to parse itinerary", e);
                                }

                                const source = itineraryData.source?.split(',')[0] || "Origin";
                                const destination = trip.destination || itineraryData.destination?.split(',')[0];
                                const date = itineraryData.date || trip.start_date;
                                const duration = itineraryData.duration;

                                return (
                                    <div key={trip.id} className="group bg-base-100 border border-base-200 hover:border-primary/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                                        {/* Card Header / Image Area */}
                                        <div className="relative h-48 overflow-hidden bg-base-200">
                                            <img
                                                src={trip.image_url || `https://source.unsplash.com/800x600/?${encodeURIComponent(destination)},travel`}
                                                alt={destination}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000";
                                                }}
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className={`badge ${trip.status === 'Completed' ? 'badge-neutral' : 'badge-primary'} shadow-lg font-medium`}>
                                                    {trip.status}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                <div className="text-white font-bold text-xl flex items-center gap-2">
                                                    <span className="truncate max-w-[45%]">{source}</span>
                                                    <ArrowRight className="w-5 h-5 flex-shrink-0" />
                                                    <span className="truncate max-w-[45%]">{destination}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-3 text-sm text-base-content/70">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span>{date ? new Date(date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not set'}</span>
                                                </div>
                                                {duration && (
                                                    <div className="flex items-center gap-3 text-sm text-base-content/70">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        <span>{duration} Day{duration > 1 ? 's' : ''} trip</span>
                                                    </div>
                                                )}
                                                {trip.total_cost > 0 && (
                                                    <div className="flex items-center gap-3 text-sm text-base-content/70">
                                                        <Wallet className="w-4 h-4 text-primary" />
                                                        <span>${trip.total_cost} spent</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Review Section */}
                                            <div className="bg-base-200/50 rounded-xl p-3 mb-4 flex-1">
                                                {editingId === trip.id ? (
                                                    <textarea
                                                        className="textarea textarea-ghost w-full h-full focus:bg-base-100 text-sm resize-none p-1"
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        placeholder="Write your memory here..."
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <p className={`text-sm ${trip.review ? 'text-base-content/80' : 'text-base-content/40 italic'}`}>
                                                        {trip.review || "No personal notes added yet..."}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-base-200">
                                                {editingId === trip.id ? (
                                                    <div className="flex gap-2 w-full">
                                                        <button
                                                            onClick={() => handleSaveClick(trip.id)}
                                                            className="btn btn-sm btn-primary flex-1"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelClick}
                                                            className="btn btn-sm btn-ghost flex-1"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(trip)}
                                                            className="btn btn-sm btn-ghost text-xs hover:bg-base-200"
                                                        >
                                                            {trip.review ? 'Edit Note' : 'Add Note'}
                                                        </button>

                                                        {searchParams && (
                                                            <a
                                                                href={`/results/bus?${searchParams}`}
                                                                className="btn btn-sm btn-outline btn-primary gap-2"
                                                            >
                                                                Re-Plan
                                                                <ExternalLink className="w-3 h-3" />
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
