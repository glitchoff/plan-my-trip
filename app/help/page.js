"use client";

import React from 'react';

export default function HelpCenter() {
    const faqs = [
        {
            question: "How do I book a trip?",
            answer: "Simply enter your destination, dates, and preferences on our homepage, and we'll show you the best options."
        },
        {
            question: "Can I cancel my booking?",
            answer: "Yes, cancellations are possible depending on the provider's policy. Check your booking details for more information."
        },
        {
            question: "Is my payment information secure?",
            answer: "Absolutely. We use industry-standard encryption to ensure your data is always safe."
        }
    ];

    return (
        <div className="min-h-screen bg-base-200 pt-32 pb-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold sm:text-5xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Help Center
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Frequently asked questions and support
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="collapse collapse-plus bg-base-100 border border-base-300 rounded-box hover:border-primary transition-colors duration-300">
                            <input type="radio" name="my-accordion-3" defaultChecked={index === 0} />
                            <div className="collapse-title text-xl font-medium text-primary">
                                {faq.question}
                            </div>
                            <div className="collapse-content">
                                <p className="text-base-content/80">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl opacity-50 pointer-events-none"></div>
        </div>
    );
}
