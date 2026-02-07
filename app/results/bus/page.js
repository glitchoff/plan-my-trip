"use client";

export default function BusResults() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-6">🚌</div>
            <h2 className="text-3xl font-bold mb-4">Bus Route Options</h2>
            <p className="text-xl text-base-content/60 max-w-lg mb-8">
                We are searching for the best bus routes for your journey. This feature is coming soon with real-time tracking and booking!
            </p>
            <div className="flex flex-col gap-4 w-full max-w-md">
                {/* Mock Results */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card bg-base-100 shadow-sm border border-base-200 p-6 flex flex-row items-center gap-4 opacity-50 select-none">
                        <div className="bg-base-200 p-3 rounded-xl">🚌</div>
                        <div className="flex-1 text-left">
                            <div className="h-4 w-3/4 bg-base-300 rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-base-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
