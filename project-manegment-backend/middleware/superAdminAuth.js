const userModel = require('../models/userModel');

module.exports = async function(req, res, next) {
    try {
        const user = await userModel.findById(req.user.id); // req.user.id auth মিডলওয়্যার থেকে আসে
        if (user && user.role === 'super_admin') {
            next(); // সুপার অ্যাডমিন হলে পরবর্তী মিডলওয়্যারে যান
        } else {
            res.status(403).json({ message: 'অনুমতি নেই। এই অ্যাকশনের জন্য সুপার অ্যাডমিন প্রয়োজন।' });
        }
    } catch (error) {
        console.error('সুপার অ্যাডমিন অনুমোদনে ত্রুটি:', error.message);
        res.status(500).json({ message: 'সার্ভার ত্রুটি, অনুমোদন যাচাই করা যায়নি।' });
    }
};