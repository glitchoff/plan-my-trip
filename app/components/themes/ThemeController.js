"use client";
import { useEffect, useState, useRef, useCallback, Suspense, lazy } from "react";

// Lazy load the theme icons AND the picker content for optimal bundle splitting
const ThemeIcons = lazy(() => import('./themesicon'));

import { Flower2 } from "lucide-react";

/* Theme and Icons */
const themes = [
    "light", "dark",
    //  "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"
];

const THEME_STORAGE_KEY = 'plan-my-trip-theme-v1';
const DEFAULT_THEME = 'dark';

const getCachedTheme = () => {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
        console.warn("Could not access localStorage", e);
        return null;
    }
};

const setCachedTheme = (theme) => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
        console.warn("Could not save theme to localStorage", e);
    }
};

const getSystemPreference = () => {
    // All our themes are premium dark themes, so we default to mysticGarden
    // We can enhance this later if we add light themes
    return DEFAULT_THEME;
};

// Default icon for SSR
const DefaultIcon = Flower2;

import { cloneElement } from "react";

const ThemePickerContent = ({ isCollapsed, isMobile, trigger }) => {
    // Start with default theme for SSR consistency
    const [current, setCurrent] = useState(DEFAULT_THEME);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Initialize theme on mount (client-side only)
    useEffect(() => {
        const cachedTheme = getCachedTheme();
        const initialTheme = cachedTheme || getSystemPreference();

        // Apply theme immediately
        document.documentElement.setAttribute("data-theme", initialTheme);
        setCurrent(initialTheme);
    }, []);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toggle dropdown
    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Change theme handler
    const changeTheme = useCallback((theme) => {
        if (theme === current) return;

        setCurrent(theme);
        setCachedTheme(theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [current]);

    // Get current icon with fallback (removed old logic)

    return (
        <div className="relative">
            {trigger ? (
                cloneElement(trigger, {
                    ref: buttonRef,
                    onClick: toggleDropdown,
                    "aria-expanded": isOpen,
                    "aria-label": "Change theme"
                })
            ) : (
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    aria-expanded={isOpen}
                    aria-label="Change theme"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-200/50 transition-colors"
                >
                    <Suspense fallback={<DefaultIcon className="h-5 w-5" />}>
                        <ThemeIcons name={current} className="h-5 w-5" />
                    </Suspense>
                    {!isCollapsed && <span className="text-sm">Theme</span>}
                </button>
            )}

            {isOpen && (
                <ul
                    ref={dropdownRef}
                    className={`absolute ${isMobile ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-56 rounded-lg bg-base-100 shadow-lg border border-base-300 p-2 z-50 transition-all duration-150 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                        }`}
                    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                >
                    <Suspense fallback={
                        <li className="px-3 py-2 text-sm text-base-content/50 text-center">
                            Loading themes...
                        </li>
                    }>
                        <li className="px-3 py-2 text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                            Select Theme
                        </li>
                        {themes.map((theme, index) => {
                            return (
                                <li
                                    key={theme}
                                    style={{
                                        transitionDelay: isOpen ? `${index * 20}ms` : '0ms',
                                        transitionProperty: 'opacity, transform',
                                        transitionDuration: '150ms'
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            changeTheme(theme);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${current === theme
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-base-200/50 text-base-content/70 hover:text-base-content'
                                            }`}
                                    >
                                        <Suspense fallback={<Flower2 className="h-4 w-4" />}>
                                            <ThemeIcons name={theme} className="h-4 w-4" />
                                        </Suspense>
                                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                    </button>
                                </li>
                            );
                        })}
                    </Suspense>
                </ul>
            )}
        </div>
    );
};

export const ThemePicker = ({ isCollapsed, isMobile, trigger }) => (
    <Suspense fallback={
        <button className="flex items-center gap-2 rounded-lg px-3 py-2">
            <DefaultIcon className="h-5 w-5" />
            {!isCollapsed && <span className="text-sm">Theme</span>}
        </button>
    }>
        <ThemePickerContent isCollapsed={isCollapsed} isMobile={isMobile} trigger={trigger} />
    </Suspense>
);