import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { Heart, Trash2, ArrowLeft, AlertCircle, ImageIcon } from "lucide-react";

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist, fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f0e8dc] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#e8ddd4] border-t-[#8a4b3c] shadow-lg"></div>
          <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f0e8dc] flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#e8e1d9] p-8 max-w-md w-full text-center shadow-2xl transform animate-slideUp">
          <div className="animate-bounce">
            <AlertCircle className="h-16 w-16 text-[#d15c4f] mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-[#3a302c] mb-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Something went wrong
          </h2>
          <p className="text-[#6e635c] mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {error}
          </p>
          <button
            onClick={fetchWishlist}
            className="bg-[#8a4b3c] hover:bg-[#723c2f] text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fadeInUp"
            style={{ animationDelay: '0.3s' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] via-[#f0e8dc] to-[#e8ddd4] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8 animate-slideInFromTop">
          <Link
            to="/arts"
            className="group flex items-center text-[#6e635c] hover:text-[#8a4b3c] transition-all duration-300 mr-4 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 mr-1 transition-transform duration-300 group-hover:-translate-x-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-[#3a302c] tracking-wide flex items-center">
            <Heart className="h-8 w-8 text-[#d15c4f] mr-3 animate-heartBeat" />
            Your Wishlist
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-[#e8e1d9] shadow-lg animate-slideUp">
            <div className="animate-float">
              <Heart className="h-16 w-16 text-[#d3c8be] mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold text-[#3a302c] mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Your wishlist is empty
            </h2>
            <p className="text-[#6e635c] mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Start adding artworks you love to your wishlist
            </p>
            <Link
              to="/arts"
              className="inline-flex items-center bg-[#8a4b3c] hover:bg-[#723c2f] text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: '0.3s' }}
            >
              Browse Artworks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((art, index) => (
              <div 
                key={art._id} 
                className="group bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-[#e8e1d9] transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2 animate-slideInFromBottom"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative w-full h-48 overflow-hidden">
                  {art.images && art.images.length > 0 ? (
                    <>
                      <img
                        src={art.images[0]}
                        alt={art.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f3ebe5] to-[#e8ddd4] flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-[#d3c8be] animate-pulse" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeFromWishlist(art._id)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-[#d15c4f] hover:text-[#b44c40] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-[#3a302c] truncate flex-1">
                      <Link 
                        to={`/art/${art._id}`} 
                        className="hover:text-[#8a4b3c] transition-all duration-300 hover:underline underline-offset-2"
                      >
                        {art.title}
                      </Link>
                    </h3>
                  </div>
                  
                  <p className="text-[#6e635c] text-sm mb-3 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4 mb-4">
                    <p className="text-xl font-bold text-[#8a4b3c] animate-shimmer">
                      ₹{art.price?.toFixed(2)}
                    </p>
                    <span className="text-xs text-[#6e635c] bg-[#f3ebe5] px-2 py-1 rounded-full">
                      By {art.createdBy?.name || "Unknown Artist"}
                    </span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#e8e1d9]">
                    <Link
                      to={`/arts/${art._id}`}
                      className="block w-full text-center bg-gradient-to-r from-[#f3ebe5] to-[#e8ddd4] hover:from-[#e8ddd4] hover:to-[#d3c8be] text-[#3a302c] font-medium py-3 rounded-lg transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        @keyframes heartBeat {
          0%, 50%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          75% {
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            text-shadow: 0 0 5px rgba(138, 75, 60, 0.3);
          }
          50% {
            text-shadow: 0 0 10px rgba(138, 75, 60, 0.6);
          }
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.8s ease-out forwards;
        }

        .animate-slideInFromBottom {
          animation: slideInFromBottom 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-heartBeat {
          animation: heartBeat 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #8a4b3c;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #723c2f;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;