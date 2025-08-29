import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // jis user ka cart hai
    required: true,
  },
  items: [
    {
      art: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Art", // art reference
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
