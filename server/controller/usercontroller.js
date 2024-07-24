const User = require('../models/usermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Create a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters' })
        }

        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            password: hashedpassword
        })

        const savedUser = await user.save()

        // Generate JWT token
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({ message: 'User created successfully', token, username: name })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Authenticate a user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' })
        }

        const user = await User.findOne({ email })
        const name = user.name 

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({ message: 'User logged in successfully', token, username: name })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.hello = async (req, res) => {
    try {
        res.status(200).json({ message: 'Hello from the server' })
        console.log("hello")
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.userInfo = async (req, res) => {
    res.status(200).json({ message: 'Authentication successful', user: req.user });
};