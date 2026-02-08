export function TrainRoute({ trainNo, stops }) {
    if (!stops || stops.length === 0) {
        return (
            <div className="p-4 bg-base-200 rounded-lg text-center">
                <p className="text-base-content/60">No route details available.</p>
            </div>
        );
    }

    return (
        <div className="my-2 w-full max-w-md bg-base-100 border border-base-200 rounded-lg p-3">
            <h3 className="font-bold text-sm mb-3 px-1">Route: {trainNo}</h3>

            <div className="relative border-l border-base-300 ml-3 space-y-4">
                {stops.map((stop, index) => (
                    <div key={index} className="ml-4 relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary/20 border-2 border-primary"></div>

                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="font-medium text-xs">{stop.station}</div>
                                <div className="text-[10px] opacity-60 font-mono">{stop.code}</div>
                            </div>

                            <div className="text-right text-xs">
                                <div className="font-mono">{stop.arrive === stop.depart ? stop.arrive : `${stop.arrive} - ${stop.depart}`}</div>
                                <div className="text-[10px] opacity-60">Day {stop.day}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
