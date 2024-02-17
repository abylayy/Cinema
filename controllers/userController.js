const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const passwordRegex = /^.{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.create = async (req, res) => {
    if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
        res.status(400).send({ message: 'Fields cannot be empty!' });
        return;
    }

    if (!emailRegex.test(req.body.email)) {
        res.status(400).send({ message: 'Invalid email format!' });
        return;
    }

    if (!passwordRegex.test(req.body.password)) {
        res.status(400).send({ message: 'Password must be at least 8 characters long!' });
        return;
    }

    const user = new UserModel({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    });

    try {
        const savedUser = await user.save();

        const token = jwt.sign({ userId: user.id }, 'e77d7a7b8bde0b3cf4513dA', { expiresIn: '7d' });


        res.status(201).json({ message: "User created successfully!", user: savedUser, token });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating user" });
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
        res.status(400).send({ message: "Data to update can not be empty!" });
        return;
    }

    if (!emailRegex.test(req.body.email)) {
        res.status(400).send({ message: 'Invalid email format!' });
        return;
    }

    if (!passwordRegex.test(req.body.password)) {
        res.status(400).send({ message: 'Password must be at least 8 characters long!' });
        return;
    }
    
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false });
        if (updatedUser) {
            res.json({ message: "User updated successfully.", user: updatedUser });
        } else {
            res.status(404).send({ message: "User not found." });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            res.json({ message: "User deleted successfully!" });
        } else {
            res.status(404).send({ message: "User not found." });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user || !(await user.isValidPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'e77d7a7b8bde0b3cf4513dA', { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error during login' });
    }
};
