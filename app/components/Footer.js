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
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-base-content mb-4">{t('support')}</h5>
                        <ul className="space-y-2 text-base-content/70">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-base-content mb-4">Connect</h5>
                        <ul className="space-y-2 text-base-content/70">
                            <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">X</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-base-content mb-4">Product</h5>
                        <ul className="space-y-2 text-base-content/70">
                            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
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
