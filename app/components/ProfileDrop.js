"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useLanguage } from "../context/LanguageContext";
import Image from "next/image";

export default function ProfileDrop({ user }) {
    const { t } = useLanguage();
    const [signingOut, setSigningOut] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut({ callbackUrl: "/" });
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                {user.image ? (
                    <Image
                        src={user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-200"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 text-sm">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {signingOut ? "Signing out..." : (t('signOut') || 'Sign Out')}
                    </button>
                </div>
            )}
        </div>
    );
}
