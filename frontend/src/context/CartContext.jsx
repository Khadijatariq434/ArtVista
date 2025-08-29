import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user && token) {
      getCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, token]);

  const getCart = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch cart: ${res.status}`);
      }
      
      const data = await res.json();
      const validatedData = {
        items: Array.isArray(data?.items) ? data.items : [],
        ...data
      };
      
      setCart(validatedData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching cart:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // --- Optimistic Remove from Cart ---
const removeFromCart = async (artId) => {
  if (!token) {
    setError("Please login to modify cart");
    return null;
  }

  if (operationLoading[`remove_${artId}`]) return null;

  setError(null);
  setOperationLoading(prev => ({ ...prev, [`remove_${artId}`]: true }));

  // Store previous state for rollback
  const previousCart = { 
    ...cart, 
    items: Array.isArray(cart?.items) ? [...cart.items] : []
  };

  try {
    // Optimistically update local state
    setCart(prev => ({
      ...prev,
      items: Array.isArray(prev?.items) ? prev.items.filter(item => item.art?._id !== artId) : []
    }));

    console.log('Sending DELETE request to remove artId:', artId);
    
    const res = await fetch(`${API_URL}/cart/remove`, {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ artId }),
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Not JSON response
      }
      throw new Error(errorData.message || `Failed to remove from cart: ${res.status}`);
    }

    const responseText = await res.text();
    console.log('Response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Invalid response from server');
    }
    
    console.log('Parsed response data:', data);
    
    // Validate and set the response data
    const validatedData = {
      items: Array.isArray(data?.items) ? data.items : [],
      ...data
    };
    
    console.log('Validated data:', validatedData);
    
    setCart(validatedData);
    return validatedData;

  } catch (err) {
    setError(err.message);
    console.error("Error removing from cart:", err);
    // Revert to previous state on error
    setCart(previousCart);
    return null;
  } finally {
    setOperationLoading(prev => ({ ...prev, [`remove_${artId}`]: false }));
  }
};

  // --- Other functions remain the same (addToCart, updateQuantity, clearCart) ---
  const addToCart = async (artId, quantity = 1) => {
    if (!token) {
      setError("Please login to add items to cart");
      return null;
    }

    if (operationLoading[`add_${artId}`]) return null;

    setError(null);
    setOperationLoading(prev => ({ ...prev, [`add_${artId}`]: true }));

    const previousCart = { 
      ...cart, 
      items: Array.isArray(cart?.items) ? [...cart.items] : []
    };

    try {
      setCart(prev => {
        const prevItems = Array.isArray(prev?.items) ? prev.items : [];
        const existing = prevItems.find(item => item.art?._id === artId);
        let newItems;
        if (existing) {
          newItems = prevItems.map(item =>
            item.art?._id === artId ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newItems = [...prevItems, { art: { _id: artId }, quantity }];
        }
        return { ...prev, items: newItems };
      });

      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ artId, quantity }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to add to cart: ${res.status}`);
      }
      
      const data = await res.json();
      const validatedData = {
        items: Array.isArray(data?.items) ? data.items : [],
        ...data
      };
      
      setCart(validatedData);
      return validatedData;
    } catch (err) {
      setError(err.message);
      console.error("Error adding to cart:", err);
      setCart(previousCart);
      return null;
    } finally {
      setOperationLoading(prev => ({ ...prev, [`add_${artId}`]: false }));
    }
  };

  const updateQuantity = async (artId, quantity) => {
    if (!token) {
      setError("Please login to modify cart");
      return null;
    }

    if (quantity < 1) return removeFromCart(artId);

    if (operationLoading[`update_${artId}`]) return null;

    setOperationLoading(prev => ({ ...prev, [`update_${artId}`]: true }));

    const previousCart = { 
      ...cart, 
      items: Array.isArray(cart?.items) ? [...cart.items] : []
    };

    try {
      setCart(prev => ({
        ...prev,
        items: Array.isArray(prev?.items) ? prev.items.map(item =>
          item.art?._id === artId ? { ...item, quantity } : item
        ) : [],
      }));

      const res = await fetch(`${API_URL}/cart/update`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ artId, quantity }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update cart: ${res.status}`);
      }
      
      const data = await res.json();
      const validatedData = {
        items: Array.isArray(data?.items) ? data.items : [],
        ...data
      };
      
      setCart(validatedData);
      return validatedData;
    } catch (err) {
      setError(err.message);
      console.error("Error updating cart:", err);
      setCart(previousCart);
      return null;
    } finally {
      setOperationLoading(prev => ({ ...prev, [`update_${artId}`]: false }));
    }
  };

  const clearCart = async () => {
    if (!token) {
      setError("Please login to modify cart");
      return null;
    }

    if (operationLoading.clear) return null;

    setOperationLoading(prev => ({ ...prev, clear: true }));

    const previousCart = { 
      ...cart, 
      items: Array.isArray(cart?.items) ? [...cart.items] : []
    };

    try {
      setCart({ items: [] });

      const res = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to clear cart: ${res.status}`);
      }
      
      return { message: "Cart cleared successfully" };
    } catch (err) {
      setError(err.message);
      console.error("Error clearing cart:", err);
      setCart(previousCart);
      return null;
    } finally {
      setOperationLoading(prev => ({ ...prev, clear: false }));
    }
  };

  // --- Helper Functions ---
  const getTotalItems = () => {
    if (!cart || !Array.isArray(cart.items)) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const isInCart = (artId) => {
    if (!cart || !Array.isArray(cart.items)) return false;
    return cart.items.some(item => item.art?._id === artId);
  };

  const getItemQuantity = (artId) => {
    if (!cart || !Array.isArray(cart.items)) return 0;
    const item = cart.items.find(item => item.art?._id === artId);
    return item ? item.quantity : 0;
  };

  const isOperationLoading = (operation, artId = null) => {
    const key = artId ? `${operation}_${artId}` : operation;
    return operationLoading[key] || false;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        operationLoading,
        getCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        isInCart,
        getItemQuantity,
        isOperationLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};