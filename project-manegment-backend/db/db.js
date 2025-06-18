const { Pool } = require('pg');
require('dotenv').config(); // .env ফাইল থেকে পরিবেশ ভেরিয়েবল লোড করুন

// PostgreSQL ডেটাবেস সংযোগ পুল সেটআপ করুন
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

// ডেটাবেস সংযোগ পরীক্ষা এবং টেবিল তৈরি ফাংশন
const connectDB = async() => {
    try {
        await pool.connect(); // পুল থেকে একটি ক্লায়েন্ট পান
        console.log('PostgreSQL connected successfully');

        // যদি টেবিল না থাকে তবে সেগুলো তৈরি করুন
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // console.log('users table created successfully');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // console.log('projects table created successfully');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS project_members (
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member', -- e.g., 'admin', 'member'
        PRIMARY KEY (project_id, user_id)
      );
    `);
        // console.log('project_members table created successfully');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        assigned_to UUID REFERENCES users(id) ON DELETE SET NULL, -- টাস্কটি কোন সদস্যকে দেওয়া হয়েছে
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'to-do', -- 'to-do', 'processing', 'done'
        due_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CHECK (status IN ('to-do', 'processing', 'done'))
      );
    `);
        // console.log('tasks table created successfully');

    } catch (error) {
        console.error('PostgreSQL connection failed:', error.message);
        process.exit(1); // অ্যাপ্লিকেশন বন্ধ করুন
    }
};

module.exports = {
    pool,
    connectDB
};