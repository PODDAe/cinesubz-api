const express = require('express');
const { searchMovies, getMovieDownload } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    status: true,
    owner: 'DCT Dula Dev',
    endpoints: {
      search: '/api/cinesubz?q=2025',
      download: '/api/cinesubz?type=download&url=https://cinesubz.lk/...'
    }
  });
});

app.get('/api/cinesubz', async (req, res) => {
  try {
    const { q, url, type = 'search' } = req.query;

    if (type === 'search') {
      if (!q) {
        return res.status(400).json({ status: false, message: 'q is required' });
      }

      const result = await searchMovies(q);
      return res.json({ status: true, type: 'search', result });
    }

    if (type === 'download') {
      if (!url) {
        return res.status(400).json({ status: false, message: 'url is required' });
      }

      const result = await getMovieDownload(url);
      return res.json({ status: true, type: 'download', result });
    }

    res.status(400).json({ status: false, message: 'Invalid type' });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
