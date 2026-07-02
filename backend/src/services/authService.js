const axios = require('axios');
const User = require('../models/User');

// Service to handle authentication-related business logic

class AuthService {
  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Check if password is strong
  static isStrongPassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const isLongEnough = password.length >= 6;

    return hasUpperCase && hasLowerCase && hasNumbers && isLongEnough;
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error('Error fetching user');
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updates) {
    try {
      // Add more fields as needed
      const user = await User.update(userId, updates);
      return user;
    } catch (error) {
      throw new Error('Error updating user profile');
    }
  }
}

module.exports = AuthService;
