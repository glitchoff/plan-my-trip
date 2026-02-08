"use client";

import { useState, useEffect } from "react";
import { MapPin, Star, Loader2, ExternalLink } from "lucide-react";

// Internal component to fetch and display image (via our API which now uses Unsplash)
function PlaceImage({ placeName, fallbackImage, alt, className }) {
    const [imageSrc, setImageSrc] = useState(fallbackImage);
    const [loading, setLoading] = useState(!fallbackImage);

    useEffect(() => {
        if (fallbackImage) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/images?query=${encodeURIComponent(placeName)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.imageUrl) {
                        setImageSrc(data.imageUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to load image for", placeName);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchImage();
        return () => { isMounted = false; };
    }, [placeName, fallbackImage]);

    if (loading) {
        return <div className={`${className} bg-base-200 animate-pulse`} />;
    }

    return (
        <div className={`${className} relative flex items-center justify-center ${imageSrc ? '' : 'bg-gradient-to-br from-primary/20 to-secondary/20'}`}>
            {imageSrc ? (
                <img src={imageSrc} alt={alt} className="w-full h-full object-cover transition-opacity duration-500" />
            ) : (
                <MapPin className="w-8 h-8 text-primary/40" />
            )}
        </div>
    );
}

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

    const getGoogleMapsUrl = (place) => {
        const name = place.name || place.properties?.name || "Destination";

        // If we have coordinates (from Geoapify), use them to center the map while searching for the name
        // GeoJSON coordinates are [lon, lat]
        if (place.geometry?.coordinates) {
            const [lon, lat] = place.geometry.coordinates;
            return `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${lat},${lon},17z`;
        }

        // If we have specific lat/lon properties (curated places might have them)
        if (place.latitude && place.longitude) {
            return `https://www.google.com/maps/search/${encodeURIComponent(name)}/@${place.latitude},${place.longitude},17z`;
        }

        // Fallback to name search with destination context
        const address = place.properties?.address_line2 || place.location || "";
        const query = `${name} ${address} ${destinationName}`.trim();
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    };

    if (!destinationLat && !destinationLon && initialPlaces.length === 0) {
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
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <MapPin className="w-5 h-5" />
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
                        const mapUrl = getGoogleMapsUrl(place);

                        return (
                            <a
                                key={idx}
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-w-[220px] max-w-[220px] bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 group cursor-pointer block"
                            >
                                {/* Image or Placeholder using PlaceImage */}
                                <PlaceImage
                                    placeName={name}
                                    fallbackImage={image}
                                    alt={name}
                                    className="h-28"
                                />

                                <div className="absolute top-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
                                    {!isCurated && categories && (
                                        <div className={`badge ${getCategoryColor(categories)} badge-sm shadow-sm`}>
                                            {getCategoryLabel(categories)}
                                        </div>
                                    )}
                                    {isCurated && (
                                        <div className={`badge badge-accent badge-sm shadow-sm`}>
                                            Famous
                                        </div>
                                    )}
                                </div>

                                <div className="p-3">
                                    <h4 className="font-semibold text-sm text-base-content line-clamp-1 group-hover:text-primary transition-colors flex items-center gap-1">
                                        {name}
                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
