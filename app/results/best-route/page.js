"use client";

import { useSearchParams } from "next/navigation";
import PlacesToVisit from "../../components/PlacesToVisit";
import { Sparkles } from "lucide-react";

export default function BestRouteResults() {
    const searchParams = useSearchParams();
    
    const destination = searchParams.get("destination") || "Destination";
    const toLat = searchParams.get("toLat");
    const toLon = searchParams.get("toLon");
    
    // Extract city name from destination (first part before comma)
    const destinationCity = destination.split(',')[0].trim();

    return (
        <div className="py-8">
            {/* Header */}
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Best Route Recommendation</h2>
                <p className="text-lg text-base-content/60 max-w-lg">
                    Our AI analyzes all modes of transport to find the most optimal path for you.
                </p>
            </div>

            {/* Best Route Card - Placeholder */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 mb-8">
                <div className="text-center py-8 text-base-content/50">
                    <p>Route optimization coming soon...</p>
                </div>
            </div>

            {/* Places to Visit Section */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
                <PlacesToVisit 
                    destinationLat={toLat} 
                    destinationLon={toLon} 
                    destinationName={destinationCity}
                />
            </div>
        </div>
    );
}
