import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Eye, 
  ArrowRight,
  Search,
  ChevronDown,
  Sparkles,
  Palette,
  Brush,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const collectionsData = [
  {
    id: 1,
    title: "Zen Ink Masters",
    description: "Traditional Japanese ink paintings that capture the essence of Zen philosophy",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
    items: 24,
    category: "Traditional",
    featured: true,
    artist: "Oliver Smith",
    likes: 142
  },
  {
    id: 2,
    title: "Digital Ukiyo-e",
    description: "Modern digital art inspired by classical Japanese woodblock prints",
    image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400&h=300&fit=crop",
    items: 18,
    category: "Digital",
    featured: true,
    artist: "Aarav Mehta",
    likes: 98
  },
  {
    id: 3,
    title: "Wabi-Sabi Still Life",
    description: "Embracing imperfection and transience in contemporary still life photography",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=300&fit=crop",
    items: 32,
    category: "Photography",
    featured: false,
    artist: "Priya Sharma",
    likes: 76
  },
  {
    id: 4,
    title: "Minimalist Landscapes",
    description: "Simplified landscapes that capture the essence of nature's beauty",
    image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop",
    items: 15,
    category: "Painting",
    featured: true,
    artist: "James Anderson",
    likes: 203
  },
  {
    id: 5,
    title: "Contemporary Calligraphy",
    description: "Modern interpretations of ancient Japanese calligraphy techniques",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    items: 27,
    category: "Calligraphy",
    featured: false,
    artist: "Ananya Patel",
    likes: 89
  },
  {
    id: 6,
    title: "Fusion Sculptures",
    description: "Sculptures blending traditional Japanese materials with modern forms",
    image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=300&fit=crop",
    items: 12,
    category: "Sculpture",
    featured: true,
    artist: "William Johnson",
    likes: 156
  },
  {
    id: 7,
    title: "Neo-Nihonga",
    description: "Contemporary paintings using traditional Japanese mineral pigments",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop",
    items: 21,
    category: "Painting",
    featured: false,
    artist: "Riya Kapoor",
    likes: 112
  },
  {
    id: 8,
    title: "Urban Zen Gardens",
    description: "Modern interpretations of traditional Japanese garden design",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop",
    items: 19,
    category: "Mixed Media",
    featured: true,
    artist: "George Wilson",
    likes: 167
  }
];


const categories = [
  "All",
  "Traditional",
  "Digital",
  "Painting",
  "Photography",
  "Sculpture",
  "Calligraphy",
  "Mixed Media"
];

const CollectionsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedCollections, setLikedCollections] = useState(new Set());

  const handleLike = (collectionId) => {
    setLikedCollections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(collectionId)) {
        newSet.delete(collectionId);
      } else {
        newSet.add(collectionId);
      }
      return newSet;
    });
  };

  const filteredCollections = collectionsData.filter(collection => {
    const matchesCategory = selectedCategory === 'All' || collection.category === selectedCategory;
    const matchesSearch = collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return b.featured - a.featured || b.likes - a.likes;
      case 'popular':
        return b.likes - a.likes;
      case 'newest':
        return b.id - a.id;
      case 'a-z':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const featuredCollections = collectionsData.filter(collection => collection.featured);

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-sm border-b border-[#e8e1d9] py-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-5xl font-light text-[#3a302c] mb-4"
          >
            Curated Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl text-[#6e635c] max-w-2xl mx-auto"
          >
            Discover carefully curated art collections that tell unique stories and showcase exceptional talent
          </motion.p>
        </div>
      </motion.section>

      {featuredCollections.length > 0 && (
        <section className="py-12 bg-[#f3ebe5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-[#3a302c]">Featured Collections</h2>
              <div className="flex items-center space-x-2 text-[#8a4b3c]">
                <Sparkles className="h-5 w-5" />
                <span>Curated Excellence</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCollections.slice(0, 3).map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8e1d9] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#8a4b3c] text-white text-sm rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-[#3a302c] mb-2 group-hover:text-[#8a4b3c] transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-[#6e635c] text-sm mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8a4b3c]">
                        {collection.items} artworks
                      </span>
                      <span className="text-sm text-[#6e635c]">
                        by {collection.artist}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8e1d9] rounded-lg text-[#6e635c] hover:bg-[#f8f5f0] transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6e635c]" />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-[#e8e1d9] rounded-lg text-[#6e635c] focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-[#e8e1d9] rounded-lg text-[#6e635c] focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="a-z">A-Z</option>
              </select>
            </div>

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

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#e8e1d9] mb-8 overflow-hidden"
              >
                <h3 className="font-medium text-[#3a302c] mb-4">Categories</h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#8a4b3c] text-white'
                          : 'bg-[#f8f5f0] text-[#6e635c] hover:bg-[#f3ebe5]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {sortedCollections.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#e8e1d9]">
              <Palette className="h-16 w-16 text-[#d3c8be] mx-auto mb-4" />
              <h2 className="text-2xl font-light text-[#3a302c] mb-4">No collections found</h2>
              <p className="text-[#6e635c] mb-6">Try adjusting your filters to see more results.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sortedCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8e1d9] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => handleLike(collection.id)}
                        className="p-2 bg-white/90 rounded-full transition-all hover:scale-110"
                      >
                        <Heart
                          className="h-4 w-4"
                          fill={likedCollections.has(collection.id) ? "#d15c4f" : "none"}
                          stroke={likedCollections.has(collection.id) ? "#d15c4f" : "currentColor"}
                        />
                      </button>
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 bg-white/90 text-[#6e635c] text-xs rounded-full">
                        {collection.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-medium text-[#3a302c] mb-2 group-hover:text-[#8a4b3c] transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-[#6e635c] text-sm mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#8a4b3c] font-medium">
                        {collection.items} artworks
                      </span>
                      <div className="flex items-center gap-2 text-sm text-[#6e635c]">
                        <Heart className="h-3 w-3" />
                        <span>{collection.likes + (likedCollections.has(collection.id) ? 1 : 0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6e635c]">
                        by {collection.artist}
                      </span>
                      <Link
                        to={`/collection/${collection.id}`}
                        className="inline-flex items-center text-[#8a4b3c] hover:text-[#723c2f] text-sm font-medium"
                      >
                        View Collection
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="space-y-4"
            >
              {sortedCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-[#e8e1d9] hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 w-full md:w-48 h-48 rounded-xl overflow-hidden">
                      <img
                        src={collection.image}
                        alt={collection.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-medium text-[#3a302c] mb-2">
                            {collection.title}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-[#f8f5f0] text-[#6e635c] text-sm rounded-full mb-3">
                            {collection.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleLike(collection.id)}
                          className="p-2 hover:bg-[#f8f5f0] rounded-full transition-colors"
                        >
                          <Heart
                            className="h-5 w-5"
                            fill={likedCollections.has(collection.id) ? "#d15c4f" : "none"}
                            stroke={likedCollections.has(collection.id) ? "#d15c4f" : "currentColor"}
                          />
                        </button>
                      </div>

                      <p className="text-[#6e635c] mb-4 leading-relaxed">
                        {collection.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-[#6e635c]">
                          <span>{collection.items} artworks</span>
                          <span>by {collection.artist}</span>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{collection.likes + (likedCollections.has(collection.id) ? 1 : 0)}</span>
                          </div>
                        </div>
                        
                        <Link
                          to={`/collection/${collection.id}`}
                          className="inline-flex items-center text-[#8a4b3c] hover:text-[#723c2f] font-medium"
                        >
                          Explore
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {sortedCollections.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-white border border-[#e8e1d9] text-[#6e635c] px-8 py-3 rounded-lg hover:bg-[#f8f5f0] transition-colors">
                Load More Collections
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CollectionsPage;