const dewapi = require('dew-api');
const axios = require('axios');

async function getMovies(year) {
    try {
        const results = await dewapi.movie.cinesubz(year);
        return results;
    } catch (error) {
        throw new Error(`Failed to fetch movies: ${error.message}`);
    }
}

async function getMovieDetails(url) {
    try {
        const results = await dewapi.movie.cinesubzdl(url);
        return results;
    } catch (error) {
        throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
}

async function getMovieDownloadUrl(url) {
    try {
        // First get movie details which should contain download links
        const details = await dewapi.movie.cinesubzdl(url);
        
        // Extract download links from details
        let downloadLinks = [];
        
        if (details && details.downloadLinks) {
            downloadLinks = details.downloadLinks;
        } else if (details && details.links) {
            downloadLinks = details.links;
        } else if (details && data && data.downloadLinks) {
            downloadLinks = data.downloadLinks;
        }
        
        return {
            movieTitle: details.title || 'Unknown',
            downloadLinks: downloadLinks,
            allData: details
        };
    } catch (error) {
        throw new Error(`Failed to get download URL: ${error.message}`);
    }
}

async function downloadMovie(url, quality = 'HD') {
    try {
        const details = await dewapi.movie.cinesubzdl(url);
        
        // Find download link based on quality
        let downloadUrl = null;
        
        if (details.downloadLinks) {
            const link = details.downloadLinks.find(l => l.quality === quality);
            downloadUrl = link ? link.url : details.downloadLinks[0]?.url;
        }
        
        if (!downloadUrl) {
            throw new Error('No download link found');
        }
        
        // Fetch the movie file
        const response = await axios({
            method: 'GET',
            url: downloadUrl,
            responseType: 'stream'
        });
        
        return response;
    } catch (error) {
        throw new Error(`Failed to download movie: ${error.message}`);
    }
}

module.exports = { getMovies, getMovieDetails, getMovieDownloadUrl, downloadMovie };
