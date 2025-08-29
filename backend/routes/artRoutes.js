import express from "express";
import { addArt, getArts, updateArt, deleteArt, getArtById, getMyArts, getCategories } from "../controllers/artController.js";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getArts);
router.get("/my", auth, getMyArts);
router.get("/categories", getCategories);
router.post("/",auth, upload.array("images", 5), addArt); // max 5 images
router.put("/:id", auth, upload.array("images", 5), updateArt);
router.get("/:id",getArtById)
router.delete("/:id", auth, deleteArt);

export default router;
