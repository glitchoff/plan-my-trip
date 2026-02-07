"use client";
import BackgroundSlider from "../components/BackgroundSlider";

export default function Wishlist() {
    // Mock Wishlist Data
    const wishlistItems = [
        {
            id: 1,
            name: "Grand Luxury Plaza",
            location: "New York",
            rating: 4.8,
            price: 350,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
        },
        {
            id: 2,
            name: "Ocean View Resort",
            location: "Miami",
            rating: 4.5,
            price: 280,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000",
        },
    ];

    return (
        <div className="min-h-screen pt-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg mt-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                        <button className="mt-4 text-blue-600 font-medium hover:text-blue-800">
                            Explore Hotels &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative h-48">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-red-500 hover:bg-white transition-colors">
                                        ♥️
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {item.rating} ★
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">📍 {item.location}</p>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                                            <span className="text-gray-500 text-sm">/night</span>
                                        </div>
                                        <button className="text-blue-600 font-semibold hover:text-blue-800 text-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
