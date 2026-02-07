"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResultsTabs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Preserve all search params when switching tabs
    const createQueryString = () => {
        return searchParams.toString() ? `?${searchParams.toString()}` : "";
    };

    const tabs = [
        { name: "Bus", path: "/results/bus", icon: "🚌" },
        { name: "Trains", path: "/results/trains", icon: "🚆" },
        { name: "Best Route", path: "/results/best-route", icon: "✨" },
        { name: "AI Chat", path: "/results/ai-chat", icon: "🤖" },
        { name: "Flight", path: "/results/flight", icon: "✈️" },
    ];

    const source = searchParams.get("source") || "Origin";
    const destination = searchParams.get("destination") || "Destination";
    const date = searchParams.get("date");
    const isAIChat = pathname?.includes("/results/ai-chat");

    if (isAIChat) {
        return (
            <div className="bg-base-100 shadow-sm border-b border-base-content/10 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                    <Link
                        href={`/results/best-route${createQueryString()}`}
                        className="btn btn-ghost gap-2 text-base-content hover:bg-base-200"
                    >
                        <span>←</span> Back to Results
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 shadow-sm border-b border-base-200 sticky top-16 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Quick Trip Info */}
                <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-base-200/50">
                    <div className="flex items-center gap-2 text-lg font-bold text-base-content">
                        <span>{source.split(',')[0]}</span>
                        <span className="text-base-content/40">➜</span>
                        <span>{destination.split(',')[0]}</span>
                    </div>
                    <div className="text-sm text-base-content/60 bg-base-200 px-3 py-1 rounded-full">
                        {date}
                    </div>
                </div>

                {/* Tags Navigation */}
                <div role="tablist" className="tabs tabs-bordered tabs-lg w-full overflow-x-auto flex-nowrap -mb-[1px]">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path;
                        return (
                            <Link
                                key={tab.path}
                                href={`${tab.path}${createQueryString()}`}
                                role="tab"
                                className={`tab h-14 whitespace-nowrap gap-2 ${isActive ? "tab-active font-bold border-primary text-primary" : "hover:text-primary/70"}`}
                            >
                                <span className="text-xl">{tab.icon}</span>
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
        <div className={`min-h-screen bg-base-200 ${isAIChat ? "" : "pt-16"}`}>
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
