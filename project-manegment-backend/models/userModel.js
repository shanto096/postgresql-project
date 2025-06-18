const bcrypt = require('bcryptjs');
const { pool } = require('../db/db');

const userModel = {
    // নতুন ব্যবহারকারী তৈরি করুন
    create: async(username, email, password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const result = await pool.query(
                'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, password_hash]
            );
            return result.rows[0];
        } catch (error) {
            console.error('error in creating user:', error);
            throw error;
        }
    },

    // ইমেল দ্বারা ব্যবহারকারী খুঁজুন
    findByEmail: async(email) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0];
        } catch (error) {
            console.error('error in finding user by email:', error);
            throw error;
        }
    },

    // আইডি দ্বারা ব্যবহারকারী খুঁজুন
    findById: async(id) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('error in finding user by id:', error);
            throw error;
        }
    },

    // পাসওয়ার্ড যাচাই করুন
    comparePassword: async(password, hash) => {
        return bcrypt.compare(password, hash);
    }
};

module.exports = userModel;