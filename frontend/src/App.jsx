import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HeroSection from "./components/HeroSection";
import Arts from "./pages/Arts";
import Footer from "./components/Footer";
import ManageArt from "./pages/ManageArt";
import ArtDetails from "./pages/ArtDetails";
import Cart from "./pages/Cart";
import AboutPage from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import Wishlist from "./pages/Wishlist";
import Gallery from "./components/Gallery";
import ArtsByCategory from "./components/ArtByCategory";
import ContactPage from "./pages/Contact";
import CollectionsPage from "./pages/Collections";
import Checkout from "./components/Checkout";

const App=()=>{
  return(
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100">
      <Navbar/>
      <ScrollToTop/>
    
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/manage-art" element={<ManageArt/>}/>
      <Route path="/arts/:id" element={<ArtDetails/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/about" element={<AboutPage/>}/>
      <Route path="/wishlist" element={<Wishlist/>}/>
      <Route path="/gallery" element={<Gallery/>}/>
      <Route path="/arts" element={<ArtsByCategory/>}/>
      <Route path="/contact-us" element={<ContactPage/>}/>
      <Route path="/collections" element={<CollectionsPage/>}/>
      <Route path="/checkout" element={<Checkout/>}/>
    </Routes>

    <Footer/>
    </div>
  )
}

export default App;