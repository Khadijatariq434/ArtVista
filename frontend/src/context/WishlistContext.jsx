import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create context
const WishlistContext = createContext();

// Provider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;


  // Fetch wishlist on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }
      
      const wishlistData = await response.json();
      setWishlist(wishlistData);
    } catch (error) {
      setError(error.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (artId) => {
    if (!user) {
      setError('You must be logged in to add to wishlist');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/wishlist/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ artId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }
      
      // If the API returns the updated wishlist, use it
      if (data.wishlist) {
        setWishlist(data.wishlist);
      } else {
        // Otherwise, refetch the wishlist
        await fetchWishlist();
      }
      
      return true;
    } catch (error) {
      setError(error.message || 'Failed to add to wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (artId) => {
    if (!user) {
      setError('You must be logged in to remove from wishlist');
      return false;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/wishlist/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ artId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove from wishlist');
      }
      
      // If the API returns the updated wishlist, use it
      if (data.wishlist) {
        setWishlist(data.wishlist);
      } else {
        // Otherwise, just remove the item from local state
        setWishlist(prev => prev.filter(item => item._id !== artId));
      }
      
      return true;
    } catch (error) {
      setError(error.message || 'Failed to remove from wishlist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleWishlistItem = async (artId) => {
    const isInWishlist = wishlist.some(item => item._id === artId);
    
    if (isInWishlist) {
      return await removeFromWishlist(artId);
    } else {
      return await addToWishlist(artId);
    }
  };

  // Check if an item is in wishlist
  const isInWishlist = (artId) => {
    return wishlist.some(item => item._id === artId);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    isInWishlist,
    fetchWishlist,
    clearError
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;