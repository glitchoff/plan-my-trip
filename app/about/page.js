export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        About PlanMyTrip
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        We are dedicated to making your travel planning experience seamless, affordable, and enjoyable.
                    </p>
                </div>

                {/* Why Choose Us */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Plan With Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">🛡️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Best Price Guarantee</h3>
                            <p className="text-gray-500">We compare prices across hundreds of providers to ensure you get the best deal.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">🌍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach</h3>
                            <p className="text-gray-500">Access to hotels and transport options in over 190 countries worldwide.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">🎧</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-500">Our dedicated customer care team is always here to help you, anytime, anywhere.</p>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="bg-blue-600 rounded-3xl p-8 md:p-16 text-white text-center mb-20">
                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
                        "To empower every traveler to explore the world with confidence, ease, and within their budget."
                    </p>
                </section>

                {/* Customer Care */}
                <section className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Need Help?</h2>
                    <p className="text-gray-500 mb-8">Our support team is just a click away.</p>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30">
                        Contact Customer Care
                    </button>
                </section>
            </div>
        </div>
    );
}
