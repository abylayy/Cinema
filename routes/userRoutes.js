const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Create a new user
router.post('/create', userController.create);

// Login to account
router.post('/login', userController.login);

// Retrieve all users
router.get('/findAll', userController.findAll);

// Retrieve a single user by ID
router.get('/findOne/:id', userController.findOne);

// Update a user by ID
router.put('/update/:id', userController.update);

// Delete a user by ID
router.delete('/destroy/:id', userController.destroy);

module.exports = router;
