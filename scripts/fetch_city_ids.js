
// const fetch = require('node-fetch'); // Native fetch in Node 18+

const cities = [
    "Bangalore", "Hyderabad", "Vijayawada", "Chennai", "Visakhapatnam",
    "Tirupathi", "Delhi", "Lucknow", "Madurai", "Manali", "Jaipur",
    "Mumbai", "Pune", "Nagpur", "Nellore", "Coimbatore", "Indore",
    "Ahmedabad", "Rajkot"
];

async function getCityId(city) {
    try {
        const res = await fetch(`https://www.abhibus.com/wap/abus-autocompleter/api/v1/results?s=${city}`);
        const data = await res.json();
        if (data.length > 0) {
            // Find exact match or take first
            const match = data.find(c => c.label.toLowerCase() === city.toLowerCase()) || data[0];
            return { name: city, id: match.value, label: match.label };
        }
    } catch (e) {
        console.error(`Error fetching ${city}:`, e.message);
    }
    return { name: city, id: null };
}

async function main() {
    const results = {};
    for (const city of cities) {
        const info = await getCityId(city);
        results[city] = info;
    }
    console.log(JSON.stringify(results, null, 2));
}

main();
