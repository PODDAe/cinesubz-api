// api/scrap.js
const dewapi = require('dew-api');

async function fetchMovie(query) {
    if (!query) throw new Error("Query is required");

    try {
        const results = await dewapi.movie.cinesubz(query);

        // Cleaned output
        const cleaned = results.map(movie => ({
            title: movie.title || movie.name || "Unknown",
            year: movie.year || "",
            thumbnail: movie.thumbnail || "",
            description: movie.description || ""
        }));

        return cleaned;
    } catch (error) {
        console.error("Error fetching movie:", error);
        throw error;
    }
}

module.exports = { fetchMovie };
