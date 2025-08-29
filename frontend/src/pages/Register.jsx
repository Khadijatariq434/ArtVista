import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Palette, UserPlus, ArrowLeft } from "lucide-react";

const Register=()=> {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: ""
  });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setMsg("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (form.password.length < 6) {
      setMsg("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    const res = await register(form);
    if (res?.token) {
      navigate("/dashboard");
    } else {
      setMsg(res?.message || "Registration failed. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] to-[#f1ebe4] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Decorative Header */}
        <div className="bg-gradient-to-r from-[#8a4b3c] to-[#6e635c] py-6 px-8 relative">
          <div className="absolute top-4 left-6">
            <Link 
              to="/"
              className="text-white/80 hover:text-white transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-4 text-center text-3xl font-bold text-white">
              Create Account
            </h2>
            <p className="mt-2 text-center text-white/90 text-sm">
              Join our community of art enthusiasts
            </p>
          </div>
        </div>

        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#3a302c] mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-[#e8e1d9] placeholder-[#9c8e86] text-[#3a302c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#3a302c] mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-[#e8e1d9] placeholder-[#9c8e86] text-[#3a302c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#3a302c] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-[#e8e1d9] placeholder-[#9c8e86] text-[#3a302c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all pr-12"
                  placeholder="Create a password (min. 6 characters)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#6e635c]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#6e635c]" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#3a302c] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-[#e8e1d9] placeholder-[#9c8e86] text-[#3a302c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all pr-12"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-[#6e635c]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#6e635c]" />
                  )}
                </button>
              </div>
            </div>

            {msg && (
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-sm text-red-800 text-center">{msg}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#8a4b3c] hover:bg-[#723c2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4b3c] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-[#6e635c]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#8a4b3c] hover:text-[#723c2f] transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Decorative Footer */}
        <div className="bg-[#f8f5f0] py-4 px-8 border-t border-[#e8e1d9]">
          <div className="flex items-center justify-center">
            <Palette className="h-4 w-4 text-[#8a4b3c] mr-2" />
            <span className="text-xs text-[#6e635c]">
              Join thousands of art lovers and creators
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;