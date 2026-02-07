"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import ProfileDrop from "./ProfileDrop";
import { ThemePicker } from "./themes/ThemeController";

export default function Navbar() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const user = session?.user;
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <nav className="fixed w-full z-50 bg-base-100/60 backdrop-blur-xl shadow-sm border-b border-base-content/10 supports-[backdrop-filter]:bg-base-100/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary tracking-tighter">
                            {t('planMyTrip')}
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-baseline space-x-4">
                            <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-primary font-semibold bg-primary/10' : 'text-base-content/70 hover:text-primary'}`}>
                                {t('home')}
                            </Link>
                            <Link href="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary font-semibold bg-primary/10' : 'text-base-content/70 hover:text-primary'}`}>
                                {t('about')}
                            </Link>
                            <Link href="/wishlist" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/wishlist') ? 'text-primary font-semibold bg-primary/10' : 'text-base-content/70 hover:text-primary'}`}>
                                {t('wishlist')}
                            </Link>
                            <Link href="/history" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/history') ? 'text-primary font-semibold bg-primary/10' : 'text-base-content/70 hover:text-primary'}`}>
                                {t('myTrips')}
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <LanguageSelector />
                            {user ? (
                                <ProfileDrop user={user} />
                            ) : (
                                <Link href="/login">
                                    <button className="btn btn-primary rounded-full text-sm font-semibold shadow-lg">
                                        {t('signIn')}
                                    </button>
                                </Link>
                            )}
                        </div>
                        <ThemePicker />
                    </div>

                    {/* Mobile menu button could go here */}
                </div>
            </div>
        </nav>
    );
}
