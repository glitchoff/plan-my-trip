import { geocodeSearch, reverseGeocode, autocomplete } from '@/app/lib/geocode-api';

// Edge runtime for faster cold starts and lower latency
export const runtime = 'edge';

/**
 * GET /api/geocode
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'search'; // search, reverse, autocomplete
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const limit = searchParams.get('limit') || '5';

    try {
        let data;

        // Reverse geocoding: coordinates → address
        if (type === 'reverse') {
            data = await reverseGeocode(lat, lon);
        }
        // Autocomplete: fast suggestions for live typing
        else if (type === 'autocomplete') {
            data = await autocomplete(query, limit);
        }
        // Standard search: address → coordinates
        else if (query) {
            data = await geocodeSearch(query, limit);
        }
        else {
            return Response.json(
                { error: 'Missing required parameters: q (query) or lat/lon for reverse' },
                { status: 400 }
            );
        }

        // Return with cache headers for client-side caching
        return Response.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error) {
        console.error('Geocode error:', error);
        return Response.json(
            { error: 'Failed to geocode', details: error.message },
            { status: 500 }
        );
    }
}
