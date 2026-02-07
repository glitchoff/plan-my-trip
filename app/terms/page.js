"use client";

import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Please read these terms carefully before using our service
                    </p>
                </div>

                <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300 prose prose-lg max-w-none">
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
        </div>
    );
}
