"use client";

import React from 'react';

export default function Features() {
    const features = [
        {
            title: "Smart Trip Planning",
            description: "AI-powered itinerary generation based on your preferences.",
            icon: "🤖"
        },
        {
            title: "Real-time Updates",
            description: "Get instant notifications for flight delays, gate changes, and more.",
            icon: "⚡"
        },
        {
            title: "Expense Tracking",
            description: "Keep track of your travel budget with our built-in expense manager.",
            icon: "💰"
        },
        {
            title: "Offline Access",
            description: "Access your itinerary and tickets even without an internet connection.",
            icon: "📱"
        },
        {
            title: "Group Collaboration",
            description: "Plan trips together with friends and family in real-time.",
            icon: "👥"
        },
        {
            title: "Safety Alerts",
            description: "Receive local safety information and emergency contacts for your destination.",
            icon: "🛡️"
        }
    ];

    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl mb-4">
                        Features
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Everything you need for a seamless travel experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-colors">
                            <div className="card-body items-center text-center">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h2 className="card-title text-2xl font-bold mb-2">{feature.title}</h2>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
