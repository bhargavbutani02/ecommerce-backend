const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordMinLength = 6;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ status: false, message: "Invalid email format" });
    }

    if (password.length < passwordMinLength) {
        return res.status(400).json({ status: false, message: `Password must be at least ${passwordMinLength} characters long` });
    }

     try {
        const user = new User({ email, firstName, lastName, password });
        const savedUser = await user.save();
        res.status(201).json({
             status: true,
            user: { id: savedUser._id, email: savedUser.email, firstName: savedUser.firstName, lastName: savedUser.lastName },
            message: "User registered successfully"
        });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ status: false, message: 'User Already Exist. Please Login' });
        } else {
            res.status(500).json({ status: false, message: "Internal server error" });
        }
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: false, message: "Email and Password both are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user){
             return res.status(400).json({ status: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid credentials" });
        }

        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        if (!jwtSecretKey) {
            console.error("JWT_SECRET_KEY is not defined in the environment variables.");
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }

        const data = {
            time: Date(),
            email: email,
        };

        const token = jwt.sign(data, jwtSecretKey);

        res.json({
            status: true,
            email,
            token,
            message: "Login successfully"
        });
    } catch (err) {
        if(!email) {
            return res.status(400).json({ status: false, message: "Invalid credentials" });
        } else {
        res.status(500).json({ status: false, message: "Internal server error" });
        }   
    }

};

