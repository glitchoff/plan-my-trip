"use client";

import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold sm:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Please read these terms carefully before using our service
                    </p>
                </div>

                <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300 prose prose-lg max-w-none prose-headings:text-primary text-base-content">
                    <h3>1. Introduction</h3>
                    <p>Welcome to PlanMyTrip. By accessing our website, you agree to be bound by these Terms of Service.</p>

                    <h3>2. User Responsibilities</h3>
                    <p>You are responsible for maintaining the confidentiality of your account and password.</p>

                    <h3>3. Booking and Payments</h3>
                    <p>All bookings are subject to availability and acceptance by our travel providers.</p>

                    <h3>4. Liability</h3>
                    <p>PlanMyTrip is not liable for any disruptions caused by third-party service providers.</p>
                </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50 pointer-events-none"></div>
        </div>
    );
}
