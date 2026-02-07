import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const fromCityName = searchParams.get("fromCityName") || "Delhi";
    const fromCityId = searchParams.get("fromCityId") || "67062";
    const toCityName = searchParams.get("toCityName") || "Una";
    const toCityId = searchParams.get("toCityId") || "95380";
    const date = searchParams.get("date") || formatDate(new Date());
    const busType = searchParams.get("busType") || "Any";

    try {
        // Build the RedBus search URL
        const redBusUrl = buildRedBusUrl({
            fromCityName,
            fromCityId,
            toCityName,
            toCityId,
            date,
            busType,
        });

        // Fetch the page HTML
        const response = await fetch(redBusUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Cache-Control": "no-cache",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch RedBus page: ${response.status}`);
        }

        const html = await response.text();
        const buses = parseRedBusHTML(html);

        return NextResponse.json({
            success: true,
            route: {
                from: fromCityName,
                to: toCityName,
                date: date,
            },
            totalBuses: buses.length,
            buses: buses,
            scrapedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("RedBus scraper error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                route: {
                    from: fromCityName,
                    to: toCityName,
                    date: date,
                },
            },
            { status: 500 }
        );
    }
}

/**
 * Build the RedBus search URL with given parameters
 */
function buildRedBusUrl({ fromCityName, fromCityId, toCityName, toCityId, date, busType }) {
    const encodedFromCity = encodeURIComponent(fromCityName);
    const encodedToCity = encodeURIComponent(toCityName);

    return `https://www.redbus.in/search?fromCityName=${encodedFromCity}&fromCityId=${fromCityId}&toCityName=${encodedToCity}&toCityId=${toCityId}&busType=${busType}&onward=${date}`;
}

/**
 * Format date to DD-MMM-YYYY format (e.g., 08-Feb-2026)
 */
function formatDate(date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Parse RedBus HTML and extract bus information
 */
function parseRedBusHTML(html) {
    const $ = cheerio.load(html);
    const buses = [];

    // Select each bus tuple/listing
    $("li.tupleWrapper___d5a78a").each((index, element) => {
        const $bus = $(element);

        // Skip carousel items (duplicates)
        if ($bus.hasClass("carouselTuple__ind-search-styles-module-scss-BcFv2")) {
            return;
        }

        try {
            const bus = extractBusInfo($, $bus);
            if (bus.operatorName) {
                buses.push(bus);
            }
        } catch (err) {
            console.error("Error parsing bus element:", err);
        }
    });

    return buses;
}

/**
 * Extract bus information from a single bus element
 */
function extractBusInfo($, $bus) {
    // Get bus ID from the element
    const busId = $bus.attr("id") || "";

    // Operator name
    const operatorName = $bus.find(".travelsName___3da91c").text().trim();

    // Bus type
    const busType = $bus.find(".busType___e916fc").text().trim();

    // Departure time
    const departureTime = $bus.find(".boardingTime___8cd3ac").text().trim();

    // Arrival time
    const arrivalTime = $bus.find(".droppingTime___ac8c6a").text().trim();

    // Duration
    const duration = $bus.find(".duration___3da8b4").text().trim();

    // Available seats
    const seatsText = $bus.find(".totalSeats___4cda5d").text().trim();
    const availableSeats = parseInt(seatsText) || 0;

    // Price - original (strike-off) price
    const originalPriceText = $bus.find(".strikeOffFare___28c5c9").text().trim();
    const originalPrice = parsePrice(originalPriceText);

    // Price - final/discounted price
    const finalPriceText = $bus.find(".finalFare___0b90fc").text().trim();
    const finalPrice = parsePrice(finalPriceText);

    // Rating
    const ratingText = $bus.find(".rating___082aa7").text().trim();
    const rating = parseFloat(ratingText) || null;

    // Review count
    const reviewCountText = $bus.find(".ratingCount___5c5c15").text().trim();
    const reviewCount = parseInt(reviewCountText) || 0;

    // Has live tracking
    const hasLiveTracking = $bus.find(".liveTracking___67e4b2").length > 0;

    // Offers/Deals
    const offers = [];
    $bus.find(".offerText___a0c81b").each((i, el) => {
        const offerText = $(el).text().trim();
        if (offerText) offers.push(offerText);
    });

    // Red Deal discount
    const redDealText = $bus.find(".discount_text___909e2d").text().trim();
    const redDeal = redDealText || null;

    // Persuasion tags (On Time, Free date change, etc.)
    const tags = [];
    $bus.find(".persuasionTags___406ff3 .label___26b1b6").each((i, el) => {
        const tagText = $(el).text().trim();
        if (tagText) tags.push(tagText);
    });

    // Via route info (if starts from different city)
    const viaRoute = $bus.find(".viaTagText___42d2f5").text().trim() || null;

    // Is Primo bus
    const isPrimo = $bus.find(".heroImg___6335f9").length > 0;

    return {
        id: busId,
        operatorName,
        busType,
        departure: {
            time: departureTime,
        },
        arrival: {
            time: arrivalTime,
        },
        duration,
        availableSeats,
        pricing: {
            originalPrice,
            finalPrice,
            discount: originalPrice && finalPrice ? originalPrice - finalPrice : 0,
            currency: "INR",
        },
        rating: {
            score: rating,
            reviewCount,
        },
        features: {
            hasLiveTracking,
            isPrimo,
            tags,
        },
        offers: {
            redDeal,
            promos: offers,
        },
        viaRoute,
    };
}

/**
 * Parse price string to number
 * @param {string} priceStr - Price string like "₹701" or "₹634.75"
 * @returns {number|null}
 */
function parsePrice(priceStr) {
    if (!priceStr) return null;
    const cleaned = priceStr.replace(/[₹,\s]/g, "");
    const price = parseFloat(cleaned);
    return isNaN(price) ? null : price;
}
