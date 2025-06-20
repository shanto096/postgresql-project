const express = require('express');
const router = express.Router();
// সাধারণ অথ মিডলওয়্যার
const superAdminAuth = require('../middleware/superAdminAuth'); // সুপার অ্যাডমিন অথ মিডলওয়্যার
const superAdminController = require('../controllers/superAdminController');
const authMiddleware = require('../middleware/authMiddleware');


// @route   GET /api/super-admin/users
// @desc    সমস্ত ব্যবহারকারীর বিস্তারিত তথ্য পান
// @access  Private (Super Admin Only)
router.get('/users', authMiddleware, superAdminAuth, superAdminController.getAllUsersDetails);

// @route   DELETE /api/super-admin/users/:userIdToDelete
// @desc    একজন ব্যবহারকারীকে মুছুন
// @access  Private (Super Admin Only)
router.delete('/users/:userIdToDelete', authMiddleware, superAdminAuth, superAdminController.deleteUserById);


module.exports = router;