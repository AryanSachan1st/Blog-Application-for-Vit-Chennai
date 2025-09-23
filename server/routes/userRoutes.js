const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerUser, loginUser, getMe } = require('../controllers/userController');

// User registration
router.post('/signup', registerUser);

// User login
router.post('/login', loginUser);

// Get user data from token
router.get('/me', authMiddleware, getMe);

module.exports = router;
