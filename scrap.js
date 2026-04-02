// scrap.js
const dewapi = require('dew-api');

async function fetchMovie(query) {
    if (!query) throw new Error("Query is required");
    try {
        const results = await dewapi.movie.cinesubz(query);
        return results;
    } catch (error) {
        console.error("Error fetching movie:", error);
        throw error;
    }
}

module.exports = { fetchMovie };
