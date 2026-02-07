"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-base-200/80 backdrop-blur-md border-t border-base-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h5 className="font-bold text-base-content mb-4">Company</h5>
                        <ul className="space-y-2 text-base-content/70">
                            <li><a href="/about" className="hover:text-primary transition-colors">{t('about')}</a></li>
                            <li><a href="/announcements" className="hover:text-primary transition-colors">Announcements</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-base-content mb-4">{t('support')}</h5>
                        <ul className="space-y-2 text-base-content/70">
                            <li><a href="/help" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-base-content mb-4">Connect</h5>
                        <ul className="space-y-2 text-base-content/70">
                            <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                            {/* Social Dropdowns */}
                            {[
                                {
                                    platform: "LinkedIn",
                                    members: [
                                        { name: "Abhay", url: "https://www.linkedin.com/in/abhay-kumar-259064228?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
                                        { name: "Abhideep", url: "https://www.linkedin.com/in/abhideep-sinha-82a313324?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
                                        { name: "Adarsh", url: "https://www.linkedin.com/in/adarsh-kumar-patel-01699b313?utm_source=share_via&utm_content=profile&utm_medium=member_android" }
                                    ]
                                },
                                {
                                    platform: "Instagram",
                                    members: [
                                        { name: "Abhay", url: "https://www.instagram.com/abhayglitch?igsh=MWFwaWxxazM5bXE5ag==" },
                                        { name: "Abhideep", url: "https://www.instagram.com/abhideep1803?igsh=OXExMXE3Y3VycHl3" },
                                        { name: "Adarsh", url: "https://www.instagram.com/adarsh.patel07?igsh=MTZ2OXd4N3BhbmZoag==" }
                                    ]
                                }
                            ].map((item) => (
                                <li key={item.platform}>
                                    <details className="group">
                                        <summary className="flex items-center cursor-pointer hover:text-primary transition-colors list-none">
                                            {item.platform}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <ul className="pl-4 mt-2 space-y-1 border-l border-base-content/20 ml-1">
                                            {item.members.map((member) => (
                                                <li key={member.name}>
                                                    <a href={member.url} target={member.url !== "#" ? "_blank" : "_self"} rel={member.url !== "#" ? "noopener noreferrer" : ""} className="block text-sm hover:text-accent transition-colors py-0.5">
                                                        {member.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-base-content mb-4">Product</h5>
                        <ul className="space-y-2 text-base-content/70">
                            <li><a href="/features" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="/pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="/enterprise" className="hover:text-primary transition-colors">Enterprise</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-base-300 text-center text-base-content/50">
                    &copy; {new Date().getFullYear()} PlanMyTrip. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
