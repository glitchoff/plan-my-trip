"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResultsRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const saveTrip = async () => {
            const params = Object.fromEntries(searchParams.entries());
            const { source, destination, date, duration, fromLat, fromLon, toLat, toLon } = params;

            if (destination && date) {
                // Calculate end date
                const startDate = new Date(date);
                const dur = parseInt(duration) || 1;
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + dur);

                // Encode all search params into itinerary field for future "re-planning"
                const encodedItinerary = {
                    source,
                    destination,
                    date,
                    duration,
                    fromLat,
                    fromLon,
                    toLat,
                    toLon
                };

                try {
                    await fetch('/api/supabase/history', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            destination: destination.split(',')[0], // Simple name
                            start_date: startDate.toISOString(),
                            end_date: endDate.toISOString(),
                            status: 'planned',
                            total_cost: 0, // Default
                            image_url: '', // API will handle if needed, or leave empty
                            itinerary: encodedItinerary
                        })
                    });
                } catch (error) {
                    console.error("Failed to auto-save trip:", error);
                }
            }

            // Redirect
            const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";
            router.replace(`/results/bus${queryString}`);
        };

        // Run once on mount
        saveTrip();
    }, [router, searchParams]); // Dependencies correct? Yes, but check logic

    return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
}

export default function ResultsRedirect() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
            <ResultsRedirectContent />
        </Suspense>
    );
}
