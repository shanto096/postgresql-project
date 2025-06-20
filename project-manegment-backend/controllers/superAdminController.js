const userModel = require('../models/userModel');
// projectModel এখানে সরাসরি প্রয়োজন নাও হতে পারে কারণ userModel ইতিমধ্যেই বিস্তারিত তথ্য আনছে

const superAdminController = {
    // সমস্ত ব্যবহারকারীর বিস্তারিত তথ্য পান
    getAllUsersDetails: async(req, res) => {
        try {
            const users = await userModel.getAllUsersWithDetails();
            res.json(users);
        } catch (error) {
            console.error('সমস্ত ব্যবহারকারীর বিস্তারিত তথ্য পেতে ত্রুটি (Super Admin):', error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // ব্যবহারকারী মুছে ফেলুন
    deleteUserById: async(req, res) => {
        const { userIdToDelete } = req.params; // URL প্যারামিটার থেকে ইউজার আইডি পান

        try {
            // সুপার অ্যাডমিন নিজেকে মুছতে পারবে না
            if (req.user.id === userIdToDelete) {
                return res.status(400).json({ message: 'সুপার অ্যাডমিন নিজেকে মুছতে পারবে না।' });
            }

            const userToDelete = await userModel.findById(userIdToDelete);
            if (!userToDelete) {
                return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি।' });
            }

            // যদি মুছতে চাওয়া ব্যবহারকারীও সুপার অ্যাডমিন হয়, তবে সতর্কতা
            if (userToDelete.role === 'super_admin') {
                // একাধিক সুপার অ্যাডমিন থাকলে, নিশ্চিত করুন যে কমপক্ষে একজন থাকবে
                const allUsers = await userModel.getAllUsersWithDetails();
                const superAdminsCount = allUsers.filter(u => u.role === 'super_admin').length;
                if (superAdminsCount <= 1) {
                    return res.status(400).json({ message: 'আপনি শেষ সুপার অ্যাডমিন ব্যবহারকারীকে মুছতে পারবেন না।' });
                }
            }

            const deletedUser = await userModel.deleteUser(userIdToDelete);
            if (!deletedUser) {
                return res.status(404).json({ message: 'ব্যবহারকারী মুছে ফেলা যায়নি।' });
            }
            res.json({ message: 'ব্যবহারকারী সফলভাবে মুছে ফেলা হয়েছে!', deletedUser });
        } catch (error) {
            console.error('ব্যবহারকারী মুছতে ত্রুটি (Super Admin):', error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    }
};

module.exports = superAdminController;