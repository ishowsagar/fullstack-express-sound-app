import express from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { logoutUser } from "../controllers/authController.js";

export const authRouter = express.Router();

// handles when POST request is made at this relative route --> execute this fnc 👇
authRouter.post("/register", registerUser);

// handles login as <-- client makes a post req on "/api/auth/login" --> taking the rel path and executing this function
authRouter.post("/login", loginUser);

// handles logging out functionality 
authRouter.get('/logout',logoutUser)

// when POST req is made --> the incoming body to server comes in pieces --> had to collect all first --> then use
