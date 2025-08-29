// controllers/wishlistController.js
import User from "../models/User.js";
import Art from "../models/Art.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware (JWT)
    const { artId } = req.body;

    const art = await Art.findById(artId);
    if (!art) return res.status(404).json({ message: "Art not found" });

    const user = await User.findById(userId);
    if (user.wishlist.includes(artId)) {
      return res.status(400).json({ message: "Art already in wishlist" });
    }

    user.wishlist.push(artId);
    await user.save();

    res.json({ message: "Art added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { artId } = req.body;

    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== artId);
    await user.save();

    res.json({ message: "Art removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "wishlist",
        populate: {
          path: "createdBy",
          select: "name" 
        }
      });
     

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
