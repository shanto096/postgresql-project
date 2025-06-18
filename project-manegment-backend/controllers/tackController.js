const taskModel = require('../models/taskModel');
const projectModel = require('../models/projectModel'); // প্রজেক্ট সদস্যপদ যাচাই করতে

const taskController = {
    // নতুন টাস্ক তৈরি করুন
    createTask: async(req, res) => {
        const { projectId } = req.params;
        const { title, description, assignedTo, dueDate } = req.body;
        const userId = req.user.id;

        try {
            // ব্যবহারকারী প্রজেক্টের সদস্য কিনা তা যাচাই করুন
            const isMember = await projectModel.isMember(projectId, userId);
            if (!isMember) {
                return res.status(403).json({ message: 'এই প্রজেক্টে টাস্ক তৈরি করার অনুমতি নেই।' });
            }

            // যদি assignedTo নির্দিষ্ট করা থাকে, তবে নিশ্চিত করুন যে সে প্রজেক্টের সদস্য
            if (assignedTo) {
                const isAssignedMember = await projectModel.isMember(projectId, assignedTo);
                if (!isAssignedMember) {
                    return res.status(400).json({ message: 'নির্বাচিত ব্যবহারকারী এই প্রজেক্টের সদস্য নন।' });
                }
            }

            const task = await taskModel.create(projectId, assignedTo, title, description, dueDate);
            res.status(201).json({ message: 'টাস্ক সফলভাবে তৈরি হয়েছে!', task });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // একটি প্রজেক্টের সমস্ত টাস্ক পান
    getTasksByProject: async(req, res) => {
        const { projectId } = req.params;
        const userId = req.user.id;

        try {
            // ব্যবহারকারী প্রজেক্টের সদস্য কিনা তা যাচাই করুন
            const isMember = await projectModel.isMember(projectId, userId);
            if (!isMember) {
                return res.status(403).json({ message: 'এই প্রজেক্টের টাস্ক দেখতে অনুমতি নেই।' });
            }

            const tasks = await taskModel.getTasksByProject(projectId);
            res.json(tasks);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // একটি টাস্ক আপডেট করুন
    updateTask: async(req, res) => {
        const { taskId } = req.params;
        const { title, description, status, assignedTo, dueDate } = req.body;
        const userId = req.user.id;

        try {
            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'টাস্ক পাওয়া যায়নি।' });
            }

            // ব্যবহারকারী টাস্কের প্রজেক্টের সদস্য কিনা তা যাচাই করুন
            const isMember = await projectModel.isMember(task.project_id, userId);
            if (!isMember) {
                return res.status(403).json({ message: 'এই টাস্ক আপডেট করার অনুমতি নেই।' });
            }

            // যদি assignedTo আপডেট করা হয়, তবে নিশ্চিত করুন যে নতুন assignee প্রজেক্টের সদস্য
            if (assignedTo && assignedTo !== task.assigned_to) {
                const isAssignedMember = await projectModel.isMember(task.project_id, assignedTo);
                if (!isAssignedMember) {
                    return res.status(400).json({ message: 'নির্বাচিত ব্যবহারকারী এই প্রজেক্টের সদস্য নন।' });
                }
            }

            const updatedTask = await taskModel.update(taskId, title, description, status, assignedTo, dueDate);
            res.json({ message: 'টাস্ক সফলভাবে আপডেট হয়েছে!', updatedTask });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // একটি টাস্কের স্থিতি আপডেট করুন
    updateTaskStatus: async(req, res) => {
        const { taskId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        try {
            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'টাস্ক পাওয়া যায়নি।' });
            }

            // ব্যবহারকারী টাস্কের প্রজেক্টের সদস্য কিনা তা যাচাই করুন
            const isMember = await projectModel.isMember(task.project_id, userId);
            if (!isMember) {
                return res.status(403).json({ message: 'এই টাস্কের স্থিতি আপডেট করার অনুমতি নেই।' });
            }

            const updatedTask = await taskModel.updateStatus(taskId, status);
            res.json({ message: 'টাস্ক স্থিতি সফলভাবে আপডেট হয়েছে!', updatedTask });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    },

    // একটি টাস্ক মুছুন
    deleteTask: async(req, res) => {
        const { taskId } = req.params;
        const userId = req.user.id;

        try {
            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'টাস্ক পাওয়া যায়নি।' });
            }

            // ব্যবহারকারী প্রজেক্টের মালিক কিনা তা পরীক্ষা করুন (শুধুমাত্র মালিক টাস্ক মুছতে পারবে)
            const isOwner = await projectModel.isOwner(task.project_id, userId);
            if (!isOwner) {
                return res.status(403).json({ message: 'এই টাস্ক মুছে ফেলার অনুমতি নেই। শুধুমাত্র প্রজেক্ট মালিক টাস্ক মুছতে পারবে।' });
            }

            const deletedTask = await taskModel.delete(taskId);
            res.json({ message: 'টাস্ক সফলভাবে মুছে ফেলা হয়েছে!', deletedTask });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('সার্ভার ত্রুটি');
        }
    }
};

module.exports = taskController;