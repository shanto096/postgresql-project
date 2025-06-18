const { pool } = require('../db/db');

const projectModel = {
    // নতুন প্রজেক্ট তৈরি করুন
    create: async(name, description, owner_id) => {
        try {
            const result = await pool.query(
                'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *', [name, description, owner_id]
            );
            // প্রজেক্ট তৈরি হওয়ার পর মালিককে সদস্য হিসেবে যোগ করুন
            await projectModel.addMember(result.rows[0].id, owner_id, 'admin');
            return result.rows[0];
        } catch (error) {
            console.error('প্রজেক্ট তৈরিতে ত্রুটি:', error);
            throw error;
        }
    },

    // আইডি দ্বারা প্রজেক্ট খুঁজুন
    findById: async(id) => {
        try {
            const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('আইডি দ্বারা প্রজেক্ট খুঁজতে ত্রুটি:', error);
            throw error;
        }
    },

    // একজন ব্যবহারকারীর সমস্ত প্রজেক্ট পান (যেখানে তিনি সদস্য)
    getProjectsByUser: async(userId) => {
        try {
            const result = await pool.query(
                `SELECT p.* FROM projects p
         JOIN project_members pm ON p.id = pm.project_id
         WHERE pm.user_id = $1
         ORDER BY p.created_at DESC`, [userId]
            );
            return result.rows;
        } catch (error) {
            console.error('ব্যবহারকারীর প্রজেক্ট পেতে ত্রুটি:', error);
            throw error;
        }
    },

    // একজন ব্যবহারকারীর মালিকানাধীন সমস্ত প্রজেক্ট পান
    getOwnedProjectsByUser: async(ownerId) => {
        try {
            const result = await pool.query(
                'SELECT id, name, description, created_at FROM projects WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]
            );
            return result.rows;
        } catch (error) {
            console.error('মালিকানাধীন প্রজেক্ট পেতে ত্রুটি:', error);
            throw error;
        }
    },

    // একজন ব্যবহারকারীর সদস্যপদগুলি পান (প্রজেক্টের নাম সহ)
    getMembershipsByUser: async(userId) => {
        try {
            const result = await pool.query(
                `SELECT pm.project_id, pm.role, p.name as project_name, p.description as project_description
         FROM project_members pm
         JOIN projects p ON pm.project_id = p.id
         WHERE pm.user_id = $1`, [userId]
            );
            return result.rows;
        } catch (error) {
            console.error('সদস্যপদ পেতে ত্রুটি:', error);
            throw error;
        }
    },

    // প্রজেক্টে সদস্য যোগ করুন
    addMember: async(projectId, userId, role = 'member') => {
        try {
            const existingMember = await pool.query(
                'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]
            );
            if (existingMember.rows.length > 0) {
                return { message: 'ব্যবহারকারী ইতিমধ্যেই এই প্রজেক্টের সদস্য।' };
            }

            const result = await pool.query(
                'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *', [projectId, userId, role]
            );
            return result.rows[0];
        } catch (error) {
            console.error('প্রজেক্টে সদস্য যোগ করতে ত্রুটি:', error);
            throw error;
        }
    },

    // একটি প্রজেক্টের সমস্ত সদস্য পান
    getProjectMembers: async(projectId) => {
        try {
            const result = await pool.query(
                `SELECT u.id, u.username, u.email, pm.role
         FROM project_members pm
         JOIN users u ON pm.user_id = u.id
         WHERE pm.project_id = $1`, [projectId]
            );
            return result.rows;
        } catch (error) {
            console.error('প্রজেক্ট সদস্য পেতে ত্রুটি:', error);
            throw error;
        }
    },

    // একটি প্রজেক্ট থেকে সদস্য সরান
    removeMember: async(projectId, userId) => {
        try {
            const result = await pool.query(
                'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *', [projectId, userId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('প্রজেক্ট থেকে সদস্য সরাতে ত্রুটি:', error);
            throw error;
        }
    },

    // প্রজেক্টের মালিকানা যাচাই করুন
    isOwner: async(projectId, userId) => {
        try {
            const result = await pool.query(
                'SELECT * FROM projects WHERE id = $1 AND owner_id = $2', [projectId, userId]
            );
            return result.rows.length > 0;
        } catch (error) {
            console.error('মালিকানা যাচাই করতে ত্রুটি:', error);
            throw error;
        }
    },

    // প্রজেক্টের সদস্যপদ যাচাই করুন
    isMember: async(projectId, userId) => {
        try {
            const result = await pool.query(
                'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userId]
            );
            return result.rows.length > 0;
        } catch (error) {
            console.error('সদস্যপদ যাচাই করতে ত্রুটি:', error);
            throw error;
        }
    }
};

module.exports = projectModel;