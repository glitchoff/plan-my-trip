"use client";
import BackgroundSlider from "../components/BackgroundSlider";
import { useState, useEffect } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";

export default function History() {
    const { isAuthenticated, isLoading } = useAuthProtection();

    // Initial Mock Data
    const initialTrips = [
        {
            id: 1,
            destination: "Paris, France",
            date: "Oct 12, 2025",
            status: "Completed",
            totalCost: 1250,
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000",
            review: "Absolutely magical! The Eiffel Tower at night was breathtaking."
        },
        {
            id: 2,
            destination: "Tokyo, Japan",
            date: "Aug 05, 2025",
            status: "Completed",
            totalCost: 2100,
            image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1000",
            review: "The food was incredible. Ramen in Shinjuku is a must-try."
        },
        {
            id: 3,
            destination: "London, UK",
            date: "Jul 15, 2025",
            status: "Completed",
            totalCost: 1800,
            image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1000",
            review: "Loved the history and the museums. The British Museum was vast."
        },
        {
            id: 4,
            destination: "Sydney, Australia",
            date: "May 20, 2025",
            status: "Completed",
            totalCost: 2300,
            image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1000",
            review: "The Opera House is even more stunning in person. Great beaches too."
        },
        {
            id: 5,
            destination: "Dubai, UAE",
            date: "Mar 10, 2025",
            status: "Completed",
            totalCost: 1500,
            image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1000",
            review: "The scale of everything is mind-blowing. The Burj Khalifa view is unmatched."
        },
    ];

    const [trips, setTrips] = useState(initialTrips);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    // Load from localStorage on mount
    useEffect(() => {
        const savedReviewData = localStorage.getItem("myTripsReviews");
        if (savedReviewData) {
            try {
                const reviews = JSON.parse(savedReviewData);
                setTrips(prevTrips => prevTrips.map(trip => ({
                    ...trip,
                    review: reviews[trip.id] || trip.review
                })));
            } catch (e) {
                console.error("Failed to parse saved reviews", e);
            }
        }
    }, []);

    const handleEditClick = (trip) => {
        setEditingId(trip.id);
        setEditText(trip.review || "");
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditText("");
    };

    const handleSaveClick = (id) => {
        const updatedTrips = trips.map(trip => 
            trip.id === id ? { ...trip, review: editText } : trip
        );
        setTrips(updatedTrips);
        setEditingId(null);

        // Save to localStorage
        const reviewsToSave = updatedTrips.reduce((acc, trip) => {
            acc[trip.id] = trip.review;
            return acc;
        }, {});
        localStorage.setItem("myTripsReviews", JSON.stringify(reviewsToSave));
    };

    if (isLoading) {
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
        <div className="min-h-screen pt-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-base-100/80 backdrop-blur-md rounded-2xl shadow-lg mt-4">
                <h1 className="text-3xl font-bold text-base-content mb-8">My Past Trips</h1>

                <div className="space-y-4">
                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                            <div className="md:w-72 h-48 md:h-64 relative shrink-0">
                                <img src={trip.image} alt={trip.destination} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900">{trip.destination}</h3>
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            {trip.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 mb-1">📅 {trip.date}</p>
                                    <p className="text-gray-500">💰 Total Cost: ${trip.totalCost}</p>
                                    
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
                                            <button className="text-blue-600 font-semibold hover:text-blue-800 text-sm">
                                                View Itinerary &rarr;
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
