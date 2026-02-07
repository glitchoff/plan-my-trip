"use client";

import { useState } from "react";
import Link from "next/link";
import WikiImage from "../components/WikiImage";
import { useLanguage } from "../context/LanguageContext";
import { destinations } from "../lib/destinations";

export default function Explore() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("historical");

    const categories = [
        { id: "historical", name: "Historical & Heritage" },
        { id: "religious", name: "Religious & Spiritual" },
        { id: "mountain", name: "Hill Stations & Mountains" },
        { id: "beach", name: "Beaches & Coastal" },
        { id: "nature", name: "Nature & Wildlife" },
    ];

    const filteredIndiaPlaces = destinations.filter(d => d.country === "India" && d.category === activeTab);
    const internationalPlaces = destinations.filter(d => d.country === "International");

    return (
        <div className="min-h-screen bg-base-100 pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-6xl animate-fade-in-up">
                        Explore India & Beyond
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-base-content/70 animate-fade-in-up delay-100">
                        Discover top trending destinations categorized by your interest.
                    </p>
                </div>

                {/* India Section with Tabs */}
                <div className="mx-auto mt-12 mb-16 bg-neutral text-neutral-content dark:bg-primary dark:text-primary-content backdrop-blur-md rounded-3xl p-8 shadow-sm">
                    <div className="mx-auto max-w-3xl lg:mx-0 mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-inherit sm:text-4xl">Trending in India</h2>
                        <p className="mt-4 text-lg text-inherit/80">
                            choose which type of places we want to visit.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    activeTab === cat.id
                                        ? "bg-base-100 text-base-content shadow-md scale-105"
                                        : "bg-base-100/10 text-inherit hover:bg-base-100/20"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {filteredIndiaPlaces.map((place) => (
                            <Link key={place.id} href={`/explore/${place.id}`} className="group bg-base-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"/>
                                    <WikiImage 
                                        src={place.image} 
                                        alt={place.name} 
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-base-content mb-2 group-hover:text-primary transition-colors">{place.name}</h3>
                                        <p className="text-sm text-base-content/70 line-clamp-3">{place.description}</p>
                                    </div>
                                    <button className="mt-4 w-full btn btn-sm btn-outline hover:btn-primary rounded-lg">
                                        Plan Trip
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* International Section */}
                <div className="mx-auto mt-12 mb-12 bg-neutral text-neutral-content dark:bg-primary dark:text-primary-content backdrop-blur-md rounded-3xl p-8 shadow-sm">
                    <div className="mx-auto max-w-2xl lg:mx-0 mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-inherit sm:text-4xl">Trending International</h2>
                        <p className="mt-4 text-lg text-inherit/80">
                             Experience wonders beyond borders.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {internationalPlaces.map((place) => (
                            <Link key={place.id} href={`/explore/${place.id}`} className="group bg-base-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"/>
                                    <WikiImage 
                                        src={place.image} 
                                        alt={place.name} 
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-base-content mb-2 group-hover:text-primary transition-colors">{place.name}</h3>
                                        <p className="text-sm text-base-content/70 line-clamp-3">{place.description}</p>
                                    </div>
                                    <button className="mt-4 w-full btn btn-sm btn-outline hover:btn-primary rounded-lg">
                                        Plan Trip
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
