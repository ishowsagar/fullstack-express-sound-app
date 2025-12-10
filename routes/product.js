import express from "express";
import { getGenres, getProducts } from "../controllers/productControllers.js";
// mini-app that serves routes logic
export const productsRouter = express.Router();

// base route will be - /api/products as base route --> these route are relative to them
productsRouter.get("/", getProducts);
productsRouter.get("/genres", getGenres);
