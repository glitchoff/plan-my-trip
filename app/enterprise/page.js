"use client";

import React from 'react';

export default function Enterprise() {
    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl mb-4">
                        Enterprise Solutions
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Tailored travel management for your business
                    </p>
                </div>

                <div className="hero bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                    <div className="hero-content flex-col lg:flex-row-reverse p-8 md:p-12">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold mb-6">Why chooses PlanMyTrip for Business?</h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1 text-xl">🏢</span>
                                    <div>
                                        <strong>Centralized Booking:</strong> Manage all employee travel from a single dashboard.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1 text-xl">📊</span>
                                    <div>
                                        <strong>Expense Reporting:</strong> Automated expense tracking and integration with accounting software.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1 text-xl">🤝</span>
                                    <div>
                                        <strong>24/7 Corporate Support:</strong> Dedicated support team for your business travelers.
                                    </div>
                                </li>
                            </ul>
                            <button className="btn btn-primary btn-lg">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
