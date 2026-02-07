"use client";

import Image from "next/image";
import BackgroundSlider from "../components/BackgroundSlider";

export default function About() {
    const stats = [
        { label: 'Happy Travelers', value: '50k+' },
        { label: 'Destinations', value: '100+' },
        { label: 'Hotel Partners', value: '1,000+' },
        { label: 'Support', value: '24/7' },
    ];

    const team = [
        {
            name: 'Adarsh Gupta',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
            name: 'Sarah Chen',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
            name: 'Michael Foster',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
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

            {/* Team Section */}
            <div className="mx-auto mt-12 max-w-7xl px-6 sm:mt-16 lg:px-8 mb-12 bg-neutral text-neutral-content dark:bg-primary dark:text-primary-content backdrop-blur-md rounded-3xl p-8 shadow-sm">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-inherit sm:text-4xl">Meet the Team</h2>
                    <p className="mt-6 text-lg leading-8 text-inherit/80">
                        We’re a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.
                    </p>
                </div>
                <ul role="list" className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {team.map((person) => (
                        <li key={person.name} className="group bg-base-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="aspect-[3/2] w-full rounded-xl overflow-hidden mb-6">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={person.image} alt={person.name} />
                            </div>
                            <h3 className="text-lg font-semibold leading-8 tracking-tight text-base-content group-hover:text-primary transition-colors">{person.name}</h3>
                            <p className="text-base leading-7 text-base-content/70">{person.role}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-content py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
                    <button className="btn btn-neutral rounded-full font-bold shadow-lg">
                        Plan a Trip Now
                    </button>
                </div>
            </div>
        </div>
    );
}
