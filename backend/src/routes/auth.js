const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.post('/logout', verifyToken, logout);

module.exports = router;
