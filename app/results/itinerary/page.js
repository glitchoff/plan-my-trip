"use client";

import { useSearchParams } from "next/navigation";
import { destinations } from "@/app/lib/destinations";
import PlacesToVisit from "@/app/components/PlacesToVisit";
import NearbyPlaces from "@/app/lib/NearbyPlaces";

export default function ItineraryPage() {
    const searchParams = useSearchParams();
    
    // Get parameters similar to Best Route page, plus legacy support
    const destinationParam = searchParams.get("destination") || searchParams.get("to") || searchParams.get("end");
    const latParam = searchParams.get("toLat") || searchParams.get("lat");
    const lonParam = searchParams.get("toLon") || searchParams.get("lon");

    if (!destinationParam && !latParam) {
        return (
            <div className="flex justify-center items-center h-40 bg-base-100 rounded-xl shadow-sm border border-base-content/5 mt-4">
                <p className="text-base-content/60">No destination selected.</p>
            </div>
        );
    }

    // Try to find curated data for rich content (images, specific places)
    const destData = destinations.find(d => {
        if (!destinationParam) return false;
        const query = destinationParam.toLowerCase().trim();
        const id = d.id.toLowerCase();
        const name = d.name.toLowerCase();
        
        // Exact matches
        if (id === query || name === query) return true;
        
        // Partial matches
        if (query.includes(name) || name.includes(query)) return true;
        
        // City, Country check
        const queryParts = query.split(',').map(p => p.trim());
        if (queryParts.length > 0 && queryParts[0] === name) return true;
        
        return false;
    });

    // Determine final coordinates and name
    // Prioritize URL params if available (usually from geocoding), otherwise fallback to curated data
    const latitude = latParam ? parseFloat(latParam) : destData?.latitude;
    const longitude = lonParam ? parseFloat(lonParam) : destData?.longitude;
    const name = destData?.name || (destinationParam ? destinationParam.split(',')[0].trim() : "Destination");
    const initialPlaces = destData?.placesToVisit || [];

    if (!latitude || !longitude) {
        return (
            <div className="flex justify-center items-center h-40 bg-base-100 rounded-xl shadow-sm border border-base-content/5 mt-4">
                <p className="text-base-content/60">
                    No location data available for {destinationParam}. Please try searching again.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PlacesToVisit 
                destinationLat={latitude} 
                destinationLon={longitude} 
                destinationName={name}
                initialPlaces={initialPlaces}
            />
            
            <div className="bg-base-100/50 backdrop-blur-sm border border-base-content/5 rounded-2xl p-6">
                 <NearbyPlaces 
                    destination={name} 
                    lat={latitude} 
                    lon={longitude} 
                />
            </div>
        </div>
    );
}
