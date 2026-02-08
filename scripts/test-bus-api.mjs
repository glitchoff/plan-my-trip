
import { searchBusCities, searchBusRoutes } from '../app/lib/bus-api.js';

async function testBusApi() {
    console.log("Testing searchBusCities...");
    try {
        const cities = await searchBusCities("Hyderabad");
        console.log("Cities found:", cities.length);
        if (cities.length > 0) {
            console.log("First city:", cities[0]);

            // Assuming Hyderabad ID is found. Let's look for Bangalore too to get a valid ID.
            const destCities = await searchBusCities("Bangalore");
            if (destCities.length === 0) {
                console.log("Could not find Bangalore.");
                return;
            }
            const toCity = destCities[0];
            const fromCity = cities[0];

            console.log(`Testing searchBusRoutes from ${fromCity.name}(${fromCity.id}) to ${toCity.name}(${toCity.id})...`);

            // Use a date 2 days from now
            const date = new Date();
            date.setDate(date.getDate() + 2);
            const dateStr = date.toISOString().split('T')[0];

            const routes = await searchBusRoutes(fromCity.id, toCity.id, dateStr, fromCity.name, toCity.name);
            console.log("Success:", routes.success);
            if (routes.success) {
                console.log("Routes found:", routes.totalBuses);
                if (routes.buses && routes.buses.length > 0) {
                    console.log("First bus:", routes.buses[0].operatorName, routes.buses[0].pricing.finalPrice);
                } else {
                    console.log("No buses in list.");
                }
            } else {
                console.error("Route search error:", routes.error);
            }
        } else {
            console.log("No cities found for 'Hyderabad'.");
        }
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testBusApi();
