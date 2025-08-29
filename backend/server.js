import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import artRouter from "./routes/artRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import wishlistRouter from "./routes/wishlistRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRouter);
app.use("/api/arts",artRouter);
app.use("/api/cart",cartRouter);
app.use("/api/wishlist", wishlistRouter)

app.get("/", (req, res) => {
  res.send("ArtHive API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
//ddJ5nm0jLVYEObCB