const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/projects
// @desc    নতুন প্রজেক্ট তৈরি করুন
// @access  Private
router.post('/', authMiddleware, projectController.createProject);

// @route   GET api/projects
// @desc    প্রমাণীকৃত ব্যবহারকারীর সমস্ত প্রজেক্ট পান
// @access  Private
router.get('/', authMiddleware, projectController.getUserProjects);

// @route   GET api/projects/:projectId
// @desc    একটি নির্দিষ্ট প্রজেক্টের বিস্তারিত তথ্য পান
// @access  Private (শুধুমাত্র সদস্যরাই দেখতে পারবে)
router.get('/:projectId', authMiddleware, projectController.getProjectById);

// @route   POST api/projects/:projectId/members
// @desc    প্রজেক্টে সদস্য যোগ করুন (শুধুমাত্র মালিক)
// @access  Private
router.post('/:projectId/members', authMiddleware, projectController.addProjectMember);

// @route   GET api/projects/:projectId/members
// @desc    একটি প্রজেক্টের সমস্ত সদস্য পান (শুধুমাত্র সদস্যরাই দেখতে পারবে)
// @access  Private
router.get('/:projectId/members', authMiddleware, projectController.getProjectMembers);

// @route   DELETE api/projects/:projectId/members/:userId
// @desc    একটি প্রজেক্ট থেকে সদস্য সরান (শুধুমাত্র মালিক)
// @access  Private
router.delete('/:projectId/members/:userId', authMiddleware, projectController.removeProjectMember);

module.exports = router;