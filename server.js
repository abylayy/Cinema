const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const appRoutes = require('./routes/appRoutes')
const paypal = require('@paypal/checkout-server-sdk');

const app = express();

mongoose.connect('mongodb://localhost:27017/cinemaDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const userRoutes = require('./routes/userRoutes');
const {decode} = require("jsonwebtoken");

app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/', appRoutes);
app.use('/api', userRoutes);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'controllers')));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


