import { NextResponse } from "next/server";
import { searchBusCities } from "@/app/lib/bus-api";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const results = await searchBusCities(query);
        return NextResponse.json({
            success: true,
            results: results
        });

    } catch (error) {
        console.error("City search error:", error);
        return NextResponse.json(
            { success: false, error: error.message, results: [] },
            { status: 500 }
        );
    }
}
