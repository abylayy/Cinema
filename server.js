const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const appRoutes = require('./routes/appRoutes')
const paypal = require('paypal-rest-sdk');

const app = express();

mongoose.connect('mongodb+srv://abylay0505:Ni81040982@cluster0.vm0zzhi.mongodb.net/cinemaDB', { useNewUrlParser: true, useUnifiedTopology: true })
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

paypal.configure({
    client_id: process.env.ARyeVCsnmg2hFIHcdPAp3OibmmTzUtPhWPxeCJjn7ylZ3hZDaz9MO5HTsler2bPJ_vubylCgUA7dsIpJ,
    client_secret: process.env.EN0CfzOYwfK5abhatDrz6CjQGOQAiNV9ypG7m9iYfitIxF_UJe7dz0i2uBZfhShJUkdooS44nZ4h_ND_
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
