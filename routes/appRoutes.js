const express = require('express');
const path = require('path');
const axios = require('axios');
const verifyToken = require('../middleware/authMiddlware');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const cool = require('cool-ascii-faces')


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
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/1080x1580'
        }));
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
});

router.get('/movies/search', async (req, res) => {
    const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
    const query = req.query.query;
    const page = req.query.page || 1; // Default to page 1 if not specified
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: tmdbApiKey,
                query: query,
                page: page
            }
        });
        const movies = response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/1080x1580'
        }));
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie search results:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

router.get('/movies/now', async (req, res) => {
    const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
    const page = req.query.page || 1;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbApiKey}&page=${page}`);
        const movies = response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/1080x1580'
        }));
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
});

router.get('/movies/top', async (req, res) => {
    const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
    const page = req.query.page || 1;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbApiKey}&page=${page}`);
        const movies = response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/1080x1580'
        }));
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
});

router.get('/movies/upcoming', async (req, res) => {
    const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
    const page = req.query.page || 1;

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbApiKey}&page=${page}`);
        const movies = response.data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/1080x1580'
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
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}`);
        const trailers = response.data.results.filter(video => video.type === 'Trailer');
        res.json(trailers);
    } catch (error) {
        console.error('Error fetching movie trailers:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
});

// Feedback submission
router.post('/submit-feedback', submitFeedback);

router.get('/cool', (req, res) => res.send(cool()));

// Bought seats handling
router.post('/boughtSeats', buySeats);
router.get('/bookedSeats/:movieId/:date/:time', getBookedSeats);
router.post('/create-paypal-payment', paymentController.createPayment);
router.get('/execute-paypal-payment', paymentController.executePayment);

module.exports = router;