export const SearchCityTool = ({ state, input, output, errorText }) => {
    switch (state) {
        case 'input-streaming':
        case 'input-available':
            return (
                <div className="flex items-center gap-2 text-xs opacity-70 my-1 bg-base-300/30 p-2 rounded-lg">
                    <span className="loading loading-dots loading-xs"></span>
                    Finding city: {input?.query || '...'}...
                </div>
            );
        case 'output-available':
            return (
                <div className="text-xs opacity-70 my-1 font-mono bg-base-300/30 p-2 rounded">
                    ✓ Found cities matching "{input?.query || '...'}"
                </div>
            );
        case 'output-error':
            return <div className="text-error text-xs">Error: {errorText}</div>;
        default:
            return null;
    }
};
