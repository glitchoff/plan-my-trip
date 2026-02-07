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

// Internal component for the Modal Image
function ModalImage({ placeName, fallbackImage, alt }) {
     const [imageSrc, setImageSrc] = useState(fallbackImage);
    
    useEffect(() => {
        if (fallbackImage) return;

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
                console.error("Failed to load modal image for", placeName);
            }
        };

        fetchImage();
        return () => { isMounted = false; };
    }, [placeName, fallbackImage]);
    
    return (
         <div className="h-48 bg-primary/10 flex items-center justify-center relative bg-cover bg-center" style={imageSrc ? {backgroundImage: `url(${imageSrc})`} : {}}>
            {!imageSrc && <MapPin className="w-16 h-16 text-primary/30" />}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-base-100/50 hover:bg-base-100" onClick={() => document.getElementById('places_to_visit_modal').close()}>✕</button>
        </div>
    )
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
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeDetails, setPlaceDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

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
        fetchPlaces();
    }, [destinationLat, destinationLon, radius, categories, limit, initialPlaces]);

    const handlePlaceClick = async (place) => {
        setSelectedPlace(place);
        setPlaceDetails(null);
        setDetailsLoading(true);

        // Open modal
        document.getElementById('places_to_visit_modal').showModal();

        try {
            // Check if it's a curated place (might not have properties.place_id directly)
            const placeId = place.properties?.place_id;

            if (placeId) {
                const res = await fetch(`/api/placedetails?id=${placeId}`);
                if (!res.ok) throw new Error("Failed to fetch details");
                
                const data = await res.json();
                setPlaceDetails(data.features?.[0]?.properties || {});
            } else {
                setPlaceDetails({
                    description: place.description || place.properties?.description || "No description available.",
                });
            }
        } catch (err) {
            console.error("Error fetching details:", err);
            setPlaceDetails(place.properties || place);
        } finally {
            setDetailsLoading(false);
        }
    };

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

                        return (
                            <div
                                key={idx}
                                onClick={() => handlePlaceClick(place)}
                                className="min-w-[220px] max-w-[220px] bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 group cursor-pointer"
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

            {/* Details Modal */}
             <dialog id="places_to_visit_modal" className="modal">
                <div className="modal-box w-11/12 max-w-3xl p-0 overflow-hidden bg-base-100">
                    {selectedPlace && (
                        <div className="flex flex-col h-full max-h-[85vh]">
                             {/* Header image using ModalImage */}
                             <ModalImage 
                                placeName={getPlaceName(selectedPlace)} 
                                fallbackImage={getPlaceImage(selectedPlace)} 
                                alt={getPlaceName(selectedPlace)}
                             />
                            
                            <div className="p-6 overflow-y-auto">
                                <h3 className="text-2xl font-bold mb-1">
                                    {getPlaceName(selectedPlace)}
                                </h3>
                                <p className="text-base-content/60 text-sm mb-4">
                                     {selectedPlace.properties?.address_line2 || selectedPlace.location || ""}
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
                                                <p className="text-sm text-base-content/80">{placeDetails.description}</p>
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

                                        {/* Categories */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {(placeDetails.categories || selectedPlace.properties?.categories || []).map(cat => (
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
        </div>
    );
}
