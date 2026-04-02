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
    if (!query) return res.status(400).json({ 
        success: false, 
        error: "Please provide a query parameter",
        owner: OWNER 
    });

    try {
        const data = await fetchMovie(query);
        res.json({ success: true, owner: OWNER, data });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to fetch movie data", owner: OWNER });
    }
});

// POST endpoint
app.post('/movie', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ 
        success: false, 
        error: "Please provide 'query' in body",
        owner: OWNER 
    });

    try {
        const data = await fetchMovie(query);
        res.json({ success: true, owner: OWNER, data });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to fetch movie data", owner: OWNER });
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
            POST: "/movie (body: { query: 'your_movie_name' })"
        }
    });
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
