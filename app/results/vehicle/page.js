"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Phone, Car, Bike } from "lucide-react";

const mockVehicles = [
    { id: 1, name: "Raj Auto Service", type: "Auto Rickshaw", phone: "+91 98765 43210", rating: 4.5 },
    { id: 2, name: "City Cabs", type: "Cab", phone: "+91 99887 76655", rating: 4.8 },
    { id: 3, name: "Quick Auto", type: "Auto Rickshaw", phone: "+91 87654 32109", rating: 4.2 },
    { id: 4, name: "Reliable Travels", type: "Cab", phone: "+91 91234 56789", rating: 4.6 },
    { id: 5, name: "Speedy Autos", type: "Auto Rickshaw", phone: "+91 80123 45678", rating: 4.3 },
    { id: 6, name: "Premium Cabs", type: "Cab", phone: "+91 70987 65432", rating: 4.9 },
    { id: 7, name: "Local Auto Stand", type: "Auto Rickshaw", phone: "+91 60876 54321", rating: 4.0 },
    { id: 8, name: "Safe Ride Cabs", type: "Cab", phone: "+91 50765 43210", rating: 4.7 },
    { id: 9, name: "Night Owl Autos", type: "Auto Rickshaw", phone: "+91 40654 32109", rating: 4.1 },
    { id: 10, name: "Express Taxi", type: "Cab", phone: "+91 30543 21098", rating: 4.4 },
];

function VehicleContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination") || "your destination";
    const cleanDest = destination.split(',')[0].trim();

    return (
        <div className="py-8">
            {/* Header */}
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning/20 to-success/20 flex items-center justify-center mb-4">
                    <Car className="w-8 h-8 text-warning" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-base-content">Local Transport in {cleanDest}</h2>
                <p className="text-lg text-base-content/70 max-w-lg mb-6">
                    Contact these auto rickshaws and cabs once you reach your destination.
                </p>
            </div>

            {/* Vehicle List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockVehicles.map((vehicle) => {
                    const Icon = vehicle.type === "Cab" ? Car : Bike;
                    const colorClass = vehicle.type === "Cab" ? "text-primary" : "text-warning";
                    const badgeClass = vehicle.type === "Cab" ? "badge-primary" : "badge-warning";

                    return (
                        <div key={vehicle.id} className="card bg-base-100 rounded-2xl p-5 border border-base-200 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-base-200 ${colorClass}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-base-content">{vehicle.name}</h3>
                                        <span className={`badge ${badgeClass} badge-outline text-xs`}>{vehicle.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                                        <span>⭐ {vehicle.rating}</span>
                                    </div>
                                </div>
                                <a 
                                    href={`tel:${vehicle.phone.replace(/\s/g, '')}`}
                                    className="btn btn-success btn-sm gap-2"
                                >
                                    <Phone className="w-4 h-4" />
                                    {vehicle.phone}
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function VehiclePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loading loading-spinner loading-lg text-primary"></div></div>}>
            <VehicleContent />
        </Suspense>
    );
}
