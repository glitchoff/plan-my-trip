import { NextResponse } from "next/server";
import { searchBusRoutes } from "@/app/lib/bus-api";

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const fromCityName = searchParams.get("fromCityName");
    const fromCityId = searchParams.get("fromCityId");
    const toCityName = searchParams.get("toCityName");
    const toCityId = searchParams.get("toCityId");
    const dateParam = searchParams.get("date"); // Expecting DD-MMM-YYYY or YYYY-MM-DD

    if (!fromCityId || !toCityId || !dateParam) {
        return NextResponse.json(
            { success: false, error: "Missing required parameters: fromCityId, toCityId, date" },
            { status: 400 }
        );
    }

    try {
        const result = await searchBusRoutes(fromCityId, toCityId, dateParam, fromCityName, toCityName);

        if (!result.success) {
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("Bus search error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                route: {
                    from: fromCityName,
                    to: toCityName,
                    date: dateParam,
                },
            },
            { status: 500 }
        );
    }
}
