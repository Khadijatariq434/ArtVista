import { LogOut, User, Palette, ShoppingBag, Heart, Settings, Brush, MapPin, Calendar, Plus, Star, TrendingUp, Eye, ChevronRight, BarChart3, BookOpen, Grid, Bell, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard=()=> {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickActions = [
    { icon: ShoppingBag, label: "My Orders", color: "#8a4b3c", bgColor: "#f3ebe5", href: "/orders" },
    { icon: Heart, label: "Wishlist", color: "#d15c4f", bgColor: "#f9ecea", href: "/wishlist" },
    { icon: User, label: "Profile", color: "#6a8e7f", bgColor: "#ebf0ee", href: "/profile" },
    { icon: Brush, label: "Manage Art", color: "#4a6b8a", bgColor: "#e8eef4", href: "/manage-art" }
  ];

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: "12", color: "#8a4b3c", bgColor: "#f3ebe5", trend: "+2" },
    { icon: Heart, label: "Favorites", value: "8", color: "#d15c4f", bgColor: "#f9ecea", trend: "+3" },
    { icon: Eye, label: "Profile Views", value: "156", color: "#6a8e7f", bgColor: "#ebf0ee", trend: "+24" },
    { icon: Star, label: "Avg Rating", value: "4.8", color: "#b5832d", bgColor: "#f5edd8", trend: "+0.2" }
  ];

  const welcomeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7]">
      <div className="text-center">
        <div className="relative w-16 h-16 animate-spin-slow">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8a4b3c] to-[#d15c4f] rounded-full blur-xl opacity-70"></div>
          <div className="absolute inset-1 bg-[#fcfaf7] rounded-full"></div>
        </div>
        <p className="mt-6 text-[#6e635c] font-light">Loading your dashboard...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf7]">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-[#e8e1d9]">
        <p className="text-[#6e635c] mb-6 text-lg font-light">Please log in to access your dashboard.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-[#8a4b3c] text-white px-8 py-3 rounded-lg hover:bg-[#723c2f] transition-all transform hover:scale-105 shadow-md"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="bg-white border-b border-[#e8e1d9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Palette className="h-8 w-8 text-[#8a4b3c]" />
                <h1 className="ml-2 text-xl font-medium text-[#3a302c]">ArtVista</h1>
              </div>
              
              <div className="hidden md:flex items-center space-x-1 ml-8">
                {["overview", "analytics", "artworks", "sales"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "text-[#8a4b3c] border-b-2 border-[#8a4b3c]"
                        : "text-[#6e635c] hover:text-[#8a4b3c]"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-[#6e635c] hover:text-[#8a4b3c] rounded-full hover:bg-[#f8f5f0] transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center text-[#6e635c] hover:text-[#8a4b3c] hover:bg-[#f8f5f0] px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {mounted && (
            <>
              <motion.div 
                className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8"
                initial="hidden"
                animate="visible"
                variants={welcomeVariants}
              >
                <div className="flex items-center flex-grow">
                  <div className="h-16 w-16 rounded-full bg-[#8a4b3c] flex items-center justify-center text-white text-2xl font-medium shadow-md">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-3xl font-light text-[#3a302c]">
                      Welcome back, <span className="font-medium">{user.name}!</span>
                    </h2>
                    <p className="text-[#6e635c]">{user.email}</p>
                  </div>
                </div>

                <motion.button 
                  onClick={() => navigate('/manage-art')}
                  className="w-full md:w-auto flex items-center justify-center bg-[#4a6b8a] text-white px-6 py-3 rounded-lg hover:bg-[#3d5a76] transition-all transform hover:scale-105 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Manage Your Art
                </motion.button>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-lg p-5 border border-[#e8e1d9] shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1"
                    variants={statItemVariants}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg" style={{backgroundColor: stat.bgColor}}>
                        <stat.icon className="h-5 w-5" style={{color: stat.color}} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-[#6e635c]">{stat.label}</p>
                        <p className="text-xl font-bold text-[#3a302c]">{stat.value}</p>
                      </div>
                      {stat.trend && (
                        <div className="ml-auto flex items-center text-sm font-medium" style={{color: stat.color}}>
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {stat.trend}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                className="bg-white rounded-lg p-6 border border-[#e8e1d9] shadow-sm mb-8"
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <h3 className="text-lg font-medium text-[#3a302c] mb-6">Quick Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button 
                      key={index}
                      onClick={() => action.href && navigate(action.href)}
                      className="flex items-center p-4 border border-[#e8e1d9] rounded-lg transition-colors hover:bg-[#f8f5f0] shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      variants={statItemVariants}
                    >
                      <div 
                        className="p-3 rounded-lg" 
                        style={{backgroundColor: action.bgColor}}
                      >
                        <action.icon className="h-6 w-6" style={{color: action.color}} />
                      </div>
                      <span className="ml-4 text-base font-medium text-[#3a302c]">
                        {action.label}
                      </span>
                      <ChevronRight className="ml-auto h-5 w-5 text-[#6e635c]" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div 
                  className="bg-white rounded-lg p-6 border border-[#e8e1d9] shadow-sm"
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-[#3a302c]">
                      Recent Activity
                    </h3>
                    <button className="text-sm text-[#6e635c] hover:text-[#8a4b3c] transition-colors">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Order #12345 placed", time: "2 hours ago", status: "Completed", color: "#8a4b3c", bgColor: "#f3ebe5" },
                      { title: "Added to wishlist", time: "1 day ago", status: "Favorite", color: "#d15c4f", bgColor: "#f9ecea" },
                      { title: "New artwork published", time: "2 days ago", status: "Live", color: "#4a6b8a", bgColor: "#e8eef4" },
                      { title: "Order #12346 placed", time: "3 days ago", status: "Processing", color: "#b5832d", bgColor: "#f5edd8" }
                    ].map((activity, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-[#faf9f7] rounded-lg border border-[#e8e1d9] transition-all hover:bg-[#f8f5f0]"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#3a302c]">{activity.title}</p>
                          <p className="text-xs text-[#6e635c] flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {activity.time}
                          </p>
                        </div>
                        <span 
                          className="px-2 py-1 text-xs rounded-full font-semibold"
                          style={{
                            backgroundColor: activity.bgColor,
                            color: activity.color,
                          }}
                        >
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-lg p-6 border border-[#e8e1d9] shadow-sm"
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <h3 className="text-lg font-medium text-[#3a302c] mb-6">
                    Performance Metrics
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      { label: "Sales Conversion", value: "12.8%", progress: 65, color: "#8a4b3c" },
                      { label: "Customer Satisfaction", value: "94%", progress: 94, color: "#6a8e7f" },
                      { label: "Artwork Views", value: "1.2K", progress: 78, color: "#4a6b8a" }
                    ].map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#3a302c]">{metric.label}</span>
                          <span className="text-sm font-bold" style={{color: metric.color}}>{metric.value}</span>
                        </div>
                        <div className="w-full bg-[#e8e1d9] rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{
                              width: `${metric.progress}%`,
                              backgroundColor: metric.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-[#e8e1d9]">
                    <button className="w-full bg-[#f8f5f0] hover:bg-[#f3ebe5] text-[#6e635c] py-2 rounded-lg transition-colors">
                      View Detailed Analytics
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>

      {/* <footer className="mt-16 border-t border-[#e8e1d9] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#6e635c] text-sm">ArtVista &copy; {new Date().getFullYear()}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Terms', 'Privacy', 'Help'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-[#6e635c] hover:text-[#8a4b3c] text-sm transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
export default Dashboard;