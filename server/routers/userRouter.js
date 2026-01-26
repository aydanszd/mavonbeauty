const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const {
    AuthRegister,
    AuthLogin,
    AuthGithubCallback,
    GetAllUsersController,
    DeleteUserController,
    UpdateUserController,
    ForgotPassword,
    ResetPassword,
    RefreshToken } = require('../controllers/AuthController');

// Regular register route
router.post('/register', async (req, res) => {
    try {
        console.log('📥 Register request received');
        console.log('Request body:', req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECURITY_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log('✅ User registered successfully:', user.email);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('💥 Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// Regular login route
router.post('/login', async (req, res) => {
    try {
        console.log('📥 Login request received');

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECURITY_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log('✅ User logged in successfully:', user.email);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('💥 Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

router.post('/register', AuthRegister);
router.post('/login', AuthLogin);
router.get('/users', GetAllUsersController);
router.delete('/users/:id', DeleteUserController);
router.put('/users/:id', UpdateUserController);
router.post('/forgot-password', ForgotPassword);
router.post('/reset-password', ResetPassword);
router.post('/refresh-token', RefreshToken);

// EXACT same routes from app.js
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    AuthGithubCallback
);

router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                displayName: req.user.displayName,
                avatar: req.user.photos[0]?.value,
                profileUrl: req.user.profileUrl
            }
        });
    } else {
        res.status(401).json({ message: 'Authenticated deyil' });
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout xətası' });
        }
        res.json({ message: 'Çıxış edildi' });
    });
});

module.exports = router;