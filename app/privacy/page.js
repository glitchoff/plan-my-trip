"use client";

import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold sm:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-base-content/70">
                        How we collect, use, and protect your data
                    </p>
                </div>

                <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300 prose prose-lg max-w-none prose-headings:text-primary text-base-content">
                    <h3>1. Information Collection</h3>
                    <p>We collect information you provide directly to us, such as when you create an account or book a trip.</p>

                    <h3>2. Use of Information</h3>
                    <p>We use your information to provide, maintain, and improve our services.</p>

                    <h3>3. Data Security</h3>
                    <p>We implement appropriate technical and organizational measures to protect your personal data.</p>

                    <h3>4. Cookies</h3>
                    <p>We use cookies to enhance your browsing experience and analyze site traffic.</p>
                </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50 pointer-events-none"></div>
        </div>
    );
}
