const express = require('express');
const { connectDB } = require('./db/db');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes'); // টাস্ক রাউট যোগ করুন
const superAdminRoutes = require('./routes/superAdminRoutes');
require('dotenv').config(); // .env ফাইল থেকে পরিবেশ ভেরিয়েবল লোড করুন
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// ডেটাবেস সংযোগ করুন এবং টেবিল তৈরি করুন
connectDB();

// মিডলওয়্যার
app.use(express.json()); // JSON অনুরোধের বডি পার্স করতে
app.use(cors())

// CORS সক্ষম করুন (যদি আপনার ফ্রন্টএন্ড অন্য ডোমেইনে থাকে)
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // আপনার ফ্রন্টএন্ডের URL
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });


// রাউট সেটআপ করুন
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// প্রজেক্ট আইডি সহ টাস্ক রাউট
app.use('/api/projects/:projectId/tasks', taskRoutes);

app.use('/api/super-admin', superAdminRoutes); //      নতুন: সুপার অ্যাডমিন রাউট যুক্ত করা হয়েছে


// সার্ভার চালু করুন
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}......`);
});