import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Palette, Eye, EyeOff, Loader, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = ({ onToggleMode, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const result = await login(formData);
      
      if (result && result.token) {
        navigate('/dashboard');
        if (onClose) onClose();
      } else {
        setErrors({ submit: result?.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200 to-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-slate-200 to-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-gray-100 to-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className={`relative max-w-md w-full transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-slate-600 to-gray-700 p-[1px] rounded-2xl">
            <div className="bg-white rounded-2xl h-full w-full"></div>
          </div>

          <div className="relative p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-slate-600 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative rounded-full h-20 w-20 bg-gradient-to-br from-gray-700 to-slate-700 flex items-center justify-center shadow-xl transform transition-all duration-500 group-hover:scale-110">
                  <Palette className="h-10 w-10 text-white transform group-hover:rotate-12 transition-transform duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-slate-600 rounded-full opacity-0 group-hover:opacity-10 blur transition-opacity duration-500"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8 text-lg">Sign in to your art collection</p>
            
            {errors.submit && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 transform transition-all duration-300 animate-shake">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  {errors.submit}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl opacity-0 blur transition-opacity duration-300 ${
                    focusedField === 'email' ? 'opacity-15' : ''
                  }`}></div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`relative w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-0 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : focusedField === 'email'
                        ? 'border-gray-600 shadow-lg shadow-gray-600/15'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                  <Mail className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 animate-fadeIn">{errors.email}</p>
                )}
              </div>
              
              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl opacity-0 blur transition-opacity duration-300 ${
                    focusedField === 'password' ? 'opacity-15' : ''
                  }`}></div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`relative w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-0 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : focusedField === 'password'
                        ? 'border-gray-600 shadow-lg shadow-gray-600/15'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <Lock className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-300 ${
                    focusedField === 'password' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <button
                    type="button"
                    className="absolute right-4 top-4 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 animate-fadeIn">{errors.password}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="relative">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-md bg-white group-hover:border-purple-500 transition-colors duration-200"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                  </div>
                  <span className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors duration-200">Remember me</span>
                </label>
                
                <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-800 hover:to-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-500/20 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-slate-700 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {isSubmitting || loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">New to our gallery?</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="group w-full flex justify-center items-center py-4 px-6 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all duration-300 hover:scale-[1.02]"
                ><a href="/register">
                  Create your account</a>
                  <div className="ml-2 w-2 h-2 bg-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 rounded-b-2xl border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;