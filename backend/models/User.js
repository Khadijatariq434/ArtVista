import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Art" }]

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
