const userModel = require('../models/userModel');
const projectModel = require('../models/projectModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authController = {
    // ব্যবহারকারী নিবন্ধন
    register: async(req, res) => {
        const { username, email, password } = req.body;

        try {
            let user = await userModel.findByEmail(email);
            if (user) {
                return res.status(400).json({ message: 'ব্যবহারকারী ইতিমধ্যেই এই ইমেল দিয়ে বিদ্যমান।' });
            }

            user = await userModel.create(username, email, password); // userModel.create এখন ভূমিকা সেট করে

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET, { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    // এখানে user অবজেক্টে role অন্তর্ভুক্ত করুন
                    res.status(201).json({ message: 'নিবন্ধন সফল হয়েছে!', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // ব্যবহারকারী লগইন
    login: async(req, res) => {
        const { email, password } = req.body;

        try {
            const user = await userModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'অবৈধ প্রমাণপত্র।' });
            }

            const isMatch = await userModel.comparePassword(password, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ message: 'অবৈধ প্রমাণপত্র।' });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET, { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    // এখানে user অবজেক্টে role অন্তর্ভুক্ত করুন
                    res.json({ message: 'লগইন সফল হয়েছে!', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // বর্তমানে প্রমাণীকৃত ব্যবহারকারীর তথ্য পান
    getMe: async(req, res) => {
        try {
            const user = await userModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'ব্যবহারকারী পাওয়া যায়নি।' });
            }

            const ownedProjects = await projectModel.getOwnedProjectsByUser(req.user.id);
            const memberships = await projectModel.getMembershipsByUser(req.user.id);

            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role, // নতুন: ব্যবহারকারীর ভূমিকা
                ownedProjects: ownedProjects,
                memberships: memberships
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    }
};

module.exports = authController;