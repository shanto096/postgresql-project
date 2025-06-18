const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel'); // সদস্য যোগ করার জন্য ব্যবহারকারী খুঁজতে
const { pool } = require('../db/db'); // লেনদেন পরিচালনার জন্য

const projectController = {
    // নতুন প্রজেক্ট তৈরি করুন
    createProject: async(req, res) => {
        const { name, description } = req.body;
        const owner_id = req.user.id; // প্রমাণীকৃত ব্যবহারকারী প্রজেক্টের মালিক

        try {
            const project = await projectModel.create(name, description, owner_id);
            res.status(201).json({ message: 'project created successfully', project });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    },

    // প্রমাণীকৃত ব্যবহারকারীর সমস্ত প্রজেক্ট পান
    getUserProjects: async(req, res) => {
        try {
            const projects = await projectModel.getProjectsByUser(req.user.id);
            res.json(projects);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // একটি নির্দিষ্ট প্রজেক্টের বিস্তারিত তথ্য পান
    getProjectById: async(req, res) => {
        const { projectId } = req.params;
        try {
            const project = await projectModel.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'project not found' });
            }

            // ব্যবহারকারী প্রজেক্টের সদস্য কিনা তা নিশ্চিত করুন
            const isMember = await projectModel.isMember(projectId, req.user.id);
            if (!isMember) {
                return res.status(403).json({ message: 'you are not a member of this project' });
            }

            res.json(project);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    },

    // প্রজেক্টে সদস্য যোগ করুন
    addProjectMember: async(req, res) => {
        const { projectId } = req.params;
        const { email, role } = req.body; // যোগ করার জন্য ব্যবহারকারীর ইমেল

        try {
            // প্রমাণীকৃত ব্যবহারকারী প্রজেক্টের মালিক কিনা তা পরীক্ষা করুন
            const isOwner = await projectModel.isOwner(projectId, req.user.id);
            if (!isOwner) {
                return res.status(403).json({ message: 'you are not the owner of this project' });
            }

            // ইমেল দ্বারা যোগ করার জন্য ব্যবহারকারী খুঁজুন
            const memberToAdd = await userModel.findByEmail(email);
            if (!memberToAdd) {
                return res.status(404).json({ message: 'user not found' });
            }

            // সদস্য যোগ করুন
            const member = await projectModel.addMember(projectId, memberToAdd.id, role);
            res.status(200).json({ message: `${memberToAdd.username} added to the project successfully`, member });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    },

    // একটি প্রজেক্টের সমস্ত সদস্য পান
    getProjectMembers: async(req, res) => {
        const { projectId } = req.params;
        try {
            // ব্যবহারকারী প্রজেক্টের সদস্য কিনা তা নিশ্চিত করুন
            const isMember = await projectModel.isMember(projectId, req.user.id);
            if (!isMember) {
                return res.status(403).json({ message: 'you are not a member of this project' });
            }

            const members = await projectModel.getProjectMembers(projectId);
            res.json(members);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    },

    // একটি প্রজেক্ট থেকে সদস্য সরান
    removeProjectMember: async(req, res) => {
        const { projectId, userId } = req.params; // userId হল সরানোর জন্য সদস্যের আইডি

        try {
            // প্রমাণীকৃত ব্যবহারকারী প্রজেক্টের মালিক কিনা তা পরীক্ষা করুন
            const isOwner = await projectModel.isOwner(projectId, req.user.id);
            if (!isOwner) {
                return res.status(403).json({ message: 'you are not the owner of this project' });
            }

            // নিজেকে সরানোর চেষ্টা করলে বাধা দিন
            if (req.user.id === userId) {
                return res.status(400).json({ message: 'you cannot remove yourself from the project' });
            }

            const removedMember = await projectModel.removeMember(projectId, userId);
            if (!removedMember) {
                return res.status(404).json({ message: 'member not found or not removed' });
            }
            res.json({ message: 'member removed successfully', removedMember });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    }
};

module.exports = projectController;