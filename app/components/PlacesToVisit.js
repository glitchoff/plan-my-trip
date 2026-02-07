"use client";

import { useState, useEffect } from "react";
import { MapPin, Star, Loader2 } from "lucide-react";

export default function PlacesToVisit({
    destinationLat,
    destinationLon,
    destinationName,
    initialPlaces = [],
    categories = "tourism.sights,tourism.attraction,entertainment.culture,religion,building.historic,natural",
    radius = 10000,
    limit = 12
}) {
    const [places, setPlaces] = useState(initialPlaces);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!destinationLat || !destinationLon) {
            setLoading(false);
            return;
        }

        async function fetchPlaces() {
            try {
                setLoading(true);
                setError(null);

                const filter = `circle:${destinationLon},${destinationLat},${radius}`;

                const res = await fetch(
                    `/api/places?categories=${encodeURIComponent(categories)}&filter=${encodeURIComponent(filter)}&limit=${limit}`
                );

                if (!res.ok) throw new Error("Failed to fetch places");

                const data = await res.json();
                const apiPlaces = data.features || [];

                // Filter out duplicates that might overlap with initialPlaces (fuzzy match by name)
                const uniqueApiPlaces = apiPlaces.filter(apiPlace => {
                    const apiName = apiPlace.properties.name?.toLowerCase();
                    if (!apiName) return false;
                    
                    return !initialPlaces.some(initPlace => 
                        initPlace.name.toLowerCase().includes(apiName) || 
                        apiName.includes(initPlace.name.toLowerCase())
                    );
                });
                
                // transform initialPlaces to match API structure implicitly or just combine
                // Since rendering handles properties, we need to ensure structure compatibility or handle both
                
                // Let's standardise the structure for rendering
                // initialPlaces have { name, image, description }
                // apiPlaces have { properties: { name, formatted, ... } }
                
                // We will keep them separate in state or normalize?
                // Easiest is to keep them in a combined list but rendering needs to handle both formats.
                
                // Let's rely on the rendering logic.
                // WE NEED TO ADAPT THE RENDERING LOGIC below to handle both formats.
                
                setPlaces([...initialPlaces, ...uniqueApiPlaces]);

            } catch (err) {
                console.error("Error fetching places:", err);
                setError(err.message);
                // Fallback to just initial places if API fails
                setPlaces(initialPlaces);
            } finally {
                setLoading(false);
            }
        }

        fetchPlaces();
    }, [destinationLat, destinationLon, radius, categories, limit, initialPlaces]);

    if (!destinationLat || !destinationLon && initialPlaces.length === 0) {
        return null;
    }

    const getCategoryLabel = (categories) => {
        if (!categories || categories.length === 0) return "Attraction";
        const cat = categories[0];
        if (cat.includes("religion")) return "Spiritual";
        if (cat.includes("historic")) return "Historic";
        if (cat.includes("museum")) return "Museum";
        if (cat.includes("nature") || cat.includes("natural")) return "Nature";
        if (cat.includes("entertainment")) return "Entertainment";
        return "Attraction";
    };

    const getCategoryColor = (categories) => {
        if (!categories || categories.length === 0) return "badge-primary";
        const cat = categories[0];
        if (cat.includes("religion")) return "badge-warning";
        if (cat.includes("historic")) return "badge-secondary";
        if (cat.includes("nature")) return "badge-success";
        return "badge-primary";
    };

    const getPlaceName = (place) => place.name || place.properties?.name || "Unnamed Place";
    const getPlaceDesc = (place) => place.description || place.properties?.address_line2 || place.properties?.formatted || "";
    const getPlaceImage = (place) => place.image; // Only curated places have images right now
    const getPlaceCategories = (place) => place.properties?.categories;

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Places to Visit in {destinationName}
            </h3>
            
            {loading && places.length === 0 ? (
                 <div className="flex gap-4 overflow-x-auto pb-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="min-w-[250px] h-48 bg-base-200 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {places.map((place, idx) => {
                        const isCurated = !!place.image;
                        const name = getPlaceName(place);
                        const desc = getPlaceDesc(place);
                        const image = getPlaceImage(place);
                        const categories = getPlaceCategories(place);

                        return (
                            <div
                                key={idx}
                                className="min-w-[220px] max-w-[220px] bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 group cursor-pointer"
                            >
                                {/* Image or Placeholder */}
                                <div className={`h-28 relative flex items-center justify-center ${image ? '' : 'bg-gradient-to-br from-primary/20 to-secondary/20'}`}>
                                    {image ? (
                                        <img src={image} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        <MapPin className="w-8 h-8 text-primary/40" />
                                    )}
                                    
                                    {!isCurated && categories && (
                                        <div className={`absolute top-2 right-2 badge ${getCategoryColor(categories)} badge-sm`}>
                                            {getCategoryLabel(categories)}
                                        </div>
                                    )}
                                     {isCurated && (
                                        <div className={`absolute top-2 right-2 badge badge-accent badge-sm`}>
                                            Famous
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-3">
                                    <h4 className="font-semibold text-sm text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                                        {name}
                                    </h4>
                                    <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                                        {desc}
                                    </p>
                                    {!isCurated && place.properties?.distance && (
                                        <p className="text-xs text-base-content/40 mt-2">
                                            {(place.properties.distance / 1000).toFixed(1)} km away
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
