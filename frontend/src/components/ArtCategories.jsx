import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Palette, ArrowRight, Star } from 'lucide-react';
import { useArt } from '../context/ArtContext';

const artCategories = [
  {
    id: 1,
    name: "Painting",
    description: "Traditional and contemporary paintings in various mediums and styles",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    count: 68,
    rating: 4.8
  },
  {
    id: 2,
    name: "Digital",
    description: "Cutting-edge digital art, NFTs, and digital media creations",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    count: 42,
    rating: 4.7
  },
  {
    id: 3,
    name: "Calligraphy",
    description: "Hand-lettering, decorative scripts, modern typography art",
    image: "https://images.unsplash.com/photo-1619010431046-dde29509016e?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 35,
    rating: 4.9
  },
  {
    id: 4,
    name: "Photography",
    description: "Artistic photography capturing moments and perspectives",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    count: 57,
    rating: 4.6
  },
  {
    id: 5,
    name: "Drawing",
    description: "Pencil, charcoal, ink and other drawing mediums",
    image: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=384&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 39,
    rating: 4.5
  },
  {
    id: 6,
    name: "Mixed Media",
    description: "Artworks combining multiple materials and techniques",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    count: 31,
    rating: 4.7
  },
  {
    id: 7,
    name: "Print",
    description: "Limited edition prints and reproduction artworks",
    image: "https://images.unsplash.com/photo-1614556859483-88c323e4aa01?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 46,
    rating: 4.4
  },
  {
    id: 8,
    name: "Textile",
    description: "Fiber art, tapestries, and textile-based creations",
    image: "https://plus.unsplash.com/premium_photo-1725366196127-c50b88676459?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 28,
    rating: 4.8
  }
];
const ArtCategories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { updateCategoryFilter } = useArt();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('art-categories');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const handleCategoryClick = async (categoryName) => {
    await updateCategoryFilter(categoryName.toLowerCase());
    navigate(`/arts?category=${categoryName.toLowerCase()}`);
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
        <span className="ml-1 text-xs text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <section id="art-categories" className="py-16 bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl mb-6 shadow-sm">
            <Palette className="h-8 w-8 text-[#8a4b3c]" />
          </div>
          <h2 className="text-4xl font-light text-[#3a302c] mb-4 tracking-wide">Explore Art Categories</h2>
          <p className="text-[#6e635c] max-w-2xl mx-auto font-light text-lg">
            Discover diverse artistic styles and find the perfect piece that speaks to your soul
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artCategories.map((category, index) => (
            <div
              key={category.id}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-[#e8e1d9] opacity-0 ${
                isVisible ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                onClick={() => handleCategoryClick(category.name)}
                className=" group h-full flex flex-col cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-[#3a302c] text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {category.count} pieces
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-[#3a302c] text-lg">{category.name}</h3>
                    {generateRatingStars(category.rating)}
                  </div>
                  
                  <p className="text-[#6e635c] text-sm font-light mb-4 leading-relaxed flex-1">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-[#8a4b3c] group-hover:text-[#723c2f] transition-colors pt-4 border-t border-[#e8e1d9]">
                    <span className="text-sm font-medium">Explore {category.name}</span>
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-700 ease-out delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Link
            to="/arts"
            className="inline-flex items-center bg-[#8a4b3c] hover:bg-[#723c2f] text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            View All Artworks
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ArtCategories;