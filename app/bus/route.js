import { NextResponse } from "next/server";

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
        // Format date to YYYY-MM-DD for AbhiBus
        const formattedDate = parseDateToISO(dateParam);

        const payload = {
            source: fromCityName || "Unknown",
            sourceid: parseInt(fromCityId),
            destination: toCityName || "Unknown",
            destinationid: parseInt(toCityId),
            jdate: formattedDate,
            prd: "mobile",
            filters: 1,
            isReturnJourney: "0",
            api_exp: {
                exp_feat_getbuslist: "v1",
                exp_ixigo_payment: "B",
                exp_service_cards: "1",
                exp_srp_outlier: "yes",
                exp_srp_sort_weighted: "A",
            },
            clevertapID: "",
        };

        const response = await fetch("https://www.abhibus.com/buslist/v1/services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`AbhiBus API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== "success") {
            throw new Error(data.message || "Failed to fetch bus list");
        }

        // Transform the data to match our internal schema
        const buses = (data.serviceDetailsList || []).map((service, index) => transformBusData(service, index));

        return NextResponse.json({
            success: true,
            route: {
                from: fromCityName,
                to: toCityName,
                date: formattedDate,
            },
            totalBuses: buses.length,
            buses: buses,
            scrapedAt: new Date().toISOString(),
        });
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

/**
 * Convert date string (DD-MMM-YYYY or YYYY-MM-DD) to YYYY-MM-DD
 */
function parseDateToISO(dateStr) {
    // If already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }

    // Handle DD-MMM-YYYY (e.g., 08-Feb-2026)
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        const months = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
            Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
        };
        const day = parts[0].padStart(2, "0");
        const month = months[parts[1]];
        const year = parts[2];

        if (month) {
            return `${year}-${month}-${day}`;
        }
    }

    // Fallback: try parsing as date object
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
    }

    return dateStr; // Return as is if all fails
}

/**
 * Transform AbhiBus service object to our standard Bus object
 */
function transformBusData(service, index) {
    return {
        id: `${service.serviceKey}-${index}`, // Make key unique for UI
        serviceKey: service.serviceKey, // Preserve original ID
        operatorName: service.travelerAgentName,
        busType: service.busTypeName,
        departure: {
            time: service.startTimeTwfFormat, // "17:00"
            timestamp: service.startTimestamp,
            place: service.boardingInfoList?.[0]?.placeName || "",
        },
        arrival: {
            time: service.arriveTimeTwfFormat, // "01:30"
            timestamp: service.arriveTimestamp,
            place: service.droppingInfoList?.[0]?.placeName || "",
        },
        duration: service.travelTime, // "08:30:00"
        availableSeats: parseInt(service.availableSeats) || 0,
        pricing: {
            originalPrice: service.sortFare, // Using sortFare as base
            finalPrice: parseFloat(service.fare),
            currency: "INR",
            discount: 0, // Calculate if needed based on original vs fare
        },
        rating: {
            score: parseFloat(service.rating) || 0,
            reviewCount: parseInt(service.noOfRatings) || 0,
        },
        features: {
            liveTracking: service.is_track_avail === 1,
            ac: service.busTypeName.toLowerCase().includes("ac") && !service.busTypeName.toLowerCase().includes("non-ac"),
            sleeper: service.busTypeName.toLowerCase().includes("sleeper"),
            seater: service.busTypeName.toLowerCase().includes("seater"),
            tags: [], // Can extract from Amenities_list if populated
        },
        offers: {
            promos: [], // Can extract from edgeDeals if needed
        },
        viaRoute: service.viaPlaces,
    };
}
