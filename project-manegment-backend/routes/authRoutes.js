const express = require('express');
const authController = require('../controllers/authController'); // কন্ট্রোলার আমদানি করুন
const authMiddleware = require('../middleware/authMiddleware'); // মিডলওয়্যার আমদানি করুন
const router = express.Router();


// @route   POST api/auth/register
// @desc    ব্যবহারকারী নিবন্ধন
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    ব্যবহারকারী লগইন
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    বর্তমানে প্রমাণীকৃত ব্যবহারকারীর তথ্য পান
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;