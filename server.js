const express = require('express');
const User = require('./user');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
mongoose.connect('mongodb://localhost:27017/cinemaDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'pages')));

app.post('/fart', async (req, res) => {
    const {firstName} = req.body;
    const {lastName} = req.body;
    try {
        const user = new User({ firstName, lastName });
        await user.save();
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get('/fart', (req, res) => {
    res.render('fart.ejs', { });
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
        console.error('Error fetching movie data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
