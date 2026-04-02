// server.js
const express = require('express');
const { fetchMovie } = require('./scrap');

const app = express();
const PORT = 3000;

app.use(express.json());

// GET endpoint using query parameter
app.get('/movie', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Please provide a query parameter." });

    try {
        const results = await fetchMovie(query);
        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to fetch movie data." });
    }
});

// POST endpoint using JSON body
app.post('/movie', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Please provide 'query' in body." });

    try {
        const results = await fetchMovie(query);
        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to fetch movie data." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
