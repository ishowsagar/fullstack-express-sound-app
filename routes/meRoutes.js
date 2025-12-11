import express from "express";
import { getCurrentUser } from "../controllers/meController.js";

export const meRouter = express.Router();

// when GET req is made by client on this route --> executes this function
meRouter.get("/", getCurrentUser);
