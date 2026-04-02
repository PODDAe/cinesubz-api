// server.js
const express = require('express');
const cors = require('cors');
const getPort = require('get-port');
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

// Start server on free port
(async () => {
    const PORT = await getPort({ port: 3000 }); // tries 3000 first, then finds free port
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})();