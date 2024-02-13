const path = require('path')
const axios = require('axios');
const verifyToken = require('../middleware/authMiddlware');
const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logout successful' });
});

router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is protected route!', userId: req.userId });
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages', 'index.html'));
});

router.get('/styles/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../styles', 'style.css'));
});

router.get('/scripts/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../scripts', 'index.js'));
});

router.get('/movies', async (req, res) => {
    try {
        const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';

        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}`);

        const movies = response.data.results.map(movie => {
            return {
                title: movie.title,
                posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            };
        });

        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }

});

module.exports = router;
