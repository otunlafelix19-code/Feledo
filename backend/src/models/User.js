const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password, name) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (email, password, name, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id, email, name, created_at, updated_at
      `;
      const result = await pool.query(query, [email, hashedPassword, name]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const { name, email } = updates;
      const query = `
        UPDATE users
        SET name = COALESCE($2, name),
            email = COALESCE($3, email),
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, name, created_at, updated_at
      `;
      const result = await pool.query(query, [id, name, email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = $1';
      await pool.query(query, [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
