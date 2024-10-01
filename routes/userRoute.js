import express from "express";
import { createUser, getAllUsers, updateUser,deleteUser } from "../controller/userController.js";

const router=express.Router();

router.post("/create", createUser);

router.get("/fetch", getAllUsers);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router