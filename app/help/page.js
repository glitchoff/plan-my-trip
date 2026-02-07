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
        <div className="min-h-screen bg-base-200 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-base-content sm:text-5xl mb-4">
                        Help Center
                    </h1>
                    <p className="text-xl text-base-content/70">
                        Frequently asked questions and support
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="collapse collapse-plus bg-base-100 border border-base-300 rounded-box">
                            <input type="radio" name="my-accordion-3" defaultChecked={index === 0} />
                            <div className="collapse-title text-xl font-medium">
                                {faq.question}
                            </div>
                            <div className="collapse-content">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
