"use client";

import Link from "next/link";
import { useState } from "react";

export default function AIChatWidget() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Speech bubble message */}
            <div 
                className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
            >
                <div className="bg-base-100 text-base-content px-4 py-3 rounded-2xl shadow-xl border border-primary/20 whitespace-nowrap">
                    <p className="text-sm font-medium">Need any assistance for your trip? 🌍</p>
                </div>
                {/* Triangle pointer */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-base-100 border-r border-b border-primary/20 transform rotate-45"></div>
            </div>

            {/* Main chat button */}
            <Link
                href="/results/ai-chat"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-primary-content px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
                <span className="text-2xl">🤖</span>
                <span className="font-semibold">AI Chat</span>
            </Link>
        </div>
    );
}
