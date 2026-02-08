import { TrainList } from '@/app/components/chat/TrainList';

export const SearchTrainsTool = ({ state, input, output, errorText }) => {
    switch (state) {
        case 'input-streaming':
        case 'input-available':
            return (
                <div className="flex items-center gap-2 text-xs opacity-70 my-2 bg-base-300/30 p-2 rounded-lg">
                    <span className="loading loading-spinner loading-xs"></span>
                    Searching trains from {input?.from || '...'} to {input?.to || '...'}...
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
                    <TrainList {...output} />
                </div>
            );
        case 'output-error':
            return <div className="text-error text-xs">Error: {errorText}</div>;
        default:
            return null;
    }
};
