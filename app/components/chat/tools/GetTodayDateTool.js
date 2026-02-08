export const GetTodayDateTool = ({ state, input, output, errorText }) => {
    switch (state) {
        case 'input-streaming':
        case 'input-available':
            return (
                <div className="flex items-center gap-2 text-xs opacity-70 my-1 bg-base-300/30 p-2 rounded-lg">
                    <span className="loading loading-dots loading-xs"></span>
                    Checking date...
                </div>
            );
        case 'output-available':
            return (
                <div className="badge badge-neutral gap-2 my-2">
                    📅 Today is {output}
                </div>
            );
        case 'output-error':
            return <div className="text-error text-xs">Error: {errorText}</div>;
        default:
            return null;
    }
};
