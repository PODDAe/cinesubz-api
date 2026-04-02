// api/scrap.js
const dewapi = require('dew-api');

async function fetchMovie(query) {
    if (!query) throw new Error("Query is required");

    try {
        console.log(`Searching for: ${query}`);
        
        // Try to call the API
        const results = await dewapi.movie.cinesubz(query);
        
        console.log(`Raw results:`, JSON.stringify(results, null, 2));
        
        // Check if results exist
        if (!results || !Array.isArray(results) || results.length === 0) {
            console.log("No results found");
            return [];
        }

        // Cleaned output
        const cleaned = results.map(movie => ({
            title: movie.title || movie.name || "Unknown",
            year: movie.year || "",
            thumbnail: movie.thumbnail || "",
            description: movie.description || ""
        }));

        console.log(`Found ${cleaned.length} movies`);
        return cleaned;
        
    } catch (error) {
        console.error("Detailed error in fetchMovie:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Return empty array instead of throwing
        return [];
    }
}

module.exports = { fetchMovie };
