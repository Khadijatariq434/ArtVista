import Cart from "../models/Cart.js";
import Art from "../models/Art.js";

const calculateTotal = async (items) => {
  let total = 0;
  for (let item of items) {
    const art = await Art.findById(item.art);
    if (art) {
      total += art.price * item.quantity;
    }
  }
  return total;
};

export const addToCart = async (req, res) => {
  try {
    const { artId, quantity } = req.body;
    const userId = req.user.id;

    const art = await Art.findById(artId);
    if (!art) {
      return res.status(404).json({ message: "Art not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.art.toString() === artId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ art: artId, quantity: quantity || 1 });
    }

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate("items.art");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.art",
      populate: {
        path: "createdBy",
        select: "name" // include only the name field or add more if needed
      }
    });

    if (!cart) {
      return res.json({ items: [], totalPrice: 0, user: userId });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { artId } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.art.toString() !== artId);
    cart.totalPrice = await calculateTotal(cart.items);

    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate("items.art");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { artId, quantity } = req.body;
    const userId = req.user.id;

    const art = await Art.findById(artId);
    if (!art) {
      return res.status(404).json({ message: "Art not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.art.toString() === artId);

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    } else if (quantity > 0) {
      cart.items.push({ art: artId, quantity });
    }

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate("items.art");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    
    res.json({ message: "Cart cleared successfully", items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};