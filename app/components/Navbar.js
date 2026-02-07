"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import ProfileDrop from "./ProfileDrop";

export default function Navbar() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <nav className="fixed w-full z-50 bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/20 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tighter">
                            {t('planMyTrip')}
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-baseline space-x-4">
                            <Link href="/" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600">
                                {t('home')}
                            </Link>
                            <Link href="/about" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600">
                                {t('about')}
                            </Link>
                            <Link href="/wishlist" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600">
                                {t('wishlist')}
                            </Link>
                            <Link href="/history" className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600">
                                {t('myTrips')}
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <LanguageSelector />
                            {user ? (
                                <ProfileDrop user={user} />
                            ) : (
                                <Link href="/login">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                                        {t('signIn')}
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button could go here */}
                </div>
            </div>
        </nav>
    );
}
