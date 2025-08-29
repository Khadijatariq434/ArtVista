import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
  ArrowLeft,
  ShoppingBag,
  Truck
} from "lucide-react";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderApproved, setOrderApproved] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    shippingMethod: "standard",
    saveInfo: false
  });

  const getSubtotal = () => {
    if (!cart?.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.art?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getShipping = () => {
    if (formData.shippingMethod === "express") {
      return 100;
    } else if (formData.shippingMethod === "premium") {
      return 150;
    }
    return 50; 
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateOrderNumber = () => {
    return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);
      setOrderApproved(true);
      setIsProcessing(false);
      clearCart();
    }, 3000);
  };

  if (orderApproved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-[#e8e1d9] text-center">
      
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-ping absolute h-16 w-16 rounded-full bg-green-400 opacity-75"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Order Approved!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-medium text-gray-800">{orderNumber}</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link
              to="/gallery"
              className="bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="border border-[#e8e1d9] text-[#6e635c] py-3 rounded-lg hover:bg-[#f8f5f0] transition-colors"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center text-[#8a4b3c] hover:text-[#723c2f] mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-light text-[#3a302c] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#e8e1d9]">
            <form onSubmit={handleSubmit} className="space-y-6">
          
              <div>
                <h2 className="text-xl font-medium text-[#3a302c] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              
              <div>
                <h2 className="text-xl font-medium text-[#3a302c] mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </h2>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

      
              <div>
                <h2 className="text-xl font-medium text-[#3a302c] mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-[#e8e1d9] rounded-lg cursor-pointer hover:bg-[#f8f5f0] transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === "standard"}
                      onChange={handleInputChange}
                      className="text-[#8a4b3c] focus:ring-[#8a4b3c]"
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-[#3a302c]">Standard Shipping</span>
                      <span className="block text-sm text-[#6e635c]">5-7 business days - ₹50</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-[#e8e1d9] rounded-lg cursor-pointer hover:bg-[#f8f5f0] transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === "express"}
                      onChange={handleInputChange}
                      className="text-[#8a4b3c] focus:ring-[#8a4b3c]"
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-[#3a302c]">Express Shipping</span>
                      <span className="block text-sm text-[#6e635c]">2-3 business days - ₹100</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-[#e8e1d9] rounded-lg cursor-pointer hover:bg-[#f8f5f0] transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="premium"
                      checked={formData.shippingMethod === "premium"}
                      onChange={handleInputChange}
                      className="text-[#8a4b3c] focus:ring-[#8a4b3c]"
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-[#3a302c]">Premium Shipping</span>
                      <span className="block text-sm text-[#6e635c]">Next business day - ₹150</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Order
                  </>
                )}
              </button>
            </form>
          </div>

        
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#e8e1d9] sticky top-8">
              <h2 className="text-xl font-medium text-[#3a302c] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.art._id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={item.art.images[0]}
                        alt={item.art.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-art.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#3a302c] truncate">{item.art.title}</h3>
                      <p className="text-sm text-[#6e635c]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[#8a4b3c] font-semibold">
                      ₹{(item.art.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 border-t border-[#e8e1d9] pt-4">
                <div className="flex justify-between text-[#6e635c]">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-[#6e635c]">
                  <span>Shipping</span>
                  <span>₹{getShipping().toFixed(2)}</span>
                </div>
                
                <div className="border-t border-[#e8e1d9] pt-3">
                  <div className="flex justify-between text-lg font-semibold text-[#3a302c]">
                    <span>Total</span>
                    <span>₹{getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;