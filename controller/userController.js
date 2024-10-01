import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import user from "../model/userModel.js";

// Create User
export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get User by ID
// export const getUserById = async (req, res) => {
//     try {
//         const userById = await user.findById(req.params.id);
//         if (!userById) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json(userById);
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// Update User
export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const userToDelete = await user.findByIdAndDelete(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
