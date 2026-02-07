"use client";

import React from 'react';

export default function Announcements() {
    const announcements = [
        {
            id: 1,
            title: "PlanMyTrip Launches New Mobile App",
            date: "October 24, 2025",
            category: "Product Update",
            content: "We are thrilled to announce the launch of our new mobile application, available now on iOS and Android. Plan your trips on the go with seamless synchronization across all your devices."
        },
        {
            id: 2,
            title: "Partnership with Global Hotel Chains",
            date: "September 15, 2025",
            category: "Partnership",
            content: "We've partnered with major hotel chains worldwide to bring you exclusive deals and discounts. Look for the 'Partner Deal' badge on your search results to save up to 30% on your stay."
        },
        {
            id: 3,
            title: "Introducing Carbon Neutral Travel Options",
            date: "August 01, 2025",
            category: "Sustainability",
            content: "As part of our commitment to the environment, we now offer carbon emission estimates for all transport options. You can also choose to offset your carbon footprint directly through our platform."
        },
        {
            id: 4,
            title: "New Feature: AI-Powered Itinerary Builder",
            date: "July 10, 2025",
            category: "Feature",
            content: "Our new AI Itinerary Builder creates personalized day-by-day travel plans based on your interests and budget. Try it out on your next trip search!"
        }
    ];

    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl mb-4">
                        Announcements
                    </h1>
                    <p className="text-xl text-base-content/70">
                        The latest news, updates, and stories from PlanMyTrip
                    </p>
                </div>

                <div className="space-y-8">
                    {announcements.map((item) => (
                        <div key={item.id} className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-colors">
                            <div className="card-body">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <div className="badge badge-primary badge-outline">{item.category}</div>
                                    <time className="text-sm text-base-content/60">{item.date}</time>
                                </div>
                                <h2 className="card-title text-2xl font-bold text-base-content mb-2">
                                    {item.title}
                                </h2>
                                <p className="text-base-content/80 leading-relaxed">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
