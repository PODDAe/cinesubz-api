const express = require('express');
const { getMovies, getMovieDetails, getMovieDownloadUrl, downloadMovie } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'CineSubz API is running',
        endpoints: {
            'Get movies by year': '/api/cinesubz?year=2025',
            'Get movie details': '/api/cinesubzdl?url=URL_HERE',
            'Get download links': '/api/movie/download-links?url=URL_HERE',
            'Download movie': '/api/movie/download?url=URL_HERE&quality=HD'
        }
    });
});

// Endpoint 1: Get movies by year
app.get('/api/cinesubz', async (req, res) => {
    try {
        const year = req.query.year || '2025';
        const data = await getMovies(year);
        res.json({
            success: true,
            year: year,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint 2: Get movie details
app.get('/api/cinesubzdl', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL parameter is required',
                example: '/api/cinesubzdl?url=https://cinesubz.lk/movies/example/'
            });
        }
        
        const data = await getMovieDetails(url);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// NEW: Get download links only
app.get('/api/movie/download-links', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL parameter is required',
                example: '/api/movie/download-links?url=https://cinesubz.lk/movies/example/'
            });
        }
        
        const data = await getMovieDownloadUrl(url);
        res.json({
            success: true,
            movieTitle: data.movieTitle,
            downloadLinks: data.downloadLinks,
            availableQualities: data.downloadLinks.map(link => link.quality || 'Unknown')
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// NEW: Download movie file
app.get('/api/movie/download', async (req, res) => {
    try {
        const { url, quality } = req.query;
        
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL parameter is required'
            });
        }
        
        const movieStream = await downloadMovie(url, quality || 'HD');
        
        // Set headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename="movie.mp4"');
        res.setHeader('Content-Type', 'video/mp4');
        
        // Pipe the movie stream to response
        movieStream.data.pipe(res);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   GET /api/cinesubz?year=2025 - Get movies by year`);
    console.log(`   GET /api/cinesubzdl?url=URL - Get movie details`);
    console.log(`   GET /api/movie/download-links?url=URL - Get download links`);
    console.log(`   GET /api/movie/download?url=URL&quality=HD - Download movie`);
});
