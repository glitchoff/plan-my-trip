"use client";

import React from 'react';

export default function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            features: [
                "Basic Trip Planning",
                "3 Saved Itineraries",
                "Standard Support",
                "Ad-supported"
            ],
            buttonText: "Get Started",
            highlight: false
        },
        {
            name: "Pro",
            price: "$9.99",
            period: "/month",
            features: [
                "Unlimited Trip Planning",
                "Offline Access",
                "Expense Tracking",
                "Priority Support",
                "Ad-free Experience"
            ],
            buttonText: "Upgrade to Pro",
            highlight: true
        },
        {
            name: "Family",
            price: "$19.99",
            period: "/month",
            features: [
                "Up to 5 Accounts",
                "Group Collaboration",
                "Shared Itineraries",
                "Kids Safety Features",
                "24/7 Support"
            ],
            buttonText: "Choose Family",
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl mb-4">
                        Pricing Plans
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Choose the perfect plan for your travel needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div key={index} className={`card bg-base-100 shadow-xl border ${plan.highlight ? 'border-primary border-2 relative' : 'border-base-300'}`}>
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 -mt-3 -mr-3 badge badge-primary badge-lg">Popular</div>
                            )}
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-2xl font-bold mb-4">{plan.name}</h2>
                                <div className="text-4xl font-extrabold mb-2">
                                    {plan.price}
                                    <span className="text-xl font-normal text-base-content/60">{plan.period}</span>
                                </div>
                                <ul className="space-y-4 my-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-success">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`btn w-full ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}>
                                    {plan.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
