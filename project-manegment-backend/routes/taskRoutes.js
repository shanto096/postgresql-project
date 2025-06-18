const express = require('express');
const router = express.Router({ mergeParams: true }); // প্যারামিটার মার্জ করুন যাতে projectId অ্যাক্সেস করা যায়

const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/tackController');

// @route   POST api/projects/:projectId/tasks
// @desc    একটি প্রজেক্টে নতুন টাস্ক তৈরি করুন
// @access  Private
router.post('/', authMiddleware, taskController.createTask);

// @route   GET api/projects/:projectId/tasks
// @desc    একটি প্রজেক্টের সমস্ত টাস্ক পান
// @access  Private
router.get('/', authMiddleware, taskController.getTasksByProject);

// @route   PUT api/projects/:projectId/tasks/:taskId
// @desc    একটি টাস্ক আপডেট করুন
// @access  Private
router.put('/:taskId', authMiddleware, taskController.updateTask);

// @route   PATCH api/projects/:projectId/tasks/:taskId/status
// @desc    একটি টাস্কের স্থিতি আপডেট করুন
// @access  Private
router.patch('/:taskId/status', authMiddleware, taskController.updateTaskStatus);

// @route   DELETE api/projects/:projectId/tasks/:taskId
// @desc    একটি টাস্ক মুছুন
// @access  Private (শুধুমাত্র প্রজেক্ট মালিক)
router.delete('/:taskId', authMiddleware, taskController.deleteTask);

module.exports = router;