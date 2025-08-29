import { useState, useEffect, useRef } from "react";
import { useArt } from "../context/ArtContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddToCartButton from "../components/AddToCartButton";
import { Link } from "react-router-dom";
import { 
  Star, 
  Heart, 
  Share2, 
  Eye, 
  Clock, 
  MapPin, 
  Calendar,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Filter,
  Grid,
  List
} from "lucide-react";

const Gallery = () => {
  const { arts, loading, getArts } = useArt();
  const { 
    wishlist, 
    loading: wishlistLoading, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist 
  } = useWishlist();
  const { addToCart, isInCart, getItemQuantity, cart } = useCart(); 
  const { user } = useAuth();
  const [selectedArt, setSelectedArt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistProcessing, setWishlistProcessing] = useState({});
  const [localWishlist, setLocalWishlist] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const artRefs = useRef([]);

  const categories = ['all', 'painting', 'digital', 'sculpture', 'photography', 'mixed media'];

  useEffect(() => {
    getArts();
  }, []);

  useEffect(() => {
    if (wishlist && Array.isArray(wishlist)) {
      const wishlistIds = new Set(wishlist.map(item => item._id || item));
      setLocalWishlist(wishlistIds);
    }
  }, [wishlist]);

  const checkInWishlist = (artId) => {
    return localWishlist.has(artId);
  };

  const handleWishlistToggle = async (artId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
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
      } else {
        setLocalWishlist(prev => {
          const newSet = new Set(prev);
          newSet.add(artId);
          return newSet;
        });
        await addToWishlist(artId);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
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

  const openModal = (art) => {
    setSelectedArt(art);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArt(null);
  };

  const generateRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">({rating})</span>
      </div>
    );
  };

  const filteredAndSortedArts = arts
    .filter(art => {
      if (filterCategory === 'all') return true;
      return art.category === filterCategory;
    })
    .filter(art => {
      const price = art.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#e8e1d9] border-t-[#8a4b3c] mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">Loading artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4]">
      <div className="bg-white/80 backdrop-blur-md border-b border-[#e8e1d9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-[#3a302c] mb-4">Art Gallery</h1>
            <p className="text-[#6e635c] max-w-2xl mx-auto">
              Discover unique artworks from talented artists around the world. 
              Each piece tells a story waiting to be part of your collection.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8e1d9] rounded-lg text-[#6e635c] hover:bg-[#f8f5f0] transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-[#e8e1d9] rounded-lg text-[#6e635c] focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex items-center gap-1 bg-white border border-[#e8e1d9] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-[#f8f5f0] text-[#8a4b3c]' : 'text-[#6e635c] hover:bg-[#f8f5f0]'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-[#f8f5f0] text-[#8a4b3c]' : 'text-[#6e635c] hover:bg-[#f8f5f0]'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="text-sm text-[#6e635c]">
              Showing {filteredAndSortedArts.length} of {arts.length} artworks
            </div>
          </div>

          {showFilters && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#e8e1d9] mb-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-[#3a302c] mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={filterCategory === category}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="text-[#8a4b3c] focus:ring-[#8a4b3c]"
                        />
                        <span className="text-[#6e635c] capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#3a302c] mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-[#e8e1d9] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8a4b3c]"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-[#6e635c]">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#3a302c] mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setFilterCategory('all');
                        setPriceRange([0, 5000]);
                      }}
                      className="w-full text-left px-3 py-2 text-[#6e635c] hover:bg-[#f8f5f0] rounded-lg transition-colors"
                    >
                      Reset Filters
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full text-left px-3 py-2 text-[#6e635c] hover:bg-[#f8f5f0] rounded-lg transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedArts.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e8e1d9]">
            <Eye className="h-16 w-16 text-[#d3c8be] mx-auto mb-4" />
            <h2 className="text-2xl font-light text-[#3a302c] mb-4">No artworks found</h2>
            <p className="text-[#6e635c] mb-6">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => {
                setFilterCategory('all');
                setPriceRange([0, 5000]);
              }}
              className="bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedArts.map((art, index) => (
              <ArtCard 
                key={art._id} 
                art={art} 
                index={index}
                onWishlistToggle={handleWishlistToggle}
                onOpenModal={openModal}
                checkInWishlist={checkInWishlist}
                wishlistProcessing={wishlistProcessing}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedArts.map((art, index) => (
              <ArtListItem 
                key={art._id} 
                art={art} 
                index={index}
                onWishlistToggle={handleWishlistToggle}
                onOpenModal={openModal}
                checkInWishlist={checkInWishlist}
                wishlistProcessing={wishlistProcessing}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedArt && (
        <ArtModal 
          art={selectedArt} 
          onClose={closeModal}
          onWishlistToggle={handleWishlistToggle}
          checkInWishlist={checkInWishlist}
          wishlistProcessing={wishlistProcessing}
        />
      )}
    </div>
  );
};

const ArtCard = ({ art, index, onWishlistToggle, onOpenModal, checkInWishlist, wishlistProcessing }) => {
  const inWishlist = checkInWishlist(art._id);
  const processing = wishlistProcessing[art._id];

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#e8e1d9] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 transform animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div 
        className="relative group cursor-pointer"
        onClick={() => onOpenModal(art)}
      >
        <div className="relative h-64 overflow-hidden">
          <img 
            src={art.images[0]} 
            alt={art.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <button 
            onClick={(e) => onWishlistToggle(art._id, e)}
            disabled={processing}
            className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm bg-white/90 transition-all duration-300 hover:scale-110 group-hover:opacity-100 opacity-0"
          >
            {processing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#8a4b3c] border-t-transparent" />
            ) : (
              <Heart 
                className="h-4 w-4" 
                fill={inWishlist ? "#d15c4f" : "none"} 
                stroke={inWishlist ? "#d15c4f" : "currentColor"}
              />
            )}
          </button>

          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-full bg-white/90 backdrop-blur-sm text-[#3a302c] py-2 rounded-lg text-sm font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Quick View
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-[#3a302c] line-clamp-1 flex-1">{art.title}</h3>
          {art.price && (
            <span className="text-[#8a4b3c] font-semibold ml-2">₹{art.price}</span>
          )}
        </div>
        
        <p className="text-sm text-[#6e635c] mb-3 line-clamp-2">{art.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#6e635c]">By {art.createdBy?.name || "Unknown Artist"}</span>
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-[#6e635c] ml-1">4.8</span>
          </div>
        </div>

        {art.category && (
          <div className="mt-3">
            <span className="inline-block px-2 py-1 bg-[#f8f5f0] text-[#6e635c] text-xs rounded-full">
              {art.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const ArtListItem = ({ art, index, onWishlistToggle, onOpenModal, checkInWishlist, wishlistProcessing }) => {
  const inWishlist = checkInWishlist(art._id);
  const processing = wishlistProcessing[art._id];

  return (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#e8e1d9] p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 transform animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div 
          className="relative flex-shrink-0 w-full md:w-48 h-48 rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => onOpenModal(art)}
        >
          <img 
            src={art.images[0]} 
            alt={art.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-medium text-[#3a302c]">{art.title}</h3>
            {art.price && (
              <span className="text-[#8a4b3c] font-semibold text-lg">₹{art.price}</span>
            )}
          </div>

          <p className="text-[#6e635c] mb-4 leading-relaxed">{art.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-[#6e635c]">
              <span>By {art.createdBy?.name || "Unknown Artist"}</span>
              {art.category && (
                <span className="px-2 py-1 bg-[#f8f5f0] rounded-full">{art.category}</span>
              )}
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-[#6e635c] ml-1">4.8 (24 reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onOpenModal(art)}
              className="flex items-center gap-2 px-4 py-2 bg-[#f8f5f0] text-[#3a302c] rounded-lg hover:bg-[#f3ebe5] transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            
            <button 
              onClick={(e) => onWishlistToggle(art._id, e)}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 border border-[#e8e1d9] text-[#6e635c] rounded-lg hover:bg-[#f8f5f0] transition-colors"
            >
              {processing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#8a4b3c] border-t-transparent" />
              ) : (
                <Heart 
                  className="h-4 w-4" 
                  fill={inWishlist ? "#d15c4f" : "none"} 
                  stroke={inWishlist ? "#d15c4f" : "currentColor"}
                />
              )}
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>

            <AddToCartButton artId={art._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtModal = ({ art, onClose, onWishlistToggle, checkInWishlist, wishlistProcessing }) => {
  const inWishlist = checkInWishlist(art._id);
  const processing = wishlistProcessing[art._id];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <svg className="h-5 w-5 text-[#6e635c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <img 
                  src={art.images[0]} 
                  alt={art.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {art.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {art.images.slice(1, 4).map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img src={image} alt={`${art.title} ${index + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-light text-[#3a302c] mb-2">{art.title}</h2>
                <p className="text-[#8a4b3c] text-lg font-medium">By {art.createdBy?.name || "Unknown Artist"}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#6e635c]">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>4.8 (24 reviews)</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>156 views</span>
                </div>
                {art.category && (
                  <span className="px-2 py-1 bg-[#f8f5f0] rounded-full">{art.category}</span>
                )}
              </div>

              {art.price && (
                <div className="text-2xl font-bold text-[#8a4b3c]">₹{art.price}</div>
              )}

              {art.description && (
                <div className="prose prose-sm text-[#6e635c]">
                  <p>{art.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#6e635c]">
                  <Clock className="h-4 w-4" />
                  <span>Created: {new Date(art.createdAt).toLocaleDateString()}</span>
                </div>
                
                {art.dimensions && (
                  <div className="flex items-center gap-2 text-sm text-[#6e635c]">
                    <span>Dimensions: {art.dimensions}</span>
                  </div>
                )}

                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {art.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-[#f8f5f0] text-[#6e635c] text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <AddToCartButton artId={art._id} />
                
                <button 
                  onClick={() => onWishlistToggle(art._id)}
                  disabled={processing}
                  className="flex-1 border border-[#e8e1d9] text-[#6e635c] py-3 rounded-xl hover:bg-[#f8f5f0] transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#8a4b3c] border-t-transparent" />
                  ) : (
                    <Heart 
                      className="h-5 w-5" 
                      fill={inWishlist ? "#d15c4f" : "none"} 
                      stroke={inWishlist ? "#d15c4f" : "currentColor"}
                    />
                  )}
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="pt-6 border-t border-[#e8e1d9]">
                <div className="flex items-center gap-2 text-sm text-[#6e635c]">
                  <MapPin className="h-4 w-4" />
                  <span>Free shipping worldwide</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6e635c] mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
  .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
  
  .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
`;

export default Gallery;