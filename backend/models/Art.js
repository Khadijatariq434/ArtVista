import mongoose from "mongoose";

const artSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: {type: Number, required: true},
    images: [{ type: String }],
    categories : [{type : String}],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Art", artSchema);
