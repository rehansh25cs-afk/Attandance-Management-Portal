import mongoose from "mongoose";
import tasksModel from "../Models/tasks.model.js";
import userModel from "../Models/user.model.js";

export const createTaskController = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            dueDate,
            priority,
            assignedTo,
            status,
        } = req.body;

        const assignedUser = mongoose.isValidObjectId(assignedTo)
            ? await userModel.findById(assignedTo)
            : await userModel.findOne({ name: assignedTo });

        if (!assignedUser) {
            return res.status(404).json({ message: "Assigned user not found" });
        }

        const newTask = await tasksModel.create({
            title,
            description,
            project,
            dueDate,
            priority,
            assignedBy: req.user._id,
            assignedTo: assignedUser._id,
            status,
        });

        return res.status(201).json({
            message: "Task created successfully",
            task: newTask,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllTasksController = async (req, res) => {
    try {
        const tasks = await tasksModel.find()
            .populate("assignedBy", "name email")
            .populate("assignedTo", "name email");

        return res.status(200).json({
            message: "Tasks retrieved successfully",
            tasks,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTaskController = async (req, res) => {
    try {
        const { taskId } = req.params;
        const {
            title,
            description,
            project,
            dueDate,
            priority,
            assignedTo,
            status,
        } = req.body;

        const task = await tasksModel.findByIdAndUpdate(
            taskId,
            {
                title,
                description,
                project,
                dueDate,
                priority,
                assignedTo,
                status,
            },
            { new: true },
        )
            .populate("assignedBy", "name email")
            .populate("assignedTo", "name email");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};