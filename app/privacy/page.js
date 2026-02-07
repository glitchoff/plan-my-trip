"use client";

import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-base-content/70">
                        How we collect, use, and protect your data
                    </p>
                </div>

                <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300 prose prose-lg max-w-none">
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
        </div>
    );
}
