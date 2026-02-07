import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const response = await fetch(
            `https://www.abhibus.com/wap/abus-autocompleter/api/v1/results?s=${encodeURIComponent(query)}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`AbhiBus API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform the data to a simpler format
        // The API returns an array of objects
        const formattedResults = Array.isArray(data)
            ? data.map(item => ({
                id: item.id,
                name: item.label, // "Hyderabad"
                subtext: item.display_subtext, // "Telangana"
                type: item.alias_type, // "City"
                // If needed, we can include boarding points or other details
                // boardingPoints: item.boarding_points
            }))
            : [];

        return NextResponse.json({
            success: true,
            results: formattedResults
        });

    } catch (error) {
        console.error("City search error:", error);
        return NextResponse.json(
            { success: false, error: error.message, results: [] },
            { status: 500 }
        );
    }
}
