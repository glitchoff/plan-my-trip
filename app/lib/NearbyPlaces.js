"use client";

import { useState, useEffect } from "react";
import { MapPin, Star, ExternalLink, Coffee, Hotel, Utensils, Camera, Loader2 } from "lucide-react";

const CATEGORY_ICONS = {
    "accommodation.hotel": Hotel,
    "catering.restaurant": Utensils,
    "catering.cafe": Coffee,
    "tourism": Camera,
    "entertainment": Star,
};

export default function NearbyPlaces({ destination, lat, lon, radius = 5000 }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("tourism");
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const categories = [
        { id: "tourism", label: "Attractions", icon: Camera },
        { id: "catering.restaurant", label: "Restaurants", icon: Utensils },
        { id: "catering.cafe", label: "Cafes", icon: Coffee },
        { id: "accommodation.hotel", label: "Hotels", icon: Hotel },
        { id: "entertainment", label: "Entertainment", icon: Star },
    ];

    useEffect(() => {
        const fetchPlaces = async () => {
            if (!lat || !lon) return;

            setLoading(true);
            try {
                const filter = `circle:${lon},${lat},${radius}`;
                const response = await fetch(
                    `/api/places?categories=${selectedCategory}&filter=${encodeURIComponent(filter)}&limit=10`
                );
                const data = await response.json();
                setPlaces(data.features || []);
            } catch (error) {
                console.error("Failed to fetch places:", error);
                setPlaces([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, [lat, lon, radius, selectedCategory]);

    const handlePlaceClick = async (place) => {
        setSelectedPlace(place);
        setPlaceDetails(null);
        setDetailsLoading(true);

        // Open modal immediately
        document.getElementById('place_details_modal').showModal();

        try {
            const placeId = place.properties.place_id;
            if (!placeId) throw new Error("No place ID");

            const res = await fetch(`/api/placedetails?id=${placeId}`);
            if (!res.ok) throw new Error("Failed to fetch details");
            
            const data = await res.json();
            setPlaceDetails(data.features?.[0]?.properties || {});
        } catch (err) {
            console.error("Error fetching details:", err);
            // Fallback to existing properties if fetch fails
            setPlaceDetails(place.properties); 
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <section className="py-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
                <MapPin className="w-6 h-6 text-primary" />
                Explore {destination}
            </h2>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-base-200 text-base-content/70 hover:bg-base-300"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Places Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                     <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : places.length === 0 ? (
                <div className="text-center py-12 text-base-content/60">
                    No places found in this category
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {places.map((place, idx) => (
                        <div key={place.properties.place_id || idx} onClick={() => handlePlaceClick(place)}>
                            <PlaceCard place={place} />
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            <dialog id="place_details_modal" className="modal">
                <div className="modal-box w-11/12 max-w-3xl p-0 overflow-hidden bg-base-100">
                    {selectedPlace && (
                        <div className="flex flex-col h-full max-h-[85vh]">
                             {/* Header image / map placeholder */}
                            <div className="h-48 bg-primary/10 flex items-center justify-center relative">
                                <MapPin className="w-16 h-16 text-primary/30" />
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-base-100/50 hover:bg-base-100" onClick={() => document.getElementById('place_details_modal').close()}>✕</button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto">
                                <h3 className="text-2xl font-bold mb-1">
                                    {selectedPlace.properties.name || selectedPlace.properties.address_line1}
                                </h3>
                                <p className="text-base-content/60 text-sm mb-4">
                                     {selectedPlace.properties.address_line2}
                                </p>

                                {detailsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : placeDetails ? (
                                    <div className="space-y-4">
                                        {placeDetails.description && (
                                            <div>
                                                <h4 className="font-semibold mb-1">About</h4>
                                                <p className="text-sm">{placeDetails.description}</p>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {placeDetails.website && (
                                                 <div className="flex items-start gap-2">
                                                    <ExternalLink className="w-4 h-4 mt-1 text-primary" />
                                                    <a href={placeDetails.website} target="_blank" rel="noopener noreferrer" className="link link-primary text-sm break-all">
                                                        {placeDetails.website}
                                                    </a>
                                                </div>
                                            )}
                                             {placeDetails.contact?.phone && (
                                                 <div className="flex items-start gap-2">
                                                    <div className="mt-1">📞</div>
                                                    <span className="text-sm">{placeDetails.contact.phone}</span>
                                                </div>
                                            )}
                                             {placeDetails.opening_hours && (
                                                 <div className="flex items-start gap-2">
                                                    <div className="mt-1">🕒</div>
                                                    <span className="text-sm">{placeDetails.opening_hours}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Raw data fallback for debug/richness if description is missing */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {(placeDetails.categories || []).map(cat => (
                                                <span key={cat} className="badge badge-outline badge-sm">{cat.split('.').pop()}</span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p>No additional details available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </section>
    );
}

function PlaceCard({ place }) {
    const { properties } = place;
    // ... existing PlaceCard code ...
    const Icon = CATEGORY_ICONS[properties.categories?.[0]] || MapPin;

    const distance = properties.distance
        ? properties.distance < 1000
            ? `${Math.round(properties.distance)}m`
            : `${(properties.distance / 1000).toFixed(1)}km`
        : null;

    return (
        <div className="group p-4 rounded-xl bg-base-100 border border-base-content/10 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base-content truncate">
                        {properties.name || properties.address_line1}
                    </h3>
                    {distance && (
                        <p className="text-xs text-base-content/60 mt-1">
                            📍 {distance} away
                        </p>
                    )}
                </div>
            </div>

            {properties.address_line2 && (
                <p className="text-sm text-base-content/60 mb-3 line-clamp-2">
                    {properties.address_line2}
                </p>
            )}

            {/* Removed internal links to avoid confusion vs modal */}
        </div>
    );
}
