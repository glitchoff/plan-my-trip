import { Train, Clock, ArrowRight, Calendar } from 'lucide-react';

export function TrainList({ trains, totalDetails }) {
    if (!trains || trains.length === 0) {
        return (
            <div className="p-4 bg-base-200 rounded-lg text-center">
                <p className="text-base-content/60">No trains found for this route.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 my-2 w-full max-w-md">
            <div className="flex justify-between items-center text-xs opacity-70 px-1">
                <span>{totalDetails}</span>
            </div>

            <div className="space-y-2">
                {trains.map((train, index) => (
                    <div key={index} className="card bg-base-100 border border-base-200 shadow-sm p-3 hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-sm text-base-content flex items-center gap-1">
                                    <Train className="w-4 h-4 text-primary" />
                                    {train.name}
                                </h4>
                                <span className="text-xs text-base-content/60">{train.number}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono bg-base-200 px-1 rounded">
                                    {train.duration}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-base-content/80 bg-base-200/50 p-2 rounded-lg">
                            <div className="text-center">
                                <div className="font-bold">{train.departure}</div>
                                <div className="text-[10px] opacity-60">Depart</div>
                            </div>
                            <div className="flex flex-col items-center px-2">
                                <ArrowRight className="w-3 h-3 opacity-50" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{train.arrival}</div>
                                <div className="text-[10px] opacity-60">Arrive</div>
                            </div>
                        </div>

                        <div className="mt-2 text-xs flex gap-1 flex-wrap">
                            {train.days && Object.entries(train.days).map(([day, runs]) => {
                                const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                return (
                                    <span
                                        key={day}
                                        className={`px-1 rounded ${runs == 1 ? 'bg-success/10 text-success' : 'bg-base-200 text-base-content/30'}`}
                                    >
                                        {dayNames[day] ? dayNames[day][0] : day}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
