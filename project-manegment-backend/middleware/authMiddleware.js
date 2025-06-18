const jwt = require('jsonwebtoken');
require('dotenv').config(); // .env ফাইল থেকে পরিবেশ ভেরিয়েবল লোড করুন

// JWT টোকেন যাচাই করার জন্য মিডলওয়্যার
const authMiddleware = (req, res, next) => {
    // অনুরোধ হেডার থেকে টোকেন পান
    const token = req.header('token');

    // যদি কোনো টোকেন না থাকে
    if (!token) {
        return res.status(401).json({ message: 'no token, authentication denied' });
    }

    try {
        // টোকেন যাচাই করুন
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ব্যবহারকারীকে req অবজেক্টে যোগ করুন
        req.user = decoded.user;
        next(); // পরবর্তী মিডলওয়্যার/রাউটে যান
    } catch (error) {
        res.status(401).json({ message: 'invalid token' });
    }
};

module.exports = authMiddleware;