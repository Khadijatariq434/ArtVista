import React, { useEffect, useRef, useState } from 'react';
import { Palette, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className={`flex items-center mb-4 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <div className="p-2 bg-beige-50 rounded-lg">
                <Palette className="h-5 w-5 text-gray-700" />
              </div>
              <span className="ml-3 text-xl font-light text-gray-800 tracking-wide">
                ArtVista
              </span>
            </div>
            <p className={`text-gray-600 text-sm mb-5 leading-relaxed font-light transition-all duration-700 ease-out delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Discover and collect exceptional artwork from talented artists around the world.
            </p>
            <div className={`flex space-x-2 transition-all duration-700 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <a href="#" className="p-2 rounded-lg bg-beige-50 hover:bg-beige-100 text-gray-600 transition-colors transform hover:scale-105">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-beige-50 hover:bg-beige-100 text-gray-600 transition-colors transform hover:scale-105">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-beige-50 hover:bg-beige-100 text-gray-600 transition-colors transform hover:scale-105">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-light text-gray-800 uppercase tracking-wider mb-4 transition-all duration-700 ease-out delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Explore
            </h3>
           <ul className="space-y-3">
  {['Home', 'Gallery', 'Collections', 'Contact', 'About'].map((item, index) => {
    const linkPath = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <li
        key={item}
        className={`transition-all duration-700 ease-out delay-${150 + index * 100} ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        <a
          href={linkPath}
          className="text-gray-600 hover:text-gray-800 text-sm transition-colors font-light group/link"
        >
          {item}
          <span className="block w-0 h-0.5 bg-gray-800 rounded-full transition-all duration-300 group-hover/link:w-full mt-0.5" />
        </a>
      </li>
    );
  })}
</ul>

          </div>

          <div>
            <h3 className={`text-sm font-light text-gray-800 uppercase tracking-wider mb-4 transition-all duration-700 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Support
            </h3>
            <ul className="space-y-3">
              {['Help Center', 'FAQs', 'Contact Us', 'Shipping', 'Returns'].map((item, index) => (
                <li key={item} className={`transition-all duration-700 ease-out delay-${250 + (index * 100)} ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  <a href="/" className="text-gray-600 hover:text-gray-800 text-sm transition-colors font-light group/link">
                    {item}
                    <span className="block w-0 h-0.5 bg-gray-800 rounded-full transition-all duration-300 group-hover/link:w-full mt-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-light text-gray-800 uppercase tracking-wider mb-4 transition-all duration-700 ease-out delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Contact
            </h3>
            <div className="space-y-4 text-sm">
              <div className={`flex items-center transition-all duration-700 ease-out delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <Mail className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-gray-600 font-light">hello@artvista.com</span>
              </div>
              <div className={`flex items-center transition-all duration-700 ease-out delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <Phone className="h-4 w-4 text-gray-500 mr-3" />
                <span className="text-gray-600 font-light">+91-9876543210</span>
              </div>
              <div className={`flex items-start transition-all duration-700 ease-out delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <MapPin className="h-4 w-4 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 font-light">Uttar Pradesh,<br />India</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t border-gray-100 transition-all duration-1000 ease-out delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-sm font-light text-gray-800 uppercase tracking-wider mb-2">Stay Updated</h3>
              <p className="text-gray-600 text-sm font-light">Subscribe for new collections and offers</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2 w-full md:w-96">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 bg-beige-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 font-light flex-grow transition-all duration-300 focus:scale-[1.02]"
              />
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-light transition-all duration-300 flex items-center justify-center whitespace-nowrap transform hover:scale-105">
                Subscribe
                <ArrowRight className="ml-2 h-3 w-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className={`bg-beige-50 border-t border-gray-100 transition-all duration-1000 ease-out delay-800 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-xs font-light mb-2 md:mb-0">
              © 2025 ArtVista. All rights reserved.
            </p>
            <div className="flex items-center space-x-5 text-xs">
              <a href="/privacy" className="text-gray-600 hover:text-gray-800 transition-colors font-light group/policy">
                Privacy Policy
                <span className="block w-0 h-0.5 bg-gray-800 rounded-full transition-all duration-300 group-hover/policy:w-full mt-0.5" />
              </a>
              <a href="/terms" className="text-gray-600 hover:text-gray-800 transition-colors font-light group/policy">
                Terms of Service
                <span className="block w-0 h-0.5 bg-gray-800 rounded-full transition-all duration-300 group-hover/policy:w-full mt-0.5" />
              </a>
              <a href="/cookies" className="text-gray-600 hover:text-gray-800 transition-colors font-light group/policy">
                Cookie Policy
                <span className="block w-0 h-0.5 bg-gray-800 rounded-full transition-all duration-300 group-hover/policy:w-full mt-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-beige-50 border-t border-gray-100 py-3 transition-all duration-1000 ease-out delay-900 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <p className="text-gray-500 text-xs flex items-center font-light">
              Made with <Heart className="h-3 w-3 text-gray-600 mx-1 animate-pulse" /> by ArtVista Team
            </p>
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
        .hover\\:bg-beige-100:hover {
          background-color: #f0ebe4;
        }
        
        /* Custom delay classes */
        .delay-100 {
          transition-delay: 100ms;
        }
        .delay-150 {
          transition-delay: 150ms;
        }
        .delay-200 {
          transition-delay: 200ms;
        }
        .delay-250 {
          transition-delay: 250ms;
        }
        .delay-300 {
          transition-delay: 300ms;
        }
        .delay-350 {
          transition-delay: 350ms;
        }
        .delay-400 {
          transition-delay: 400ms;
        }
        .delay-450 {
          transition-delay: 450ms;
        }
        .delay-500 {
          transition-delay: 500ms;
        }
        .delay-550 {
          transition-delay: 550ms;
        }
        .delay-600 {
          transition-delay: 600ms;
        }
        .delay-650 {
          transition-delay: 650ms;
        }
        .delay-700 {
          transition-delay: 700ms;
        }
        .delay-750 {
          transition-delay: 750ms;
        }
        .delay-800 {
          transition-delay: 800ms;
        }
        .delay-850 {
          transition-delay: 850ms;
        }
        .delay-900 {
          transition-delay: 900ms;
        }
      `}</style>
    </footer>
  );
};

export default Footer;