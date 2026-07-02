const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: 'Email already registered',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Create new user
    const newUser = await User.create(email, password, name);

    // Generate JWT token
    const token = generateToken(newUser);

    return res.status(201).json({
      status: 201,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        token: token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error during registration',
      error: 'REGISTRATION_ERROR'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      status: 200,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token: token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error during login',
      error: 'LOGIN_ERROR'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'User profile retrieved',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: 'PROFILE_ERROR'
    });
  }
};

// Logout user (client-side token deletion)
const logout = (req, res) => {
  return res.status(200).json({
    status: 200,
    message: 'Logged out successfully. Please delete the token on the client side.',
    data: {}
  });
};

module.exports = { register, login, getProfile, logout };
