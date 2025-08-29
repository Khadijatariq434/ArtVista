import express from "express";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.delete("/remove", auth, removeFromCart);
router.post("/update",auth, updateCartItem);
router.delete("/clear",auth, clearCart);
export default router;
