import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useCallback } from "react";

const ArtContext = createContext();

export const ArtProvider = ({ children }) => {
  const { token } = useAuth();
  const [arts, setArts] = useState([]);
  const [myArts, setMyArts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0
  });
  
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch all arts with category filtering
  const getArts = useCallback(async (newFilters = null) => {
    setLoading(true);
    try {
      const currentFilters = newFilters || filters;
      const queryParams = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value !== 'all') queryParams.append(key, value);
      });

      const res = await fetch(`${API_URL}/arts?${queryParams}`);
      const data = await res.json();
      
      setArts(data.arts || []);
      setCategories(data.allCategories || []);
      setPagination({
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
        total: data.total || 0
      });
      
      return data;
    } catch (err) {
      console.error("Error fetching arts:", err);
      return { arts: [], allCategories: [], totalPages: 1, currentPage: 1, total: 0 };
    } finally {
      setLoading(false);
    }
  });

  // ✅ Update category filter and fetch arts
  const updateCategoryFilter = useCallback(async (category) => {
    const updatedFilters = { ...filters, category, page: 1 };
    setFilters(updatedFilters);
    return await getArts(updatedFilters);
  });

  // ✅ Load more arts for pagination
  const loadMoreArts = async () => {
    if (pagination.currentPage >= pagination.totalPages) return;
    
    setLoading(true);
    try {
      const nextPage = filters.page + 1;
      const queryParams = new URLSearchParams({
        ...filters,
        page: nextPage
      });

      const res = await fetch(`${API_URL}/arts?${queryParams}`);
      const data = await res.json();
      
      setArts(prev => [...prev, ...(data.arts || [])]);
      setFilters(prev => ({ ...prev, page: nextPage }));
      setPagination({
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || nextPage,
        total: data.total || 0
      });
    } catch (err) {
      console.error("Error loading more arts:", err);
    } finally {
      setLoading(false);
    }
  };

 const getCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/arts/categories`);
      const data = await res.json();
      setCategories(data);
      return data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  })
  const getMyArts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/arts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMyArts(data);
    } catch (err) {
      console.error("Error fetching my arts:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch single art
  const getArtById = async (id) => {
    try {
      const res = await fetch(`${API_URL}/arts/${id}`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching art:", err);
    }
  };

  // ✅ Add new art
  const addArt = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/arts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh arts and categories after adding new art
        await getArts();
        await getCategories();
      }
      return data;
    } catch (err) {
      console.error("Error adding art:", err);
    }
  };

  // ✅ Update art
  const updateArt = async (id, formData) => {
    try {
      const res = await fetch(`${API_URL}/arts/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh arts after update
        await getArts();
      }
      return data;
    } catch (err) {
      console.error("Error updating art:", err);
    }
  };

  // ✅ Delete art
  const deleteArt = async (id) => {
    try {
      const res = await fetch(`${API_URL}/arts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        // Refresh arts after deletion
        await getArts();
      }
    } catch (err) {
      console.error("Error deleting art:", err);
    }
  };

  useEffect(() => {
    getArts();
    getCategories();
  }, []);

  return (
    <ArtContext.Provider
      value={{ 
        arts, 
        myArts, 
        categories,
        loading, 
        filters,
        pagination,
        getArts, 
        getMyArts, 
        getArtById, 
        addArt, 
        updateArt, 
        deleteArt,
        updateCategoryFilter,
        loadMoreArts,
        getCategories
      }}
    >
      {children}
    </ArtContext.Provider>
  );
};

export const useArt = () => useContext(ArtContext);