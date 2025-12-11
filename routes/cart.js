import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  addToCart,
  getCartCount,
  getAll,
  deleteItem,
  deleteAll,
} from "../controllers/cartController.js";

export const cartRouter = express.Router();

// handles when POST req is made on this route --> to add item to cart --> executes this callback function
// ! we have set requireAuth mw --> which would not let anyone to do cart things if session does not exists
// ! would not call next() to invoke the next consecutive function
cartRouter.post("/add", requireAuth, addToCart);
cartRouter.get("/cart-count", requireAuth, getCartCount);
cartRouter.get("/", requireAuth, getAll);
cartRouter.delete("/:itemId", requireAuth, deleteItem);
cartRouter.delete("/all", requireAuth, deleteAll);
