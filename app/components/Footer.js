import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">

                    {/* Product Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Chat</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Rankings</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Enterprise</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">About</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Announcements</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Privacy</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">Support</a></li>
                        </ul>
                    </div>

                    {/* Connect Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Connect</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">GitHub</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">LinkedIn</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">X</a></li>
                            <li><a href="#" className="text-base text-gray-500 hover:text-blue-600 transition-colors">YouTube</a></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 border-t border-gray-100 pt-8">
                    <p className="text-base text-gray-400 text-center xl:text-left">
                        &copy; {new Date().getFullYear()} PlanMyTrip, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
