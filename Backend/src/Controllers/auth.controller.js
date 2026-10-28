import userModel from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js"

// register controller 
export const registerController = async (req, res) => {
    const { email, password, name, role, permissions } = req.body;

    try {

        // check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                status: "error",
            })
        }

        // create new user
        const user = await userModel.create({
            email,
            password,
            name,
            role,
            permissions
        })

        // generate jwt token
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "8h" })

        // set cookie
        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully",
            status: "success",
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
        })
    } catch (error) {
        // error handling
        console.log(error);
        return res.status(500).json({ message: `${error.message} || "Server error"` })
    }

}









// login controller
export const loginController = async(req, res) => {

    const { email, password } = req.body;

    try{

        // check if user exists
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "User not found",
                status: "error"
            })
        }

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password)

        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid credentials",
                status: "error"
            })
        }

        // generate jwt token
        const token = jwt.sign({id: user._id}, config.JWT_SECRET, {expiresIn: "8h"})
        res.cookie("token", token)

        res.status(200).json({
            message: "User logged in successfully",
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
            }
        })
        
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: `${error.message} || "Server error"`,
            status: "error"
        })
    }
    
}






// get me controller
export const getMeController = async(req, res) => {

    try{
        const user = req.user;

        res.status(200).json({
            message:  "User fetched successfully",
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
            }
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({message: `${error.message} || "Server error"`})
    }
    
}






// get all Candidates controller
export const getAllCandidatesController = async(req, res) => {

    try{
        const candidates = await userModel.find({ permissions: "candidate" }).select("-password");

        res.status(200).json({
            message:  "Candidates fetched successfully",
            status: "success",
            candidates
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({message: `${error.message} || "Server error"`})
    }
    
}





export const logOutController = async(req, res) => {

    try{
        res.clearCookie("token");
        res.status(200).json({
            message: "User logged out successfully",
            status: "success"
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({message: `${error.message} || "Server error"`})
    }
    
}
