import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useArt } from "../context/ArtContext";
import { useWishlist } from "../context/WishlistContext";
import AddToCartButton from "../components/AddToCartButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Share2,
  User,
  Calendar,
  MapPin,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  Palette,
  Ruler,
  Shield,
  Truck,
  Clock,
  Tag,
  Award,
  Info
} from "lucide-react";

const ArtDetails = () => {
  const { id } = useParams();
  const { getArtById, arts, loading: artListLoading } = useArt();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [art, setArt] = useState(null);
  const [sameArtistArts, setSameArtistArts] = useState([]);
  const [otherArts, setOtherArts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadingArt, setLoadingArt] = useState(true);
  const [wishlistProcessing, setWishlistProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchArtData = async () => {
      setLoadingArt(true);
      try {
        const artData = await getArtById(id);
        setArt(artData);

        if (artData && artData.createdBy) {
          const sameArtist = arts.filter(
            (a) =>
              a.createdBy?._id === artData.createdBy._id && a._id !== artData._id
          );
          setSameArtistArts(sameArtist.slice(0, 4));
        }

        const other = arts.filter(
          (a) =>
            a._id !== artData._id && a.createdBy?._id !== artData.createdBy?._id
        );
        setOtherArts(other.slice(0, 4));
      } catch (error) {
        console.error("Error fetching art:", error);
      } finally {
        setLoadingArt(false);
      }
    };

    if (arts.length > 0) {
      fetchArtData();
    }
  }, [id, arts, getArtById]);

  const handleWishlistToggle = async () => {
    if (!art || wishlistProcessing) return;

    setWishlistProcessing(true);
    try {
      if (isInWishlist(art._id)) {
        await removeFromWishlist(art._id);
      } else {
        await addToWishlist(art._id);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setWishlistProcessing(false);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % art.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + art.images.length) % art.images.length);
  };

  const inWishlist = art && isInWishlist(art._id);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loadingArt) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-b-transparent border-[#8a4b3c]"
        />
      </div>
    );
  }

  if (!art) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg border border-[#e8e1d9]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl text-[#3a302c] font-semibold mb-4"
          >
            Artwork not found 😔
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#6e635c] mb-6"
          >
            The piece you're looking for may have been removed or the link is incorrect.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link
              to="/gallery"
              className="inline-flex items-center text-[#8a4b3c] hover:text-[#723c2f] transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Gallery
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="sticky top-0 z-10 border-b border-[#e8e1d9] bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/gallery"
            className="inline-flex items-center text-[#6e635c] hover:text-[#3a302c] transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Gallery
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="relative bg-white rounded-3xl p-6 border border-[#e8e1d9] shadow-lg">
              <div className="relative h-[500px] overflow-hidden rounded-xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={art.images[selectedImage]}
                    alt={art.title}
                    className="w-full h-full object-contain absolute top-0 left-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                {art.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronLeft className="h-6 w-6 text-[#3a302c]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronRight className="h-6 w-6 text-[#3a302c]" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {art.images.length}
                </div>
              </div>
              {art.images.length > 1 && (
                <motion.div
                  className="flex justify-center mt-6 space-x-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {art.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                        selectedImage === index
                          ? "border-[#8a4b3c] scale-105 shadow-md"
                          : "border-[#e8e1d9] hover:border-[#d3c8be]"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${art.title} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <div>
              <motion.h1 
                className="text-3xl lg:text-4xl font-light text-[#3a302c] mb-2 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {art.title}
              </motion.h1>
              <motion.p 
                className="text-xl text-[#8a4b3c] font-medium flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <User className="h-5 w-5 mr-2" />
                By {art.createdBy?.name || "Unknown Artist"}
              </motion.p>
            </div>

            <motion.div 
              className="flex items-center gap-6 text-sm text-[#6e635c] flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center bg-[#f8f5f0] px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>4.8 (24 reviews)</span>
              </div>
              <div className="flex items-center bg-[#f8f5f0] px-3 py-1 rounded-full">
                <Eye className="h-4 w-4 mr-1" />
                <span>156 views</span>
              </div>
              {art.categories && (
                <div className="flex items-center bg-[#f8f5f0] px-3 py-1 rounded-full">
                  <Palette className="h-4 w-4 mr-1" />
                  <span>{art.categories}</span>
                </div>
              )}
            </motion.div>

            {art.price && (
              <motion.div 
                className="text-4xl font-bold text-[#8a4b3c]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                ₹{art.price.toLocaleString()}
                <span className="text-lg font-normal text-[#6e635c] ml-2">(Inclusive of all taxes)</span>
              </motion.div>
            )}

            {/* Art Details Tabs */}
            <motion.div 
              className="border-b border-[#e8e1d9]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === "description"
                      ? "text-[#8a4b3c] border-b-2 border-[#8a4b3c]"
                      : "text-[#6e635c] hover:text-[#3a302c]"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === "details"
                      ? "text-[#8a4b3c] border-b-2 border-[#8a4b3c]"
                      : "text-[#6e635c] hover:text-[#3a302c]"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-3 px-1 font-medium transition-colors ${
                    activeTab === "shipping"
                      ? "text-[#8a4b3c] border-b-2 border-[#8a4b3c]"
                      : "text-[#6e635c] hover:text-[#3a302c]"
                  }`}
                >
                  Shipping
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="min-h-[120px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {activeTab === "description" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#3a302c]">About this artwork</h3>
                  {art.description ? (
                    <p className="text-[#6e635c] leading-relaxed">{art.description}</p>
                  ) : (
                    <p className="text-[#9c8e86] italic">No description available for this artwork.</p>
                  )}
                  
                  {art.tags && art.tags.length > 0 && (
                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-[#3a302c] mb-2 flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {art.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#edeae5] text-[#6e635c] text-xs rounded-full hover:bg-[#d3c8be] transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#3a302c]">Artwork Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                   
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-[#8a4b3c] mr-2" />
                      <span className="text-[#6e635c]">
                        <strong className="text-[#3a302c]">Created: </strong>
                        {new Date(art.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-[#8a4b3c] mr-2" />
                      <span className="text-[#6e635c]">
                        <strong className="text-[#3a302c]">Condition: </strong>
                        {art.condition || "Excellent"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#3a302c]">Shipping & Returns</h3>
                  <div className="space-y-3 text-sm text-[#6e635c]">
                    <div className="flex items-start">
                      <Truck className="h-4 w-4 text-[#8a4b3c] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Free shipping worldwide. Usually ships within 3-5 business days.</span>
                    </div>
                    <div className="flex items-start">
                      <Shield className="h-4 w-4 text-[#8a4b3c] mr-2 mt-0.5 flex-shrink-0" />
                      <span>Professional packaging and insurance included.</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 text-[#8a4b3c] mr-2 mt-0.5 flex-shrink-0" />
                      <span>30-day return policy. Full refund if returned in original condition.</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div 
              className="space-y-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <AddToCartButton artId={art._id} />
              <div className="flex gap-3">
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistProcessing}
                  className={`flex-1 flex items-center justify-center gap-2 border border-[#e8e1d9] text-[#6e635c] py-3 rounded-xl hover:bg-[#f8f5f0] transition-colors ${
                    wishlistProcessing ? "opacity-50 cursor-not-allowed" : ""
                  } ${inWishlist ? "bg-[#fde8e5] border-[#d15c4f] text-[#d15c4f] animate-heartbeat-slow" : ""}`}
                >
                  {wishlistProcessing ? (
                    <div className="animate-spin-slow rounded-full h-5 w-5 border-2 border-[#8a4b3c] border-t-transparent" />
                  ) : (
                    <Heart
                      className={`h-5 w-5 transition-all ${
                        inWishlist ? "fill-[#d15c4f] stroke-[#d15c4f]" : "fill-none stroke-current"
                      }`}
                    />
                  )}
                  {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
                <motion.button 
                  className="p-3 border border-[#e8e1d9] text-[#6e635c] rounded-xl hover:bg-[#f8f5f0] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Share this artwork"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="pt-6 border-t border-[#e8e1d9] space-y-4 text-sm text-[#6e635c] bg-[#f8f5f0] p-4 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h4 className="font-medium text-[#3a302c] flex items-center">
                <Info className="h-4 w-4 mr-2 text-[#8a4b3c]" />
                Purchase Protection
              </h4>
              <p className="text-sm">
                Your purchase is protected by our authenticity guarantee and secure payment processing.
                We ensure the artwork arrives in perfect condition or your money back.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {sameArtistArts.length > 0 && (
          <motion.div 
            className="mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-[#3a302c]">
                More from {art.createdBy?.name}
              </h2>
              <Link
                to={`/gallery`}
                className="text-[#8a4b3c] hover:text-[#723c2f] text-sm font-medium flex items-center"
              >
                View all works <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sameArtistArts.map((artistArt) => (
                <motion.div key={artistArt._id} variants={itemVariants}>
                  <Link
                    to={`/arts/${artistArt._id}`}
                    className="bg-white rounded-xl overflow-hidden border border-[#e8e1d9] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group block"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={artistArt.images[0]}
                        alt={artistArt.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#3a302c] truncate mb-1">
                        {artistArt.title}
                      </h3>
                      <p className="text-[#8a4b3c] font-semibold">₹{artistArt.price?.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {otherArts.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-2xl font-light text-[#3a302c] mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherArts.map((otherArt) => (
                <motion.div key={otherArt._id} variants={itemVariants}>
                  <Link
                    to={`/arts/${otherArt._id}`}
                    className="bg-white rounded-xl overflow-hidden border border-[#e8e1d9] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group block"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={otherArt.images[0]}
                        alt={otherArt.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[#3a302c] truncate mb-1">
                        {otherArt.title}
                      </h3>
                      <p className="text-sm text-[#6e635c] mb-2">
                        By {otherArt.createdBy?.name}
                      </p>
                      <p className="text-[#8a4b3c] font-semibold">₹{otherArt.price?.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes heartbeat-slow {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-heartbeat-slow {
          animation: heartbeat-slow 2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ArtDetails;