// routes/wishlistRoutes.js
import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addToWishlist);
router.post("/remove", auth, removeFromWishlist);
router.get("/", auth, getWishlist);

export default router;
