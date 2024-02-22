const path = require('path')
const axios = require('axios');
const verifyToken = require('../middleware/authMiddlware');
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/user');
const seatBookingPage = path.join(__dirname, '../pages', 'seatBooking.html');

router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logout successful' });
});

router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is protected route!', userId: req.userId });
});

router.get('/seatBooking', (req, res) => {
    res.sendFile(seatBookingPage);
});

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

router.get('/movies', async (req, res) => {
    try {
        const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
        const page = req.query.page || 1; // Get the page from the query parameters
        const pageSize = req.query.pageSize || 10; // Set a default page size

        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&page=${page}`);

        const movies = response.data.results.map(movie => {
            return {
                id: movie.id,
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

router.get('/movieDetails/:id', async (req, res) => {
    try {
        const tmdbApiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
        const movieId = req.params.id;

        if (!movieId) {
            return res.status(400).json({ error: 'Movie ID is missing in the request.' });
        }

        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}`);

        const movieDetails = {};

        for (const [key, value] of Object.entries(response.data)) {
            movieDetails[key] = value;
        }

        res.json(movieDetails);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message, stack: error.stack });
    }
});

router.post('/api/user/add-payment-method', async (req, res) => {
    const { userId, cardNumber, expiryDate, cvv } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { paymentMethod: cardNumber }, { new: true });
        res.send('Payment method updated successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/api/submit-feedback', (req, res) => {
    const { message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abylay0505@gmail.com',
            pass: 'bpte shra ykyk ehxd'
        }
    });

    const mailOptions = {
        from: req.params.email,
        to: 'abylay0505@gmail.com',
        subject: 'New Feedback Received',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).send('Error sending email');
        } else {
            res.send('Feedback sent successfully');
        }
    });
});

module.exports = router;
