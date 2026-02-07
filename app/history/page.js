"use client";
import BackgroundSlider from "../components/BackgroundSlider";

export default function History() {
    // Mock History Data
    const pastTrips = [
        {
            id: 1,
            destination: "Paris, France",
            date: "Oct 12, 2025",
            status: "Completed",
            totalCost: 1250,
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 2,
            destination: "Tokyo, Japan",
            date: "Aug 05, 2025",
            status: "Completed",
            totalCost: 2100,
            image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 3,
            destination: "London, UK",
            date: "Jul 15, 2025",
            status: "Completed",
            totalCost: 1800,
            image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 4,
            destination: "Sydney, Australia",
            date: "May 20, 2025",
            status: "Completed",
            totalCost: 2300,
            image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 5,
            destination: "Dubai, UAE",
            date: "Mar 10, 2025",
            status: "Completed",
            totalCost: 1500,
            image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1000",
        },
    ];

    return (
        <div className="min-h-screen pt-20 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-base-100/80 backdrop-blur-md rounded-2xl shadow-lg mt-4">
                <h1 className="text-3xl font-bold text-base-content mb-8">My Past Trips</h1>

                <div className="space-y-4">
                    {pastTrips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                            <div className="md:w-64 h-48 md:h-auto relative">
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
                                </div>
                                <div className="mt-2 flex justify-end gap-3">
                                    <button
                                        onClick={() => alert("Review feature coming soon!")}
                                        className="text-gray-600 font-semibold hover:text-gray-900 text-sm"
                                    >
                                        Leave Review ✍️
                                    </button>
                                    <button className="text-blue-600 font-semibold hover:text-blue-800 text-sm">
                                        View Itinerary &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
