const fs = require('fs');
const path = require('path');
const https = require('https');

const destinationsPath = path.join(__dirname, '../app/lib/destinations.js');

// Helper to make https requests
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'TripWise/1.0 (https://tripwise.example.com; contact@example.com)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

async function resolveWikimediaUrl(filename) {
    // Clean filename: decode URI component locally, but keep it encoded for the API call
    // The filename in the file might be "Hawa_Mahal_Jaipur.jpg" or "Mubarak_Mahal%2C_City_Palace%2C_Jaipur.jpg"
    // We need the raw filename for the API.
    const cleanName = decodeURIComponent(filename); 
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(cleanName)}&prop=imageinfo&iiprop=url&redirects&format=json`;
    
    try {
        const data = await fetchUrl(apiUrl);
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId === '-1') {
             console.error(`File not found: ${cleanName}`);
             return null;
        }
        return pages[pageId].imageinfo[0].url;
    } catch (e) {
        console.error(`Error fetching ${cleanName}:`, e.message);
        return null;
    }
}

async function processDestinations() {
    let content = fs.readFileSync(destinationsPath, 'utf8');
    
    // Regex to find all Special:FilePath URLs
    // matches: https://commons.wikimedia.org/wiki/Special:FilePath/Some_File.jpg
    const regex = /"https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\/([^"]+)"/g;
    
    let match;
    const replacements = new Map();
    
    // 1. Collect all unique filenames
    const matches = [];
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[1]);
    }
    const uniqueFilenames = [...new Set(matches)];
    
    console.log(`Found ${uniqueFilenames.length} unique images to resolve.`);

    // 2. Resolve URLs in chunks to be nice to the API
    for (const filename of uniqueFilenames) {
        process.stdout.write(`Resolving ${decodeURIComponent(filename)}... `);
        const directUrl = await resolveWikimediaUrl(filename);
        if (directUrl) {
            replacements.set(filename, directUrl);
            console.log('OK');
        } else {
            console.log('FAILED');
        }
        // Small delay
        await new Promise(r => setTimeout(r, 100));
    }

    // 3. Replace in content
    console.log('Replacing URLs in file...');
    let newContent = content;
    for (const [filename, directUrl] of replacements) {
        // We need to replace the FULL URL path.
        // The filename in the regex capture group was used to fetch.
        // We replace the original match string.
        const originalUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
        
        // Escape the original URL for regex use in case it has special chars
        // simpler: just use string replaceAll if node version supports it, or split/join
        newContent = newContent.split(originalUrl).join(directUrl);
    }
    
    fs.writeFileSync(destinationsPath, newContent);
    console.log('Done! destinations.js updated.');
}

processDestinations().catch(console.error);
