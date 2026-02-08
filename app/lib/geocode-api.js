const GEOAPIFY_API_KEY = process.env.GEOCODING;
const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1/geocode';

/**
 * Geocode text to coordinates
 * @param {string} query - The address/location to search
 * @param {number} limit - Max results
 * @returns {Promise<Object>}
 */
export async function geocodeSearch(query, limit = 5) {
    if (!GEOAPIFY_API_KEY) {
        throw new Error('Geoapify API key not configured');
    }
    if (!query) {
        throw new Error('Query parameter is required');
    }

    const url = `${GEOAPIFY_BASE_URL}/search?text=${encodeURIComponent(query)}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        throw new Error(`Geoapify API error: ${response.status}`);
    }

    return await response.json();
}

/**
 * Reverse geocode coordinates to address
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(lat, lon) {
    if (!GEOAPIFY_API_KEY) {
        throw new Error('Geoapify API key not configured');
    }
    if (!lat || !lon) {
        throw new Error('Latitude and Longitude are required');
    }

    const url = `${GEOAPIFY_BASE_URL}/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        throw new Error(`Geoapify API error: ${response.status}`);
    }

    return await response.json();
}

/**
 * Autocomplete suggestions
 * @param {string} query 
 * @param {number} limit 
 * @returns {Promise<Object>}
 */
export async function autocomplete(query, limit = 5) {
    if (!GEOAPIFY_API_KEY) {
        throw new Error('Geoapify API key not configured');
    }
    if (!query) {
        throw new Error('Query parameter is required');
    }

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
        next: { revalidate: 3600 },
    });

    if (!response.ok) {
        throw new Error(`Geoapify API error: ${response.status}`);
    }

    return await response.json();
}
