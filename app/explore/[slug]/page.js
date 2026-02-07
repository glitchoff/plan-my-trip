"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { destinations } from "../../lib/destinations";
import WikiImage from "../../components/WikiImage";

export default function DestinationDetails({ params }) {
    // Ungroup params using React.use()
    const unwrappedParams = use(params);
    const { slug } = unwrappedParams;
    
    const [destination, setDestination] = useState(null);

    useEffect(() => {
        // Find destination by id (which acts as slug here)
        const found = destinations.find(d => d.id === slug);
        setDestination(found);
    }, [slug]);

    if (!destination) {
        return (
            <div className="min-h-screen bg-base-100 pt-20 flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <div className="relative h-[50vh] w-full">
                <WikiImage
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in-up">
                        {destination.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl animate-fade-in-up delay-100">
                        {destination.description}
                    </p>
                </div>
            </div>

            {/* Places to Visit Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-neutral text-neutral-content dark:bg-primary dark:text-primary-content backdrop-blur-md rounded-3xl p-8 shadow-sm">
                    <div className="mx-auto max-w-3xl text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-inherit sm:text-4xl">
                            Top Places to Visit in {destination.name}
                        </h2>
                        <p className="mt-4 text-lg text-inherit/80">
                            Don't miss these iconic spots on your trip.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destination.placesToVisit.map((place, index) => (
                            <div key={index} className="group bg-base-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full card">
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"/>
                                    <WikiImage
                                        src={place.image}
                                        alt={place.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                                        {place.name}
                                    </h3>
                                    <p className="text-base-content/70 text-sm">
                                        {place.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/explore">
                        <button className="btn btn-outline gap-2">
                            ← Back to Explore
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
