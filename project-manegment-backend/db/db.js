const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const connectDB = async() => {
    try {
        await pool.connect();
        console.log('PostgreSQL connected successfully ');

        // users টেবিলে role কলাম যোগ করা হয়েছে
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user', -- নতুন role কলাম
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // console.log('users টেবিল তৈরি হয়েছে বা ইতিমধ্যেই বিদ্যমান।');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // console.log('projects টেবিল তৈরি হয়েছে বা ইতিমধ্যেই বিদ্যমান।');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS project_members (
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        PRIMARY KEY (project_id, user_id)
      );
    `);
        // console.log('project_members টেবিল তৈরি হয়েছে বা ইতিমধ্যেই বিদ্যমান।');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'to-do',
        due_date TIMESTAMP WITH TIME ZONE,
        image_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CHECK (status IN ('to-do', 'processing', 'done'))
      );
    `);
        // console.log('tasks টেবিল তৈরি হয়েছে বা ইতিমধ্যেই বিদ্যমান।');

    } catch (error) {
        console.error('PostgreSQL ডেটাবেসের সাথে সংযোগ করতে ব্যর্থ হয়েছে:', error.message);
        process.exit(1);
    }
};

module.exports = {
    pool,
    connectDB
};