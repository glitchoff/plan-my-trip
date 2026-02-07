"use client";
import { useState, useEffect } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";

export default function Wishlist() {
    const { isAuthenticated, isLoading } = useAuthProtection();
    
    // State
    const [wishlistItems, setWishlistItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("wishlist");
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // Search Logic
    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&type=autocomplete`);
            const data = await res.json();
            if (data.features) {
                setSuggestions(data.features);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) fetchSuggestions(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchWikiImage = async (placeName) => {
        try {
            const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(placeName)}&gsrlimit=1&prop=imageinfo&iiprop=url&format=json&origin=*`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            
            if (data.query && data.query.pages) {
                const pages = Object.values(data.query.pages);
                if (pages.length > 0 && pages[0].imageinfo && pages[0].imageinfo.length > 0) {
                    return pages[0].imageinfo[0].url;
                }
            }
        } catch (error) {
            console.error("Error fetching Wiki image:", error);
        }
        return null;
    };

    const addToWishlist = async (feature) => {
        const placeName = feature.properties.name || feature.properties.formatted.split(',')[0];
        setSearchQuery(""); // Clear immediately for better UX
        setSuggestions([]);

        let imageUrl = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000"; // Default
        
        // Fetch real image
        const wikiUrl = await fetchWikiImage(placeName);
        if (wikiUrl) {
            imageUrl = wikiUrl;
        }

        const newItem = {
            id: Date.now(),
            name: placeName,
            location: feature.properties.formatted,
            rating: 4.5,
            price: "Ask",
            image: imageUrl,
            ...feature.properties
        };

        if (!wishlistItems.some(item => item.name === newItem.name)) {
            setWishlistItems(prev => [...prev, newItem]);
        }
    };

    const removeFromWishlist = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    // Initial auth check render - MUST BE AFTER ALL HOOKS
    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen pt-20 pb-16 bg-base-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-6xl animate-fade-in-up hover:scale-105 transition-transform duration-200 cursor-default">
                        My Wishlist
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-base-content/70 animate-fade-in-up delay-100 hover:scale-105 transition-transform duration-200 cursor-default">
                        Your dream destinations saved in one place.
                    </p>
                </div>

                <div className="bg-base-100/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
                    {/* Search Bar */}
                    <div className="flex justify-center mb-8">
                    <div className="relative w-full md:w-96 z-50">
                        <input
                            type="text"
                            placeholder="Add a place to wishlist..."
                            className="input input-bordered input-primary w-full pr-10 bg-base-100/50 backdrop-blur-sm focus:bg-base-100 transition-all placeholder:text-base-content/50 text-base-content"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-3">
                                <span className="loading loading-spinner loading-xs text-primary"></span>
                            </div>
                        )}
                        
                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && searchQuery && (
                            <ul className="absolute top-full left-0 right-0 bg-base-100/90 backdrop-blur-md border border-primary/20 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
                                {suggestions.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="p-3 hover:bg-primary/10 cursor-pointer flex items-center gap-2 border-b border-base-content/10 last:border-0 transition-colors"
                                        onClick={() => addToWishlist(feature)}
                                    >
                                        <span className="text-lg">📍</span>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm text-base-content">{feature.properties.formatted}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-base-content/60 text-lg">Your wishlist is empty.</p>
                        <p className="text-sm text-base-content/40 mt-2">Search above to add places!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="bg-base-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group">
                                <div className="relative h-48">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-red-500 hover:bg-white transition-colors shadow-sm"
                                        title="Remove from wishlist"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-base-content line-clamp-1">{item.name}</h3>
                                        <span className="bg-primary/20 text-primary text-xs font-semibold px-2.5 py-0.5 rounded shrink-0">
                                            {item.rating} ★
                                        </span>
                                    </div>
                                    <p className="text-base-content/60 text-sm mb-4 line-clamp-2">📍 {item.location}</p>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            {typeof item.price === 'number' ? (
                                                <>
                                                 <span className="text-2xl font-bold text-base-content">${item.price}</span>
                                                 <span className="text-base-content/60 text-sm">/night</span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold text-base-content">{item.price}</span>
                                            )}
                                        </div>
                                        <button className="text-primary font-semibold hover:text-primary/80 text-sm">
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
        </div>
    );
}
