import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  CreditCard,
  Home,
} from "lucide-react";

const Cart = () => {
  const { cart, loading, error, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [updatingItems, setUpdatingItems] = useState({});
  const [clearing, setClearing] = useState(false);

  const getSubtotal = () => {
    if (!cart?.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.art?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getShipping = () => {
    return getSubtotal() > 0 ? 50 : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const handleRemoveItem = async (artId) => {
    setUpdatingItems((prev) => ({ ...prev, [artId]: true }));
    try {
      await removeFromCart(artId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [artId]: false }));
    }
  };

  const handleUpdateQuantity = async (artId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdatingItems((prev) => ({ ...prev, [artId]: true }));
    try {
      await updateQuantity(artId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [artId]: false }));
    }
  };

  const handleClearCart = async () => {
    setClearing(true);
    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setClearing(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, x: -50 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-[#e8e1d9] border-t-[#8a4b3c] mx-auto mb-4"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            <p>Error: {error}</p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-[#8a4b3c] text-white px-6 py-2 rounded-lg hover:bg-[#723c2f] transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-[#e8e1d9]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ShoppingCart className="h-16 w-16 text-[#d3c8be] mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-light text-[#3a302c] mb-4">Your cart is empty</h2>
            <p className="text-[#6e635c] mb-8 max-w-md mx-auto">
              Looks like you haven't added any artworks to your cart yet. Start exploring our collection to find something you love!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/gallery"
                  className="bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Home className="h-5 w-5" />
                  Browse Gallery
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/wishlist"
                  className="border border-[#e8e1d9] text-[#6e635c] px-8 py-3 rounded-lg hover:bg-[#f8f5f0] transition-colors"
                >
                  View Wishlist
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-[#3a302c] mb-4">Shopping Cart</h1>
          <p className="text-[#6e635c]">
            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#e8e1d9]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-[#3a302c]">Cart Items</h2>
                <button
                  onClick={handleClearCart}
                  disabled={clearing}
                  className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {clearing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Clear Cart
                </button>
              </div>

              <AnimatePresence>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.art?._id}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={itemVariants}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-4 p-4 border border-[#e8e1d9] rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      {/* Art Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={item.art?.images[0]}
                          alt={item.art?.title || "Artwork"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-art.jpg";
                          }}
                        />
                      </div>

                      {/* Art Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#3a302c] truncate">
                          <Link to={`/art/${item.art?._id}`} className="hover:underline">
                            {item.art?.title || "Untitled Artwork"}
                          </Link>
                        </h3>
                        <p className="text-sm text-[#6e635c]">
                          By {item.art?.createdBy?.name || "Unknown Artist"}
                        </p>
                        {item.art?.price && (
                          <p className="text-[#8a4b3c] font-semibold mt-1">
                            ₹{item.art.price}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.art._id, item.quantity - 1)}
                          disabled={updatingItems[item.art._id] || item.quantity <= 1}
                          className="p-1 rounded-md border border-[#e8e1d9] hover:bg-[#f8f5f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="w-8 text-center font-medium text-[#3a302c]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleUpdateQuantity(item.art._id, item.quantity + 1)}
                          disabled={updatingItems[item.art._id]}
                          className="p-1 rounded-md border border-[#e8e1d9] hover:bg-[#f8f5f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.art._id)}
                        disabled={updatingItems[item.art._id]}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove item"
                      >
                        {updatingItems[item.art._id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#e8e1d9] sticky top-8"
            >
              <h2 className="text-xl font-medium text-[#3a302c] mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#6e635c]">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#6e635c]">
                  <span>Shipping</span>
                  <span>₹{getShipping().toFixed(2)}</span>
                </div>

                <div className="border-t border-[#e8e1d9] pt-3">
                  <div className="flex justify-between text-lg font-semibold text-[#3a302c]">
                    <span>Total</span>
                    <span>₹{getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <CreditCard className="h-5 w-5" />
                <a href="/checkout"> Proceed to Checkout</a>
              </motion.button>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/gallery"
                  className="w-full mt-4 border border-[#e8e1d9] text-[#6e635c] py-3 rounded-lg hover:bg-[#f8f5f0] transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;