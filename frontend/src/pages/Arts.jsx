import { useState, useEffect, useRef } from "react";
import { useArt } from "../context/ArtContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Star, Heart, Share2, Eye, Check, X, Palette } from "lucide-react";

const sampleArts = [
  {
    _id: "1",
    title: "Sunset Serenity",
    description: "A beautiful landscape painting capturing the peaceful moments of sunset over mountains.",
    price: 2499,
    images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    createdBy: { name: "Emma Thompson" },
    category: "Landscape",
    tags: ["sunset", "mountains", "serene"]
  },
  {
    _id: "2",
    title: "Urban Abstract",
    description: "Modern abstract representation of city life with vibrant colors and dynamic shapes.",
    price: 3200,
    images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    createdBy: { name: "Alex Chen" },
    category: "Abstract",
    tags: ["city", "modern", "vibrant"]
  },
  {
    _id: "3",
    title: "Floral Harmony",
    description: "Delicate watercolor painting of spring flowers in a garden setting.",
    price: 1800,
    images: ["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    createdBy: { name: "Sophia Williams" },
    category: "Floral",
    tags: ["flowers", "spring", "garden"]
  },
  {
    _id: "4",
    title: "Ocean Dreams",
    description: "Impressionist style painting of ocean waves crashing against rocky cliffs.",
    price: 4200,
    images: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    createdBy: { name: "Michael Rodriguez" },
    category: "Seascape",
    tags: ["ocean", "waves", "cliffs"]
  },
  {
    _id: "5",
    title: "Portrait of Silence",
    description: "Emotive portrait capturing a moment of quiet contemplation and inner peace.",
    price: 3800,
    images: ["https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    createdBy: { name: "Jessica Kim" },
    category: "Portrait",
    tags: ["portrait", "emotion", "contemplation"]
  }
];

const Arts = () => {
  const { arts, loading, getArts } = useArt();
  const { 
    wishlist, 
    loading: wishlistLoading, 
    addToWishlist, 
    removeFromWishlist, 
    fetchWishlist
  } = useWishlist();
  const { user } = useAuth();
  const [selectedArt, setSelectedArt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistProcessing, setWishlistProcessing] = useState({});
  const [toast, setToast] = useState(null);
  const [localWishlist, setLocalWishlist] = useState(new Set());
  const artRefs = useRef([]);
  const toastTimeoutRef = useRef(null);
  const [ratings, setRatings] = useState({});

  const displayArts = arts && arts.length > 0 ? arts : sampleArts;
  const isSampleData = arts && arts.length === 0;

  useEffect(() => {
    if (displayArts.length > 0) {
      const newRatings = {};
      displayArts.forEach((art) => {
        newRatings[art._id] = (Math.random() * 1.5 + 3.5).toFixed(1);
      });
      setRatings(newRatings);
    }
  }, [displayArts]);

  useEffect(() => {
    getArts();
  }, []);

  useEffect(() => {
    if (wishlist && Array.isArray(wishlist)) {
      const wishlistIds = new Set(wishlist.map(item => item._id || item));
      setLocalWishlist(wishlistIds);
    }
  }, [wishlist]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    artRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [displayArts]);

  const openModal = (art) => {
    setSelectedArt(art);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArt(null);
  };

  const checkInWishlist = (artId) => {
    return localWishlist.has(artId);
  };

  const handleWishlistToggle = async (artId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!user) {
      showToast("Please log in to add to wishlist", "info");
      return;
    }
    
    if (isSampleData) {
      showToast("Please log in to use wishlist features", "info");
      return;
    }
    
    if (wishlistProcessing[artId]) return;
    
    setWishlistProcessing(prev => ({ ...prev, [artId]: true }));

    try {
      const currentlyInWishlist = checkInWishlist(artId);
      
      if (currentlyInWishlist) {
        setLocalWishlist(prev => {
          const newSet = new Set(prev);
          newSet.delete(artId);
          return newSet;
        });
        
        await removeFromWishlist(artId);
        showToast("Removed from wishlist", "info");
      } else {
        setLocalWishlist(prev => {
          const newSet = new Set(prev);
          newSet.add(artId);
          return newSet;
        });
        
        await addToWishlist(artId);
        showToast("Added to wishlist", "success");
      }
      
      setTimeout(() => {
        fetchWishlist();
      }, 100);
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      showToast("Failed to update wishlist", "error");
      
      setLocalWishlist(prev => {
        const newSet = new Set(prev);
        if (newSet.has(artId)) {
          newSet.delete(artId);
        } else {
          newSet.add(artId);
        }
        return newSet;
      });
    } finally {
      setWishlistProcessing(prev => ({ ...prev, [artId]: false }));
    }
  };

  const generateRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600 font-light">Loading artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-beige-50 min-h-screen">
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`flex items-center p-4 rounded-lg shadow-lg border ${
            toast.type === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            {toast.type === "success" && (
              <Check className="h-5 w-5 mr-2" />
            )}
            {toast.type === "error" && (
              <X className="h-5 w-5 mr-2" />
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-current hover:opacity-70"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-light text-center mb-8 text-gray-800">Art Gallery</h1>
        
        {isSampleData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Palette className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Sample Gallery</span>
            </div>
            <p className="text-blue-700 text-sm">
              Showing sample artworks. 
            </p>
          </div>
        )}
        
        {displayArts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-beige-100 rounded-full flex items-center justify-center">
              <Eye className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-600 font-light">No artworks found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {displayArts.map((art, index) => {
              const randomRating = ratings[art._id] || 4.5;
              const inWishlist = checkInWishlist(art._id);
              const processing = wishlistProcessing[art._id];
              const canAddToWishlist = user && !isSampleData;

              return (
                <div 
                  key={art._id}
                  ref={(el) => (artRefs.current[index] = el)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 opacity-0"
                >
                  <div 
                    className="block group cursor-pointer"
                    onClick={() => openModal(art)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={art.images[0]} 
                        alt={art.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={(e) => handleWishlistToggle(art._id, e)}
                          disabled={processing || wishlistLoading || !canAddToWishlist}
                          className={`p-1.5 rounded-full transition-colors ${
                            inWishlist && canAddToWishlist
                              ? "bg-red-100 text-red-500" 
                              : "bg-white/90 text-gray-600 hover:bg-white"
                          } ${!canAddToWishlist ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={!user ? "Log in to add to wishlist" : (isSampleData ? "Log in to use wishlist" : (inWishlist ? "Remove from wishlist" : "Add to wishlist"))}
                        >
                          {processing ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          ) : (
                            <Heart 
                              className="h-3 w-3" 
                              fill={inWishlist && canAddToWishlist ? "currentColor" : "none"} 
                              stroke="currentColor"
                            />
                          )}
                        </button>
                      </div>
                      {isSampleData && (
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Sample
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <div className="mb-2">
                        <h3 className="font-normal text-gray-800 text-sm line-clamp-1 mb-1">{art.title}</h3>
                        <p className="text-gray-600 text-xs font-light">By {art.createdBy?.name || "Unknown Artist"}</p>
                      </div>
                      
                      <div className="mb-2">
                        {generateRatingStars(randomRating)}
                      </div>

                      <div className="flex justify-between items-center">
                        {art.price && (
                          <p className="text-gray-800 font-normal text-sm">₹{art.price}</p>
                        )}
                        <button 
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isModalOpen && selectedArt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto animate-scale-in shadow-lg">
              <div className="relative">
                <button 
                  onClick={closeModal}
                  className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 z-10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img 
                  src={selectedArt.images[0]} 
                  alt={selectedArt.title} 
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                {isSampleData && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Sample Artwork
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-normal text-gray-800 mb-1 leading-tight">{selectedArt.title}</h2>
                <p className="text-gray-600 text-sm mb-3 font-light">By {selectedArt.createdBy?.name || "Unknown Artist"}</p>
                
                {selectedArt.description && (
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed font-light line-clamp-3">{selectedArt.description}</p>
                )}
                
                <div className="flex justify-between items-center mb-3">
                  {selectedArt.price && (
                    <p className="text-gray-800 font-normal text-lg">₹{selectedArt.price}</p>
                  )}
                  {selectedArt.category && (
                    <span className="bg-beige-100 text-gray-700 text-xs font-light px-2 py-1 rounded-full">
                      {selectedArt.category}
                    </span>
                  )}
                </div>

                {selectedArt.tags && selectedArt.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-normal text-gray-700 mb-1">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedArt.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs font-light px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {!isSampleData ? (
                    <Link 
                      to={`/arts/${selectedArt._id}`}
                      className="flex-1 text-center bg-gray-800 hover:bg-gray-700 text-white text-sm font-light py-2 px-3 rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details
                    </Link>
                  ) : (
                    <button
                      className="flex-1 text-center bg-gray-400 text-white text-sm font-light py-2 px-3 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Sample Only
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(selectedArt._id, e);
                    }}
                    disabled={wishlistLoading || wishlistProcessing[selectedArt._id] || isSampleData || !user}
                    className={`p-2 border rounded-lg transition-colors ${
                      checkInWishlist(selectedArt._id) && user
                        ? "border-red-300 bg-red-50 text-red-500"
                        : "border-gray-300 hover:border-gray-400 text-gray-600"
                    } ${isSampleData || !user ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={!user ? "Log in to add to wishlist" : (isSampleData ? "Log in to use wishlist" : (checkInWishlist(selectedArt._id) ? "Remove from wishlist" : "Add to wishlist"))}
                  >
                    {wishlistProcessing[selectedArt._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Heart 
                        className="h-4 w-4" 
                        fill={checkInWishlist(selectedArt._id) && user ? "currentColor" : "none"} 
                        stroke="currentColor"
                      />
                    )}
                  </button>
                </div>
                
                {isSampleData && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm text-center">
                      This is a sample artwork. Log in to view real artworks and use all features.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .bg-beige-50 {
          background-color: #f8f6f2;
        }
        
        .bg-beige-100 {
          background-color: #f0ebe4;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            }
          to {
            opacity: 1;
            }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Arts;