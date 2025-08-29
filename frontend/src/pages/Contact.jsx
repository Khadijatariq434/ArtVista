import { useState, useRef, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Instagram, 
  Facebook, 
  Twitter,
  Heart,
  Palette,
  Brush,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        direction: Math.random() * Math.PI * 2,
        color: `hsl(${Math.random() * 60 + 10}, 30%, 80%)`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(248, 245, 240, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        if (particle.x < 0 || particle.x > canvas.width || 
            particle.y < 0 || particle.y > canvas.height) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.direction = Math.random() * Math.PI * 2;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const floatingIcons = [
    { icon: Palette, delay: 0 },
    { icon: Brush, delay: 0.5 },
    { icon: Heart, delay: 1 },
    { icon: Camera, delay: 1.5 }
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0] relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50"
      />

      {floatingIcons.map(({ icon: Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-[#d3c8be]"
          initial={{ 
            y: Math.random() * 100 + 50,
            x: Math.random() * 100 - 50,
            rotate: Math.random() * 360
          }}
          animate={{
            y: [null, Math.random() * 200 + 100, Math.random() * 100 + 50],
            x: [null, Math.random() * 200 - 100, Math.random() * 100 - 50],
            rotate: [null, Math.random() * 720, Math.random() * 360]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
      ))}

      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl font-light text-[#3a302c] mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl text-[#6e635c] max-w-2xl mx-auto"
          >
            Let's create something beautiful together. I'd love to hear about your project ideas.
          </motion.p>
        </motion.header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-light text-[#3a302c] mb-6">Let's Connect</h2>
                <p className="text-[#6e635c] mb-8">
                  Whether you're interested in commissioning a piece, collaborating on a project, 
                  or just want to say hello, I'm always open to new conversations and opportunities.
                </p>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[#e8e1d9]"
                >
                  <div className="p-3 bg-[#f3ebe5] rounded-full">
                    <Mail className="h-6 w-6 text-[#8a4b3c]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#3a302c]">Email</h3>
                    <p className="text-[#6e635c]">hello@artvista.com</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[#e8e1d9]"
                >
                  <div className="p-3 bg-[#f3ebe5] rounded-full">
                    <Phone className="h-6 w-6 text-[#8a4b3c]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#3a302c]">Phone</h3>
                    <p className="text-[#6e635c]">+91-9876543210</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-[#e8e1d9]"
                >
                  <div className="p-3 bg-[#f3ebe5] rounded-full">
                    <MapPin className="h-6 w-6 text-[#8a4b3c]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#3a302c]">Studio</h3>
                    <p className="text-[#6e635c]">Uttar Pradesh, India</p>
                  </div>
                </motion.div>
              </div>

              <div>
                <h3 className="font-medium text-[#3a302c] mb-4">Follow My Work</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Instagram, color: "hover:text-pink-600" },
                    { icon: Facebook, color: "hover:text-blue-600" },
                    { icon: Twitter, color: "hover:text-blue-400" }
                  ].map((SocialIcon, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 bg-white border border-[#e8e1d9] rounded-full text-[#6e635c] transition-colors ${SocialIcon.color}`}
                    >
                      <SocialIcon.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#e8e1d9]"
            >
              <h2 className="text-2xl font-light text-[#3a302c] mb-6">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-[#3a302c]">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-[#3a302c]">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-[#3a302c]">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all"
                    placeholder="What's this about?"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-[#3a302c]">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-[#e8e1d9] rounded-lg focus:ring-2 focus:ring-[#8a4b3c] focus:border-transparent transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#8a4b3c] to-[#723c2f] text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>

              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                  >
                    Thank you! Your message has been sent successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center py-12"
        >
          <p className="text-[#6e635c]">
            Made with <Heart className="inline h-4 w-4 text-red-400" /> for the art community
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default ContactPage;