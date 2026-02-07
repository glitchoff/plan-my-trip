
"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

export default function ProfileDrop({ user }) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                {user.user_metadata?.avatar_url ? (
                    <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-gray-200"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                    >
                        {t('signOut') || 'Sign Out'}
                    </button>
                </div>
            )}
        </div>
    );
}
