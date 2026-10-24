import {Router } from 'express';
import authenticateUser from '../Middleware/auth.middleware.js';
import { createTaskController, getAllTasksController, updateTaskController } from '../Controllers/tasks.controller.js';


const tasksRouter = Router();



// @Route: POST /api/tasks/create
// @Desc: Create a new task
// @Access: Private
tasksRouter.post("/create", authenticateUser, createTaskController);



// @Route: GET /api/tasks/get-all
// @Desc: Get all tasks
// @Access: Private
tasksRouter.get("/get-all", authenticateUser, getAllTasksController);



// @Route: PATCH /api/tasks/update/:taskId
// @Desc: Update a task
// @Access: Private
tasksRouter.patch("/update/:taskId", authenticateUser, updateTaskController);




export default tasksRouter;