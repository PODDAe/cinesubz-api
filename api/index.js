// api/index.js
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { fetchMovie } = require('./scrap');

const app = express();

// API owner info
const OWNER = {
    name: "DCT Dula Dev",
    number: "+94752978237"
};

// Middleware
app.use(cors());
app.use(express.json());

// GET endpoint
app.get('/movie', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ 
            success: false, 
            error: "Please provide a query parameter",
            owner: OWNER 
        });
    }

    try {
        const data = await fetchMovie(query);
        
        if (!data || data.length === 0) {
            return res.json({ 
                success: false, 
                error: "No movies found for your query",
                message: "Try different keywords or check if the movie exists",
                owner: OWNER,
                data: []
            });
        }
        
        res.json({ success: true, owner: OWNER, data, count: data.length });
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch movie data", 
            details: err.message,
            owner: OWNER 
        });
    }
});

// POST endpoint
app.post('/movie', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ 
            success: false, 
            error: "Please provide 'query' in body",
            owner: OWNER 
        });
    }

    try {
        const data = await fetchMovie(query);
        
        if (!data || data.length === 0) {
            return res.json({ 
                success: false, 
                error: "No movies found for your query",
                owner: OWNER,
                data: []
            });
        }
        
        res.json({ success: true, owner: OWNER, data, count: data.length });
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch movie data",
            details: err.message,
            owner: OWNER 
        });
    }
});

// Test endpoint to check API availability
app.get('/test', async (req, res) => {
    try {
        // Test if dew-api is working
        const testQuery = "test";
        const result = await fetchMovie(testQuery);
        res.json({
            success: true,
            message: "API is working",
            dewapi_available: true,
            test_result: result
        });
    } catch (err) {
        res.json({
            success: false,
            message: "dew-api might not be working",
            error: err.message
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Movie API is running",
        owner: OWNER,
        endpoints: {
            GET: "/movie?query=your_movie_name",
            POST: "/movie (body: { query: 'your_movie_name' })",
            TEST: "/test"
        }
    });
});

module.exports = app;
module.exports.handler = serverless(app);
