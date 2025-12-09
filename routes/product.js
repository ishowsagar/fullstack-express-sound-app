import express from "express";
import { getGenres, getProducts } from "../controllers/productControllers.js";
// mini-app that serves routes logic
export const productsRouter = express.Router();

// base route will be - /api/products as base route --> these route are relative to them
productsRouter.get("/", getProducts);
productsRouter.get("/genres", getGenres);
/*
Challenge 1:

  - Use express.Router() to export a router called productsRouter

   It should mount the '/api/products' and '/api/products/genres' routes.
   These should use the two functions from productsControllers.js: getProducts() and getGenres().
   Be careful here - what is the common pitfall?

   hint.md for help!
*/
