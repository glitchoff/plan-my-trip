"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthProtection } from "../hooks/useAuthProtection";

export default function Wishlist() {
    const { isAuthenticated, isLoading: authLoading, user } = useAuthProtection();

    // State
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Fetch wishlist from API
    useEffect(() => {
        const fetchWishlist = async () => {
            if (isAuthenticated && user) {
                try {
                    const res = await fetch('/api/supabase/wishlist');
                    if (res.ok) {
                        const data = await res.json();
                        setWishlistItems(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch wishlist", error);
                } finally {
                    setIsLoadingItems(false);
                }
            } else if (!authLoading && !isAuthenticated) {
                // Not authenticated, stop loading
                setIsLoadingItems(false);
            }
        };

        fetchWishlist();
    }, [isAuthenticated, user, authLoading]);

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
        return null; // Return null instead of default to handle logic in addToWishlist
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

        const newItemPayload = {
            place_name: placeName,
            location: feature.properties.formatted,
            rating: 4.5, // Default rating as placeholder
            price: "Ask",
            image_url: imageUrl,
            details: feature.properties
        };

        // Optimistic UI Update
        const tempId = Date.now();
        const optimisticItem = { ...newItemPayload, id: tempId, name: placeName, image: imageUrl }; // Map to UI expectation
        // (Note: UI expects 'name' and 'image', API returns 'place_name' and 'image_url')
        // We should normalize this. Let's make the state consistent with API response structure eventually, 
        // but for now let's map it or ensure payload matches UI.

        // Actually, let's normalize the state to use API fields, but we need to update the render logic too.
        // For simplicity in this step, I'll map API fields to UI fields in the render or vice versa.
        // Let's stick to API fields in state: place_name, image_url.

        // Update: The previous code used 'name' and 'image'. To minimize render changes, let's stick to using 'place_name' and 'image_url' 
        // throughout and update the render section.

        // Wait, 'newItemPayload' is what we send to valid API.

        try {
            const res = await fetch('/api/supabase/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItemPayload)
            });

            if (res.ok) {
                const savedItem = await res.json();
                setWishlistItems(prev => [savedItem, ...prev]);
            }
        } catch (error) {
            console.error("Failed to add to wishlist", error);
            // Revert optimistic update if we did one (didn't implement here to keep it simple first)
        }
    };

    const removeFromWishlist = async (id) => {
        try {
            // Optimistic removing
            setWishlistItems(prev => prev.filter(item => item.id !== id));

            await fetch(`/api/supabase/wishlist?id=${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
            // Could revert here fetch items again
        }
    };

    // Initial auth check render - MUST BE AFTER ALL HOOKS
    if (authLoading) {
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

                    {isLoadingItems ? (
                        <div className="flex justify-center py-20">
                            <span className="loading loading-spinner loading-md text-primary"></span>
                        </div>
                    ) : wishlistItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-base-content/60 text-lg">Your wishlist is empty.</p>
                            <p className="text-sm text-base-content/40 mt-2">Search above to add places!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="bg-base-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative group">
                                    <div className="relative h-48">
                                        <img src={item.image_url || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000"} alt={item.place_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-red-500 rounded-full text-gray-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110"
                                            title="Remove from wishlist"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-base-content mb-1 line-clamp-1">{item.place_name}</h3>
                                        <p className="text-base-content/60 text-sm mb-4 line-clamp-2 flex items-center gap-1">
                                            <span>📍</span> {item.location}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                {(!isNaN(item.price)) ? (
                                                    <>
                                                        <span className="text-xl font-bold text-base-content">${item.price}</span>
                                                        <span className="text-base-content/60 text-sm">/night</span>
                                                    </>
                                                ) : (
                                                    <span className="text-base font-semibold text-primary">{item.price}</span>
                                                )}
                                            </div>
                                            <Link 
                                                href={`/results/ai-chat?prompt=${encodeURIComponent(`Show me all the famous places to visit in ${item.place_name} and suggest the best routes to explore them`)}`}
                                                className="btn btn-sm btn-primary btn-outline rounded-full text-xs"
                                            >
                                                View Details
                                            </Link>
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
