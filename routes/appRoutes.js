const express = require('express');
const path = require('path');
const axios = require('axios');
const verifyToken = require('../middleware/authMiddlware');
const router = express.Router();

// Importing controllers
const { submitFeedback } = require('../controllers/feedbackController');
const { buySeats, getBookedSeats } = require('../controllers/boughtSeatsController');

// Static file paths
router.use(express.static(path.join(__dirname, '../styles')));
router.use(express.static(path.join(__dirname, '../scripts')));
router.use(express.static(path.join(__dirname, '../pages')));

// Route Definitions

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logout successful' });
});

// Protected route example
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route!', userId: req.userId });
});

// Serve seatBooking page
router.get('/seatBooking', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages', 'seatBooking.html'));
});

// Serve home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages', 'index.html'));
});

router.get('/styles/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../styles', 'style.css'));
});

router.get('/styles/seats.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../styles', 'seats.css'));
});

router.get('/scripts/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../scripts', 'index.js'));
});

// Fetch movies from TMDB API
router.get('/movies', async (req, res) => {
    const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
    const page = req.query.page || 1;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&page=${page}`);
        const movies = response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
});

// Fetch movie details
router.get('/movieDetails/:id', async (req, res) => {
    const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
    const movieId = req.params.id;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
});

// Feedback submission
router.post('/submit-feedback', submitFeedback);

// Bought seats handling
router.post('/boughtSeats', buySeats);
router.get('/bookedSeats/:movieId/:time', getBookedSeats);

module.exports = router;
