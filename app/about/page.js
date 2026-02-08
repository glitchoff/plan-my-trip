"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BackgroundSlider from "../components/BackgroundSlider";

export default function About() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handlePlanTrip = () => {
        if (status === 'loading') return;
        
        if (session) {
            router.push('/');
        } else {
            router.push('/login');
        }
    };

    const stats = [
        { label: 'Happy Travelers', value: '50k+' },
        { label: 'Destinations', value: '100+' },
        { label: 'Hotel Partners', value: '1,000+' },
        { label: 'Support', value: '24/7' },
    ];



    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden py-12 sm:py-16">

                <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                    <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-bold tracking-tight text-base-content sm:text-6xl animate-fade-in-up hover:scale-105 transition-transform duration-200 cursor-default">About PlanMyTrip</h2>
                        <p className="mt-6 text-lg leading-8 text-base-content/70 animate-fade-in-up delay-100">
                            We're on a mission to help people experience the world easier and cheaper. From humble beginnings to a global platform, our journey is all about your journey.
                        </p>
                    </div>
                    <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                        <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={stat.label} className="flex flex-col-reverse hover:scale-105 transition-transform duration-300">
                                    <dt className="text-base leading-7 text-base-content/70">{stat.label}</dt>
                                    <dd className="text-3xl font-bold leading-9 tracking-tight text-base-content">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="mx-auto mt-12 max-w-7xl px-6 sm:mt-16 lg:px-8 mb-12 bg-neutral text-neutral-content dark:bg-primary dark:text-primary-content backdrop-blur-md rounded-3xl p-8 shadow-sm">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-inherit sm:text-4xl">Our Values</h2>
                    <p className="mt-6 text-lg leading-8 text-inherit/80">
                        We prioritize the traveler's experience above all else. Every feature we build is designed to make travel more accessible, affordable, and enjoyable.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {[
                        { name: 'Customer First', description: 'Our users are at the heart of every decision we make.', icon: '❤️' },
                        { name: 'Transparency', description: 'No hidden fees, no surprise charges. What you see is what you pay.', icon: '🔍' },
                        { name: 'Innovation', description: 'We constantly push boundaries to bring you the best travel tech.', icon: '💡' },
                    ].map((value) => (
                        <div key={value.name} className="relative pl-16 bg-base-100 p-6 rounded-2xl hover:bg-base-200 transition-colors">
                            <dt className="text-lg font-bold text-base-content">
                                <span className="absolute left-6 top-6 h-8 w-8 text-2xl">{value.icon}</span>
                                {value.name}
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-base-content/70">{value.description}</dd>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technologies Section */}
            <div className="mx-auto mt-12 max-w-7xl px-6 sm:mt-16 lg:px-8 mb-12">
                <div className="mx-auto max-w-2xl lg:mx-0 mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">Built With</h2>
                    <p className="mt-6 text-lg leading-8 text-base-content/70">
                        Our platform is powered by modern, reliable technologies to deliver the best experience.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {[
                        { name: 'Next.js', icon: 'https://nextjs.org/favicon.ico', description: 'React Framework' },
                        { name: 'React', icon: 'https://react.dev/favicon.ico', description: 'UI Library' },
                        { name: 'Tailwind CSS', icon: 'https://tailwindcss.com/favicons/favicon.ico', description: 'Styling' },
                        { name: 'DaisyUI', icon: 'https://daisyui.com/favicon.ico', description: 'Component Library' },
                        { name: 'Framer Motion', icon: 'https://user-images.githubusercontent.com/38039349/60953119-d3c6f300-a2fc-11e9-9596-4978e5d52180.png', description: 'Animations' },
                        { name: 'Leaflet', icon: 'https://leafletjs.com/docs/images/favicon.ico', description: 'Interactive Maps' },
                        { name: 'Supabase', icon: 'https://supabase.com/favicon/favicon.ico', description: 'Backend & Auth' },
                        { name: 'NextAuth', icon: 'https://authjs.dev/favicon.ico', description: 'Authentication' },
                        { name: 'Vercel AI SDK', icon: 'https://vercel.com/favicon.ico', description: 'AI Integration' },
                        { name: 'Lucide React', icon: 'https://lucide.dev/favicon.ico', description: 'Icons' },
                        { name: 'Zod', icon: 'https://zod.dev/icon.png?39fe259ddd7f4224', description: 'Validation' },
                    ].map((tech) => (
                        <div 
                            key={tech.name} 
                            className="group relative flex flex-col items-center p-4 rounded-2xl bg-base-200 hover:bg-base-300 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default"
                        >
                            <img 
                                src={tech.icon} 
                                alt={tech.name} 
                                className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform duration-200 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="font-semibold text-base-content text-sm text-center">{tech.name}</span>
                            <span className="text-xs text-base-content/60 text-center mt-1">{tech.description}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-content py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
                    <button 
                        onClick={handlePlanTrip}
                        className="btn btn-neutral rounded-full font-bold shadow-lg"
                    >
                        Plan a Trip Now
                    </button>
                </div>
            </div>
        </div>
    );
}
