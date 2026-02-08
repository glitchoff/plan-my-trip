import { GeocodeResult } from '@/app/components/chat/GeocodeResult';

export const GetCoordinatesTool = ({ state, input, output, errorText }) => {
    switch (state) {
        case 'input-streaming':
        case 'input-available':
            return (
                <div className="flex items-center gap-2 text-xs opacity-70 my-2 bg-base-300/30 p-2 rounded-lg">
                    <span className="loading loading-spinner loading-xs"></span>
                    Geocoding: {input?.address || '...'}
                </div>
            );
        case 'output-available':
            if (output?.error) {
                return (
                    <div className="alert alert-error text-xs p-2 mt-2">
                        <span>Error: {output.error}</span>
                    </div>
                );
            }
            return (
                <div className="mt-2 w-full">
                    <GeocodeResult {...output} />
                </div>
            );
        case 'output-error':
            return <div className="text-error text-xs">Error: {errorText}</div>;
        default:
            return null;
    }
};
