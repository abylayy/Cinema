const express = require('express');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')

const app = express();

mongoose.connect('mongodb://localhost:27017/cinemaDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const userRoutes = require('./routes/userRoutes');
const {decode} = require("jsonwebtoken");

app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'e77d7a7b8bde0b3cf4513dA', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        req.userId = decoded.userId;
        next();
    });
};

app.use('/user', userRoutes);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'controllers')));

app.get('/protected', verifyToken, (req, res) => {
   res.json({ message: 'This is protected route!', userId: req.userId });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/styles/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles', 'style.css'));
});

app.get('/scripts/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts', 'index.js'));
});

app.get('/movies', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
