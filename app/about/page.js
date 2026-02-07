"use client";

import Image from "next/image";

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
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                <Image
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80"
                    alt="Travel background"
                    fill
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-20"
                />
                <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
                    <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl animate-fade-in-up">About PlanMyTrip</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300 animate-fade-in-up delay-100">
                            We're on a mission to help people experience the world easier and cheaper. From humble beginnings to a global platform, our journey is all about your journey.
                        </p>
                    </div>
                    <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                        <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div key={stat.label} className="flex flex-col-reverse hover:scale-105 transition-transform duration-300">
                                    <dt className="text-base leading-7 text-gray-300">{stat.label}</dt>
                                    <dd className="text-3xl font-bold leading-9 tracking-tight text-white">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 mb-32">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Values</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We prioritize the traveler's experience above all else. Every feature we build is designed to make travel more accessible, affordable, and enjoyable.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {[
                        { name: 'Customer First', description: 'Our users are at the heart of every decision we make.', icon: '❤️' },
                        { name: 'Transparency', description: 'No hidden fees, no surprise charges. What you see is what you pay.', icon: '🔍' },
                        { name: 'Innovation', description: 'We constantly push boundaries to bring you the best travel tech.', icon: '💡' },
                    ].map((value) => (
                        <div key={value.name} className="relative pl-16 bg-gray-50 p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                            <dt className="text-lg font-bold text-gray-900">
                                <span className="absolute left-6 top-6 h-8 w-8 text-2xl">{value.icon}</span>
                                {value.name}
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">{value.description}</dd>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50 py-24 sm:py-32 rounded-3xl mx-4 mb-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet the Team</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            We’re a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.
                        </p>
                    </div>
                    <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {team.map((person) => (
                            <li key={person.name} className="group">
                                <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-lg">
                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={person.image} alt={person.name} />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">{person.name}</h3>
                                <p className="text-base leading-7 text-gray-600">{person.role}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                        Plan a Trip Now
                    </button>
                </div>
            </div>
            <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h5 className="font-bold text-lg mb-4">Company</h5>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-blue-400">About</a></li>
                                <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-400">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-lg mb-4">Support</h5>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
                        &copy; {new Date().getFullYear()} PlanMyTrip. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
