import { MapPin } from 'lucide-react';

export function GeocodeResult({ formatted_address, lat, lon, city, state, country, postcode }) {
    return (
        <div className="my-2 w-full max-w-md">
            <div className="card bg-base-100 border border-base-200 shadow-sm p-3">
                <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-medium text-sm text-base-content">{formatted_address}</h4>

                        <div className="mt-2 space-y-1 text-xs text-base-content/70">
                            {(city || state) && (
                                <div className="flex gap-2">
                                    {city && <span className="badge badge-sm badge-neutral">{city}</span>}
                                    {state && <span className="badge badge-sm badge-outline">{state}</span>}
                                </div>
                            )}

                            <div className="font-mono bg-base-200 inline-block px-1 rounded mt-1">
                                {lat.toFixed(4)}, {lon.toFixed(4)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
