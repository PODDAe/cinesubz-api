// api/movie.js
const { fetchMovie } = require('../scrap');

const OWNER = {
    name: "DCT Dula Dev </>",
    number: "+94752978237"
};

module.exports = async function handler(req, res) {
    try {
        let query = '';

        if (req.method === 'GET') {
            query = req.query.query;
        } else if (req.method === 'POST') {
            const body = await new Promise((resolve, reject) => {
                let data = '';
                req.on('data', chunk => data += chunk);
                req.on('end', () => resolve(JSON.parse(data)));
                req.on('error', err => reject(err));
            });
            query = body.query;
        } else {
            return res.status(405).json({ success: false, error: 'Method not allowed', owner: OWNER });
        }

        if (!query) {
            return res.status(400).json({ success: false, error: 'Please provide a query', owner: OWNER });
        }

        const data = await fetchMovie(query);
        res.status(200).json({ success: true, owner: OWNER, data });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to fetch movie data', owner: OWNER });
    }
};
