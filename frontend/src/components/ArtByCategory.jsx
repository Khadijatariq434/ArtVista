import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useArt } from '../context/ArtContext';
import { Heart, Eye, Palette, ArrowLeft } from 'lucide-react';

const ArtsByCategory = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { arts, loading, getArts, updateCategoryFilter } = useArt();
  const [currentCategory, setCurrentCategory] = useState(category || 'all');
  const [hoveredArt, setHoveredArt] = useState(null);

useEffect(() => {
  if (category && category !== 'all') {
    setCurrentCategory(category);
    updateCategoryFilter(category); // fetch only category-specific arts
  } else if (category === 'all') {
    setCurrentCategory('all');
    getArts(); // fetch all arts explicitly
  }
}, [category]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#8a4b3c] mb-4"></div>
        <p className="text-[#6e635c]">Loading artworks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4] py-8">
      <div className="container mx-auto px-4">
       
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="flex items-center text-[#8a4b3c] hover:text-[#723c2f] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Palette className="h-5 w-5 text-[#8a4b3c] mr-2" />
            <span className="text-sm text-[#6e635c]">
              {arts.length} artwork{arts.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

      
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-[#3a302c] mb-4">
            {currentCategory === 'all' 
              ? 'All Artworks' 
              : `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Collection`
            }
          </h1>
          <p className="text-[#6e635c] max-w-2xl mx-auto">
            Discover beautiful artworks {currentCategory !== 'all' ? `in the ${currentCategory} category` : 'across all categories'}
          </p>
        </div>

        {/* Art Grid */}
        {arts.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-2xl backdrop-blur-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#f1ebe4] rounded-full flex items-center justify-center">
              <Palette className="h-12 w-12 text-[#8a4b3c] opacity-60" />
            </div>
            <h3 className="text-2xl font-medium text-[#3a302c] mb-2">No artworks found</h3>
            <p className="text-[#6e635c] mb-6 max-w-md mx-auto">
              {currentCategory !== 'all' 
                ? `We couldn't find any artworks in the ${currentCategory} category.` 
                : 'No artworks available at the moment.'
              }
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-[#8a4b3c] hover:bg-[#723c2f] text-white font-medium px-6 py-3 rounded-xl transition-all duration-300"
            >
              Explore Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {arts.map((art) => (
              <div 
                key={art._id} 
                className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-[#e8e1d9]"
                onMouseEnter={() => setHoveredArt(art._id)}
                onMouseLeave={() => setHoveredArt(null)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={art.images[0]} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4`}>
                    <div className="flex space-x-3">
                      <button className="bg-white/90 text-[#3a302c] p-2 rounded-full backdrop-blur-sm hover:bg-white transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="bg-white/90 text-[#3a302c] p-2 rounded-full backdrop-blur-sm hover:bg-white transition-colors">
                       <a href={`/arts/${art._id}`}> <Eye className="h-4 w-4" /></a>
                      </button>
                    </div>
                  </div>

                  
                  {art.categories && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-[#3a302c] text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {art.categories}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-[#3a302c] text-lg leading-tight line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-[#8a4b3c] font-semibold text-lg whitespace-nowrap ml-3">
                      ₹{art.price}
                    </p>
                  </div>
                  
                  <p className="text-sm text-[#6e635c] mb-4 leading-relaxed line-clamp-2">
                    {art.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#e8e1d9]">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#f1ebe4] rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-[#8a4b3c]">
                          {art.artist?.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-sm text-[#6e635c]">
                        by {art.createdBy?.name || 'Unknown Artist'}
                      </span>
                    </div>
                    
                    <Link
                      to={`/arts/${art._id}`}
                      className="text-[#8a4b3c] hover:text-[#723c2f] text-sm font-medium transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {arts.length > 0 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center bg-white/80 hover:bg-white text-[#8a4b3c] font-medium px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm border border-[#e8e1d9]">
              Load More Artworks
              <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      
      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ArtsByCategory;  