import {Router} from "express";
import { getAllCandidatesController, getMeController, loginController, registerController } from "../Controllers/auth.controller.js";
import authenticateUser from "../Middleware/auth.middleware.js";

const authRouter = Router();



// @route POST /api/auth/register
// method POST
// @desc Register a new user
// @access Private
authRouter.post("/register" , registerController);



// @route POST /api/auth/login
// method POST
// @desc Login a user
// @access Public
authRouter.post("/login", loginController);



// @route GET /api/auth/get-me
// method GET
// @desc Get the logged in user
// @access Private
authRouter.get("/get-me", authenticateUser, getMeController);



// @route GET /api/auth/get-all-candidates
// method GET
// @desc Get all candidates
// @access Private
authRouter.get("/get-all-candidates", authenticateUser, getAllCandidatesController);


export default authRouter;