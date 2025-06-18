const { pool } = require('../db/db');

const taskModel = {
    // নতুন টাস্ক তৈরি করুন
    create: async(projectId, assignedTo, title, description, dueDate) => {
        try {
            const result = await pool.query(
                'INSERT INTO tasks (project_id, assigned_to, title, description, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *', [projectId, assignedTo, title, description, dueDate]
            );
            return result.rows[0];
        } catch (error) {
            console.error('error in creating task:', error);
            throw error;
        }
    },

    // আইডি দ্বারা টাস্ক খুঁজুন
    findById: async(id) => {
        try {
            const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('error in finding task by id:', error);
            throw error;
        }
    },

    // একটি প্রজেক্টের সমস্ত টাস্ক পান
    getTasksByProject: async(projectId) => {
        try {
            const result = await pool.query(
                `SELECT t.*, u.username as assigned_to_username
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.id
         WHERE t.project_id = $1
         ORDER BY t.created_at ASC`, [projectId]
            );
            return result.rows;
        } catch (error) {
            console.error('error in getting tasks by project:', error);
            throw error;
        }
    },

    // একটি টাস্ক আপডেট করুন
    update: async(id, title, description, status, assignedTo, dueDate) => {
        try {
            const result = await pool.query(
                `UPDATE tasks
         SET title = $1, description = $2, status = $3, assigned_to = $4, due_date = $5
         WHERE id = $6
         RETURNING *`, [title, description, status, assignedTo, dueDate, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('error in updating task:', error);
            throw error;
        }
    },

    // একটি টাস্কের স্থিতি আপডেট করুন
    updateStatus: async(id, status) => {
        try {
            const result = await pool.query(
                `UPDATE tasks
         SET status = $1
         WHERE id = $2
         RETURNING *`, [status, id]
            );
            return result.rows[0];
        } catch (error) {
            console.error('error in updating task status:', error);
            throw error;
        }
    },

    // একটি টাস্ক মুছুন
    delete: async(id) => {
        try {
            const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('error in deleting task:', error);
            throw error;
        }
    }
};

module.exports = taskModel;