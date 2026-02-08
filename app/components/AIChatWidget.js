"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bot, Globe, Sparkles, Heart, Plane } from "lucide-react";

const promptMessages = [
    { text: "What type of places do you love to visit?", icon: Heart },
    { text: "What's your international dream destination?", icon: Plane },
    { text: "Tell me about your favourite travel memories!", icon: Sparkles },
    { text: "Need help planning your next adventure?", icon: Globe },
    { text: "Looking for hidden gems to explore?", icon: Sparkles },
];

export default function AIChatWidget() {
    const [isHovered, setIsHovered] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Show first prompt after 3 seconds, then rotate every 5 seconds with animation
    useEffect(() => {
        const showTimer = setTimeout(() => {
            setShowPrompt(true);
            setIsAnimating(true);
        }, 3000);

        const rotateTimer = setInterval(() => {
            // Trigger exit animation
            setIsAnimating(false);
            
            // After exit animation, change message and trigger enter animation
            setTimeout(() => {
                setCurrentPromptIndex((prev) => (prev + 1) % promptMessages.length);
                setIsAnimating(true);
            }, 300);
        }, 5000);

        return () => {
            clearTimeout(showTimer);
            clearInterval(rotateTimer);
        };
    }, []);

    const currentPrompt = promptMessages[currentPromptIndex];
    const PromptIcon = currentPrompt.icon;
    const isVisible = isHovered || showPrompt;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Stream-like speech bubble message */}
            <div 
                className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ease-out ${
                    isVisible 
                        ? (isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95') 
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}
            >
                <div 
                    className="bg-base-100 text-base-content px-4 py-3 rounded-2xl shadow-xl border border-primary/20 flex items-center gap-2"
                    style={{
                        animation: isVisible && isAnimating ? 'messageStream 0.4s ease-out forwards' : 'none'
                    }}
                >
                    <PromptIcon 
                        className="w-4 h-4 text-primary flex-shrink-0"
                        style={{
                            animation: isVisible && isAnimating ? 'iconBounce 0.5s ease-out 0.2s forwards' : 'none'
                        }}
                    />
                    <p 
                        className="text-sm font-medium whitespace-nowrap"
                        style={{
                            animation: isVisible && isAnimating ? 'textFade 0.5s ease-out 0.1s forwards' : 'none'
                        }}
                    >
                        {currentPrompt.text}
                    </p>
                </div>
                {/* Diamond pointer with coordinated animation */}
                <div 
                    className={`absolute -bottom-2 right-6 w-4 h-4 bg-base-100 border-r border-b border-primary/20 transform rotate-45 transition-all duration-300 ${
                        isVisible && isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{
                        transitionDelay: isVisible && isAnimating ? '0.15s' : '0s'
                    }}
                />
            </div>

            {/* Main chat button */}
            <Link
                href="/results/ai-chat"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-primary-content px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
                <Bot className="w-6 h-6" />
                <span className="font-semibold">AI Chat</span>
            </Link>

            {/* Inline keyframe styles */}
            <style jsx>{`
                @keyframes messageStream {
                    0% {
                        opacity: 0;
                        transform: translateX(20px) scale(0.9);
                    }
                    50% {
                        opacity: 0.8;
                        transform: translateX(-5px) scale(1.02);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }
                
                @keyframes iconBounce {
                    0% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    60% {
                        transform: scale(1.3);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes textFade {
                    0% {
                        opacity: 0;
                        transform: translateX(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
