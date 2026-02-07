"use client";

import React from 'react';

export default function Enterprise() {
    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold sm:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Enterprise Solutions
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Tailored travel management for your business
                    </p>
                </div>

                <div className="hero bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                    <div className="hero-content flex-col lg:flex-row-reverse p-8 md:p-12">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold mb-6 text-secondary">Why chooses PlanMyTrip for Business?</h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1 text-xl">🏢</span>
                                    <div>
                                        <strong className="text-base-content">Centralized Booking:</strong> <span className="text-base-content/80">Manage all employee travel from a single dashboard.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1 text-xl">📊</span>
                                    <div>
                                        <strong className="text-base-content">Expense Reporting:</strong> <span className="text-base-content/80">Automated expense tracking and integration with accounting software.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-primary mt-1 text-xl">🤝</span>
                                    <div>
                                        <strong className="text-base-content">24/7 Corporate Support:</strong> <span className="text-base-content/80">Dedicated support team for your business travelers.</span>
                                    </div>
                                </li>
                            </ul>
                            <button className="btn btn-primary btn-lg shadow-lg hover-lift">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50 pointer-events-none"></div>
        </div>
    );
}
