
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
        if (!UNSPLASH_ACCESS_KEY) {
            console.error('UNSPLASH_ACCESS_KEY is missing');
            // Fallback to null or return error if strict, but better to just return null image so app doesn't break
            return NextResponse.json({ imageUrl: null });
        }

        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
        
        const response = await fetch(unsplashUrl);

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.status}`);
        }

        const data = await response.json();
        
        let imageUrl = null;
        if (data.results && data.results.length > 0) {
            imageUrl = data.results[0].urls.regular; // Use 'regular' for better quality than 'small' but optimized
        }

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
}
