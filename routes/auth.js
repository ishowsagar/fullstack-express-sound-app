import express from "express";
import { registerUser } from "../controllers/authController.js";

export const authRouter = express.Router();

// handles when POST request is made at this relative route --> execute this fnc 👇
authRouter.post("/register", registerUser);

// when POST req is made --> the incoming body to server comes in pieces --> had to collect all first --> then use
