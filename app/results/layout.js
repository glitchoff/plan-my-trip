"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Bus, Train, Map, MessageCircle, Plane, ArrowRight, Calendar, Car } from "lucide-react";


function ResultsTabs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Preserve all search params when switching tabs
    const createQueryString = () => {
        return searchParams.toString() ? `?${searchParams.toString()}` : "";
    };

    const tabs = [
        { name: "Bus", path: "/results/bus", icon: Bus },
        { name: "Trains", path: "/results/trains", icon: Train },
        { name: "Itinerary", path: "/results/itinerary", icon: Calendar },
        { name: "Best Route", path: "/results/best-route", icon: Map },
        { name: "Vehicle", path: "/results/vehicle", icon: Car },
        { name: "Flight", path: "/results/flight", icon: Plane },
    ];

    const source = searchParams.get("source") || "Origin";
    const destination = searchParams.get("destination") || "Destination";
    const date = searchParams.get("date");
    const isAIChat = pathname?.includes("/results/ai-chat");

    if (isAIChat) {
        return (
            <div className="bg-base-100 shadow-sm border-b border-base-content/10 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-ghost gap-2 text-base-content hover:bg-base-200"
                    >
                        <span>←</span> Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-16 z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0 pt-0">
            {/* Quick Trip Info & Tabs Container */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-content/5">

                {/* Route Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-base-200/50 rounded-xl">
                    <div className="flex items-center gap-2 font-medium text-base-content">
                        <span>{source.split(',')[0]}</span>
                        <ArrowRight className="w-4 h-4 text-primary/60" />
                        <span>{destination.split(',')[0]}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div role="tablist" className="tabs tabs-boxed bg-transparent p-0 gap-2">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path;
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.path}
                                href={`${tab.path}${createQueryString()}`}
                                role="tab"
                                className={`tab h-10 px-4 gap-2 transition-all duration-300 rounded-lg ${isActive
                                    ? "bg-primary text-primary-content shadow-md"
                                    : "hover:bg-base-200 text-base-content/70"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function ResultsLayout({ children }) {
    const pathname = usePathname();
    const isAIChat = pathname?.includes("/results/ai-chat");


    return (
        <div className={`min-h-screen bg-base-200 ${isAIChat ? "" : ""}`}>
            <Suspense fallback={<div className="h-32 bg-base-100 animate-pulse"></div>}>
                <ResultsTabs />
            </Suspense>
            {isAIChat ? (
                // AI Chat gets full height, no padding
                <div className="h-[calc(100vh-48px)]">
                    {children}
                </div>
            ) : (
                // Other results pages get normal container
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            )}
        </div>
    );
}
