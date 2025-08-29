import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, User, Palette, Menu, X, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [animateLogo, setAnimateLogo] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const availableCategories = [
    'painting', 'digital', 'sculpture', 'photography', 
    'drawing', 'mixed media', 'print', 'textile'
  ];

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Collections', href: '/collections' },
    { name: 'Contact', href: '/contact-us' },
    { name: 'About', href: '/about' },
  ];

  const getActiveItem = () => {
    const currentPath = location.pathname;
    
    if (currentPath.startsWith('/login') || currentPath.startsWith('/register')) return '';
    if (currentPath.startsWith('/dashboard')) return '';
    if (currentPath.startsWith('/cart')) return '';
    if (currentPath.startsWith('/wishlist')) return '';
    
    const exactMatch = navItems.find(item => item.href === currentPath);
    if (exactMatch) return exactMatch.name;
    
    const partialMatch = navItems.find(item => currentPath.startsWith(item.href));
    return partialMatch?.name || '';
  };

  const activeItem = getActiveItem();

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.length; 
  };

  const getWishlistItemCount = () => {
    if (!wishlist || !Array.isArray(wishlist)) return 0;
    return wishlist.length;
  };

  const cartItemCount = getCartItemCount();
  const wishlistItemCount = getWishlistItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Logo animation on mount
    setAnimateLogo(true);
    const timer = setTimeout(() => setAnimateLogo(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (itemName) => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/login';
    }
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleWishlistClick = () => {
    window.location.href = '/wishlist';
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const category = searchQuery.trim().toLowerCase();
      
      if (availableCategories.includes(category)) {
        navigate(`/arts?category=${category}`);
      } else {
        navigate('/arts');
      }
      
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-sm shadow-sm'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            <div
              className={`flex items-center cursor-pointer space-x-2 group transition-all duration-500 ${
                animateLogo ? 'transform scale-110' : ''
              }`}
              onClick={() => handleNavClick('Home')}
            >
              <div className="p-2 bg-beige-50 rounded-lg group-hover:bg-beige-100 transition-colors duration-300 group-hover:rotate-12">
                <Palette className="h-5 w-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="text-xl font-light text-gray-800 tracking-wide transition-all duration-300 group-hover:tracking-wider">
               <a href="/"> ArtVista</a>
              </span>
            </div>

           
            <div className="hidden md:flex flex-1 items-center justify-end space-x-8">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleNavClick(item.name)}
                  className="relative text-sm font-light tracking-wide text-gray-600 hover:text-gray-800 transition-all duration-300 group/nav-link"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="relative z-10">{item.name}</span>
                  
                  {activeItem === item.name && (
                    <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gray-800 rounded-full scale-x-100 transition-transform duration-500" />
                  )}
                 
                  {activeItem !== item.name && (
                    <span className="absolute left-0 -bottom-1 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ease-out w-0 scale-x-0 group-hover/nav-link:w-full group-hover/nav-link:scale-x-100" />
                  )}
                </a>
              ))}

            
              <div className="relative flex-grow max-w-sm ml-8 transition-all duration-500">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories (painting, digital, sculpture...)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-700 transition-all duration-300 font-light bg-white/80 focus:bg-white focus:shadow-md"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-300" />
                </form>
              </div>
              
             
              <div className="flex items-center space-x-2">
               
                <button
                  onClick={handleWishlistClick}
                  className="p-2.5 rounded-lg relative text-gray-600 hover:bg-beige-50 transition-all duration-300 group/wishlist hover:scale-105"
                  title="Wishlist"
                >
                  <Heart className="h-4 w-4 transition-transform duration-300 group-hover/wishlist:scale-110" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 text-xs font-normal rounded-full bg-red-500 text-white flex items-center justify-center transition-transform duration-300 group-hover/wishlist:scale-110 group-hover/wishlist:-translate-y-0.5">
                      {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                    </span>
                  )}
                  
                  <span className="absolute left-2 right-2 bottom-0 h-0.5 bg-gray-800 rounded-full scale-x-0 group-hover/wishlist:scale-x-100 transition-transform duration-300" />
                </button>

              
                <a
                  href="/cart"
                  onClick={() => handleNavClick('Cart')}
                  className="p-2.5 rounded-lg relative text-gray-600 hover:bg-beige-50 transition-all duration-300 group/cart hover:scale-105"
                  title="Shopping Cart"
                >
                  <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover/cart:scale-110" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 text-xs font-normal rounded-full bg-gray-800 text-white flex items-center justify-center transition-transform duration-300 group-hover/cart:scale-110 group-hover/cart:-translate-y-0.5">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                
                  <span className="absolute left-2 right-2 bottom-0 h-0.5 bg-gray-800 rounded-full scale-x-0 group-hover/cart:scale-x-100 transition-transform duration-300" />
                </a>

                
                <div className="relative group/profile">
                  <button
                    onClick={handleProfileClick}
                    className="p-2 rounded-lg hover:bg-beige-50 transition-all duration-300 hover:scale-105"
                    title={user ? "Dashboard" : "Sign In"}
                  >
                    {user ? (
                      <div className="h-6 w-6 rounded-full flex items-center justify-center bg-gray-800 text-white font-light text-xs group-hover/profile:bg-gray-700 transition-all duration-300 group-hover/profile:scale-110">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    ) : (
                      <User className="h-4 w-4 text-gray-600 transition-transform duration-300 group-hover/profile:scale-110" />
                    )}
                  </button>
                 
                  <span className="absolute left-2 right-2 bottom-0 h-0.5 bg-gray-800 rounded-full scale-x-0 group-hover/profile:scale-x-100 transition-transform duration-300" />
                </div>
              </div>
            </div>

           
            <div className="md:hidden flex items-center space-x-2">
           
              <button
                onClick={toggleSearch}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-beige-50 transition-all duration-300 hover:scale-105"
                title="Search"
              >
                <Search className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
              </button>

              
              <button
                onClick={handleWishlistClick}
                className="p-1.5 rounded-lg relative text-gray-600 hover:bg-beige-50 transition-all duration-300 hover:scale-105"
                title="Wishlist"
              >
                <Heart className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-xs font-normal rounded-full bg-red-500 text-white flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                  </span>
                )}
              </button>

            
              <a
                href="/cart"
                onClick={() => handleNavClick('Cart')}
                className="p-1.5 rounded-lg relative text-gray-600 hover:bg-beige-50 transition-all duration-300 hover:scale-105"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-xs font-normal rounded-full bg-gray-800 text-white flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </a>

            
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="p-1.5 rounded-lg text-gray-600 hover:bg-beige-50 transition-all duration-300 hover:scale-105"
                  title={user ? "Dashboard" : "Sign In"}
                >
                  {user ? (
                    <div className="h-6 w-6 rounded-full flex items-center justify-center bg-gray-800 text-white font-light text-xs transition-transform duration-300 hover:scale-110">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  ) : (
                    <User className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                  )}
                </button>
              </div>

              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-beige-50 transition-all duration-300 hover:scale-105"
                title="Menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

     
        {isSearchOpen && (
          <div className="md:hidden absolute top-full inset-x-0 bg-white border-t border-gray-100 shadow-md animate-slideDown">
            <div className="px-5 py-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories (painting, digital...)"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-gray-700 font-light bg-white animate-pulse focus:animate-none"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
             
            </div>
          </div>
        )}

        
        {isMenuOpen && (
          <div className="md:hidden absolute top-full inset-x-0 bg-white border-t border-gray-100 shadow-md animate-slideDown">
            <div className="px-5 py-4 space-y-3">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => handleNavClick(item.name)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-light transition-all duration-300 transform hover:translate-x-1 ${
                    activeItem === item.name
                      ? 'bg-beige-50 text-gray-800'
                      : 'text-gray-600 hover:bg-beige-50 hover:text-gray-800'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.name}
                  {activeItem === item.name && (
                    <span className="block w-4 h-0.5 bg-gray-800 rounded-full mt-1 transition-all duration-300" />
                  )}
                </a>
              ))}

              <a
                href="/wishlist"
                onClick={() => handleNavClick('Wishlist')}
                className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 hover:bg-beige-50 hover:text-gray-800 text-sm font-light transition-all duration-300 transform hover:translate-x-1"
              >
                <Heart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> Wishlist
                {wishlistItemCount > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full transition-transform duration-300 group-hover:scale-110">
                    {wishlistItemCount}
                  </span>
                )}
              </a>

              {user ? (
                <div className="pt-4 border-t border-gray-100 animate-fadeIn">
                  <p className="px-3 text-sm font-normal text-gray-800">{user.name}</p>
                  <p className="px-3 text-xs text-gray-500 mb-2">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-2 block w-full text-left px-3 py-2.5 text-gray-600 hover:bg-beige-50 rounded-lg text-sm font-light transition-all duration-300 transform hover:translate-x-1"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-3 py-2.5 rounded-lg text-gray-600 hover:bg-beige-50 hover:text-gray-800 text-sm font-light transition-all duration-300 transform hover:translate-x-1"
                >
                  <User className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" /> Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="pt-16" />
      
      <style>{`
        :root {
          --color-beige-50: #f8f6f2;
          --color-beige-100: #f0ebe4;
          --color-gray-800: #2d2d2d;
          --color-gray-600: #666666;
          --color-gray-400: #999999;
          --color-gray-200: #e0e0e0;
          --color-gray-100: #f5f5f5;
        }
        
        .bg-beige-50 {
          background-color: var(--color-beige-50);
        }
        
        .bg-beige-100 {
          background-color: var(--color-beige-100);
        }
        
        .hover\\:bg-beige-50:hover {
          background-color: var(--color-beige-50);
        }
        
        .hover\\:bg-beige-100:hover {
          background-color: var(--color-beige-100);
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #faf9f7;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;