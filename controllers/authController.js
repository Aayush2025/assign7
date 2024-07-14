// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { secret, tokenLife } = require('../config/auth');

exports.register = async (req, res) => {
    try {
        const { name, email, age, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);

        const user = new User({
            name,
            email,
            age,
            password: hashedPassword
        });

        await user.save();

        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ token: null, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: tokenLife });

        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.protectedRoute = (req, res) => {
    res.status(200).send({ message: 'This is a protected route' });
};
