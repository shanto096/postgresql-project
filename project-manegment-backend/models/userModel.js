const { pool } = require('../db/db');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // SUPER_ADMIN_EMAIL পেতে

const userModel = {
    // নতুন ব্যবহারকারী তৈরি করুন
    create: async(username, email, password) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // যদি ইমেলটি SUPER_ADMIN_EMAIL হয়, তবে ভূমিকা 'super_admin' সেট করুন
            const role = (email === 'shanto@gmail.com') ? 'super_admin' : 'user';

            const result = await pool.query(
                'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role', [username, email, password_hash, role]
            );
            return result.rows[0];
        } catch (error) {
            console.error('ব্যবহারকারী তৈরিতে ত্রুটি:', error);
            throw error;
        }
    },

    // ইমেল দ্বারা ব্যবহারকারী খুঁজুন
    findByEmail: async(email) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows[0];
        } catch (error) {
            console.error('ইমেল দ্বারা ব্যবহারকারী খুঁজতে ত্রুটি:', error);
            throw error;
        }
    },

    // আইডি দ্বারা ব্যবহারকারী খুঁজুন
    findById: async(id) => {
        try {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('আইডি দ্বারা ব্যবহারকারী খুঁজতে ত্রুটি:', error);
            throw error;
        }
    },

    // সমস্ত ব্যবহারকারী এবং তাদের সম্পর্কিত ডেটা পান
    getAllUsersWithDetails: async() => {
        try {
            // সমস্ত ব্যবহারকারীদের বেসিক তথ্য
            const usersResult = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
            const users = usersResult.rows;

            // প্রতিটি ব্যবহারকারীর জন্য মালিকানাধীন প্রজেক্ট এবং সদস্যপদ পান
            for (let user of users) {
                // মালিকানাধীন প্রজেক্ট
                const ownedProjectsResult = await pool.query(
                    'SELECT id, name FROM projects WHERE owner_id = $1 ORDER BY created_at DESC', [user.id]
                );
                user.owned_projects = ownedProjectsResult.rows;

                // সদস্যপদ (প্রজেক্টের নাম এবং ভূমিকা সহ)
                const membershipsResult = await pool.query(
                    `SELECT pm.project_id, pm.role, p.name as project_name
           FROM project_members pm
           JOIN projects p ON pm.project_id = p.id
           WHERE pm.user_id = $1`, [user.id]
                );
                user.memberships = membershipsResult.rows;
            }
            return users;
        } catch (error) {
            console.error('সমস্ত ব্যবহারকারীর বিস্তারিত তথ্য পেতে ত্রুটি:', error);
            throw error;
        }
    },

    // পাসওয়ার্ড যাচাই করুন
    comparePassword: async(password, hash) => {
        return bcrypt.compare(password, hash);
    },

    // ব্যবহারকারী মুছে ফেলুন
    deleteUser: async(userId) => {
        try {
            // সংশ্লিষ্ট সকল প্রজেক্টের সদস্যপদ মুছে যাবে (ON DELETE CASCADE)
            // মালিকানাধীন প্রজেক্টগুলোও মুছে যাবে (ON DELETE CASCADE)
            // টাস্কের assigned_to null হয়ে যাবে (ON DELETE SET NULL)

            const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            return result.rows[0];
        } catch (error) {
            console.error('ব্যবহারকারী মুছতে ত্রুটি:', error);
            throw error;
        }
    }
};

module.exports = userModel;