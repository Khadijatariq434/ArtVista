import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Check, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AddToCartButton = ({ artId, variant = "default" }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [localAdded, setLocalAdded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await addToCart(artId, 1);
      setLocalAdded(true);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  const alreadyInCart = isInCart(artId) || localAdded;
  const quantity = getItemQuantity(artId) || (localAdded ? 1 : 0);

  if (variant === "icon") {
    return (
      <motion.button
        onClick={handleAddToCart}
        disabled={adding || alreadyInCart}
        className={`p-2 rounded-full transition-all duration-300 ${
          alreadyInCart
            ? "bg-green-100 text-green-600"
            : "bg-white/90 text-[#6e635c] hover:bg-[#f8f5f0] hover:text-[#8a4b3c]"
        } ${adding ? "opacity-75 cursor-not-allowed" : ""}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={alreadyInCart ? "View Cart" : "Add to Cart"}
      >
        <AnimatePresence mode="wait">
          {adding ? (
            <motion.div
              key="loading"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="w-4 h-4"
            >
              <Loader className="w-4 h-4 animate-spin" />
            </motion.div>
          ) : alreadyInCart ? (
            <motion.div
              key="added"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  if (alreadyInCart) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm text-center"
            >
              ✓ Added to cart successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg"
          >
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-700 font-medium">
              In Cart ({quantity})
            </span>
          </motion.div>
          
          <motion.button
            onClick={() => navigate("/cart")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            View Cart
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={handleAddToCart}
      disabled={adding}
      whileHover={{ scale: adding ? 1 : 1.02 }}
      whileTap={{ scale: adding ? 1 : 0.98 }}
      className={`w-full bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 ${
        adding ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      <AnimatePresence mode="wait">
        {adding ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
            />
            <span>Adding...</span>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AddToCartButton;