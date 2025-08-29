import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Palette, Users, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const artworkImages = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  ];

  const features = [
    {
      icon: <Palette className="h-4 w-4" />,
      title: "Curated Collection",
      description: "Handpicked artworks from talented artists"
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "Meet Artists",
      description: "Connect directly with creators"
    },
    {
      icon: <Globe className="h-4 w-4" />,
      title: "Global Reach",
      description: "Discover art from around the world"
    }
  ];

  const handleBecomeArtist = () => {
    if (user) {
      navigate('/manage-art');
    } else {
      navigate('/login');
    }
  };

  const handleExploreGallery = () => {
    navigate('/gallery');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative bg-beige-50 py-16 md:py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOGY2ZjIiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className={`flex items-center space-x-2 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                <span className="text-sm font-light text-gray-600 tracking-wide">
                  DISCOVER EXCEPTIONAL ART
                </span>
              </div>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight tracking-tight transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                Welcome to <span className="font-normal">ArtVista</span>
              </h1>
              
              <p className={`text-lg text-gray-600 leading-relaxed font-light transition-all duration-1000 ease-out delay-150 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                Where creativity meets connection. Explore extraordinary artworks, 
                connect with talented artists, and find pieces that speak to your soul.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-4 transition-all duration-700 ease-out delay-${200 + (index * 100)} ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-beige-100 rounded-full flex items-center justify-center text-gray-700">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-normal text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm font-light">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`grid grid-cols-3 gap-6 pt-4 border-t border-gray-200 transition-all duration-1000 ease-out delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <div className="text-center">
                <div className="text-xl font-normal text-gray-800">500+</div>
                <div className="text-xs text-gray-600 font-light">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-normal text-gray-800">200+</div>
                <div className="text-xs text-gray-600 font-light">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-normal text-gray-800">95%</div>
                <div className="text-xs text-gray-600 font-light">Satisfied</div>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row gap-3 pt-6 transition-all duration-700 ease-out delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <button 
                onClick={handleExploreGallery}
                className="bg-gray-800 hover:bg-gray-700 text-white font-light px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                Explore Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button 
                onClick={handleBecomeArtist}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 font-light px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Become an Artist
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {artworkImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer transform transition-all duration-700 ease-out delay-${index * 100} ${
                    isVisible 
                      ? 'opacity-100 scale-100 hover:scale-[1.02]' 
                      : 'opacity-0 scale-95'
                  } ${index % 3 === 0 ? 'h-44' : 'h-52'}`}
                  onClick={() => navigate('/gallery')}
                >
                  <img
                    src={image}
                    alt={`Artwork ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                    <div className="text-white">
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <span className="text-xs font-light">View details</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`absolute -top-3 -right-3 w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center transition-all duration-1000 ease-out delay-800 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}>
              <div className="w-12 h-12 bg-beige-200 rounded-full flex items-center justify-center">
                <Palette className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-beige-50 {
          background-color: #f8f6f2;
        }
        .bg-beige-100 {
          background-color: #f0ebe4;
        }
        .bg-beige-200 {
          background-color: #e8e0d8;
        }
        .hover\\:bg-beige-100:hover {
          background-color: #f0ebe4;
        }
        
        /* Custom delay classes */
        .delay-100 {
          transition-delay: 100ms;
        }
        .delay-200 {
          transition-delay: 200ms;
        }
        .delay-300 {
          transition-delay: 300ms;
        }
        .delay-400 {
          transition-delay: 400ms;
        }
        .delay-500 {
          transition-delay: 500ms;
        }
        .delay-600 {
          transition-delay: 600ms;
        }
        .delay-700 {
          transition-delay: 700ms;
        }
        .delay-800 {
          transition-delay: 800ms;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;