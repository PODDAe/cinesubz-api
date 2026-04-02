const dewapi = require('dew-api');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { url, year } = req.query;
    
    // Route 1: cinesubzdl - requires URL parameter
    if (url) {
      const results = await dewapi.movie.cinesubzdl(url);
      return res.status(200).json({
        success: true,
        endpoint: 'cinesubzdl',
        data: results
      });
    }
    
    // Route 2: cinesubz - uses year parameter
    const searchYear = year || '2025';
    const results = await dewapi.movie.cinesubz(searchYear);
    
    res.status(200).json({
      success: true,
      endpoint: 'cinesubz',
      year: searchYear,
      data: results
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};
