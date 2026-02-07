"use client";

import { useSearchParams } from "next/navigation";
import { destinations } from "@/app/lib/destinations";
import PlacesToVisit from "@/app/components/PlacesToVisit";
import NearbyPlaces from "@/app/lib/NearbyPlaces";

export default function ItineraryPage() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    
    if (!destination) {
        return (
            <div className="flex justify-center items-center h-40 bg-base-100 rounded-xl shadow-sm border border-base-content/5 mt-4">
                <p className="text-base-content/60">No destination selected.</p>
            </div>
        );
    }

    // Helper to find destination loosely
    const destData = destinations.find(d => 
        d.id === destination.toLowerCase() || 
        d.name.toLowerCase() === destination.toLowerCase() ||
        destination.toLowerCase().includes(d.name.toLowerCase())
    );

    if (!destData) {
        return (
            <div className="flex justify-center items-center h-40 bg-base-100 rounded-xl shadow-sm border border-base-content/5 mt-4">
                <p className="text-base-content/60">No itinerary information available for {destination}.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PlacesToVisit 
                destinationLat={destData.latitude} 
                destinationLon={destData.longitude} 
                destinationName={destData.name}
                initialPlaces={destData.placesToVisit}
            />
            
            <div className="bg-base-100/50 backdrop-blur-sm border border-base-content/5 rounded-2xl p-6">
                 <NearbyPlaces 
                    destination={destData.name} 
                    lat={destData.latitude} 
                    lon={destData.longitude} 
                />
            </div>
        </div>
    );
}
