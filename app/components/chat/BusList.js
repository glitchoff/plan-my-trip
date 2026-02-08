
import { Bus, ArrowRight, Star, Clock, IndianRupee } from 'lucide-react';

export function BusList({ buses, totalBuses, route }) {
    if (!buses || buses.length === 0) {
        return (
            <div className="p-4 bg-base-200 rounded-lg text-center">
                <p className="text-base-content/60">No buses found for this route.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 my-2 w-full max-w-md">
            <div className="flex justify-between items-center text-xs opacity-70 px-1">
                <span>{route?.from} to {route?.to}</span>
                <span>{route?.date}</span>
            </div>

            <div className="space-y-2">
                {buses.map((bus, index) => (
                    <div key={index} className="card bg-base-100 border border-base-200 shadow-sm p-3 hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-sm text-base-content">{bus.operator}</h4>
                                <span className="badge badge-xs badge-neutral mt-1">{bus.type}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-bold text-primary flex items-center justify-end">
                                    <IndianRupee className="w-3 h-3" />
                                    {bus.price}
                                </span>
                                <span className="text-xs text-success block">{bus.seats} seats left</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-base-content/80 bg-base-200/50 p-2 rounded-lg">
                            <div className="text-center">
                                <div className="font-bold">{bus.departure}</div>
                            </div>
                            <div className="flex flex-col items-center px-2">
                                <ArrowRight className="w-3 h-3 opacity-50" />
                                <span className="text-[10px] opacity-60">Duration N/A</span>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{bus.arrival}</div>
                            </div>
                        </div>

                        {bus.rating > 0 && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-warning">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{bus.rating}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {totalBuses > buses.length && (
                <div className="text-center text-xs opacity-50 pt-1">
                    Showing {buses.length} of {totalBuses} buses
                </div>
            )}
        </div>
    );
}
