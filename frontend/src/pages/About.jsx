import { useState, useRef, useEffect } from "react";
import { 
  Heart, 
  Palette, 
  Brush, 
  Users, 
  Award, 
  Sparkles,
  Target,
  Eye,
  Globe,
  ArrowRight,
  Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("mission");
  const canvasRef = useRef(null);

  useEffect(() => {
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const strokes = [];
    const strokeCount = 20;

    for (let i = 0; i < strokeCount; i++) {
      strokes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50,
        angle: Math.random() * Math.PI * 2,
        width: Math.random() * 3 + 1,
        speed: Math.random() * 0.3 + 0.1,
        color: `hsla(${Math.random() * 30 + 10}, 40%, 70%, ${Math.random() * 0.2 + 0.1})`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(248, 245, 240, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      strokes.forEach(stroke => {
        ctx.beginPath();
        ctx.moveTo(stroke.x, stroke.y);
        ctx.lineTo(
          stroke.x + Math.cos(stroke.angle) * stroke.length,
          stroke.y + Math.sin(stroke.angle) * stroke.length
        );
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.stroke();

        stroke.x += Math.cos(stroke.angle) * stroke.speed;
        stroke.y += Math.sin(stroke.angle) * stroke.speed;

        if (stroke.x < -stroke.length || stroke.x > canvas.width + stroke.length ||
            stroke.y < -stroke.length || stroke.y > canvas.height + stroke.length) {
          stroke.x = Math.random() * canvas.width;
          stroke.y = Math.random() * canvas.height;
          stroke.angle = Math.random() * Math.PI * 2;
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

  const floatingElements = [
    { icon: Palette, delay: 0, size: "h-8 w-8" },
    { icon: Brush, delay: 0.3, size: "h-10 w-10" },
    { icon: Heart, delay: 0.6, size: "h-6 w-6" },
    { icon: Sparkles, delay: 0.9, size: "h-7 w-7" }
  ];

  const stats = [
    { number: "500+", label: "Artworks", icon: Palette },
    { number: "100+", label: "Artists", icon: Users },
    { number: "10K+", label: "Collectors", icon: Heart },
    { number: "5+", label: "Years", icon: Award }
  ];

  const values = [
    {
      icon: Eye,
      title: "Vision",
      description: "To create a world where art is accessible to everyone and artists are valued for their unique contributions."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We are driven by our love for art and our commitment to supporting artistic expression in all its forms."
    },
    {
      icon: Globe,
      title: "Community",
      description: "Building a global community that connects artists, collectors, and art enthusiasts across boundaries."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Curating only the highest quality artworks and providing exceptional service to our community."
    }
  ];

 

  return (
    <div className="min-h-screen bg-[#f8f5f0] relative overflow-hidden">
  
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      
      {floatingElements.map(({ icon: Icon, delay, size }, index) => (
        <motion.div
          key={index}
          className="absolute text-[#d3c8be]"
          initial={{ 
            y: Math.random() * 100 + 50,
            x: Math.random() * 100 - 50,
            rotate: Math.random() * 360,
            scale: 0
          }}
          animate={{
            y: [null, Math.random() * 200 + 100],
            x: [null, Math.random() * 200 - 100],
            rotate: [null, Math.random() * 720],
            scale: 1
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
          }}
        >
          <Icon className={size} />
        </motion.div>
      ))}

      <div className="relative z-10">
      
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center py-20 px-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-5xl md:text-6xl font-light text-[#3a302c] mb-6"
            >
              About ArtVista
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl text-[#6e635c] mb-8 leading-relaxed"
            >
              Where tradition meets innovation in the world of art. We bridge the gap between 
              ancient Japanese aesthetics and contemporary artistic expression.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="w-24 h-1 bg-[#8a4b3c] mx-auto rounded-full"
            />
          </motion.div>
        </motion.section>

      
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="py-16 bg-white/50 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f3ebe5] rounded-full mb-4">
                      <Icon className="h-8 w-8 text-[#8a4b3c]" />
                    </div>
                    <div className="text-3xl font-bold text-[#3a302c] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-[#6e635c]">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl font-light text-[#3a302c] mb-6">Our Story</h2>
                <div className="space-y-4 text-[#6e635c] leading-relaxed">
             <p>
  ArtVista was created with a simple vision: to connect the timeless essence of art with the creativity of modern artists worldwide. 
  What began as a small idea has grown into a vibrant global community where tradition and innovation flow together seamlessly.
</p>
<p>
  We believe art is more than decoration — it tells stories, stirs emotions, and transforms spaces. 
  Each piece in our collection is thoughtfully selected to celebrate creativity, culture, and the unique voice of every artist.
</p>
<p>
  Our platform is dedicated to supporting artists at every stage of their journey, while helping collectors discover artwork that resonates with their hearts and brings meaning into their lives.
</p>


                </div>
              </div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative"
              >
               <div className="bg-[#f3ebe5] rounded-2xl p-8 border border-[#e8e1d9]">
  <Quote className="h-12 w-12 text-[#8a4b3c] mb-4" />
  <blockquote className="text-xl italic text-[#3a302c] mb-4">
    "Art has the power to inspire, connect, and transform the way we see the world."
  </blockquote>
  <cite className="text-[#6e635c]">– ArtVista Team</cite>
</div>

              </motion.div>
            </motion.div>
          </div>
        </section>

    
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl font-light text-[#3a302c] text-center mb-16"
            >
              Our Values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="text-center p-6 bg-white rounded-2xl border border-[#e8e1d9] hover:shadow-lg transition-shadow"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f3ebe5] rounded-full mb-6">
                      <Icon className="h-8 w-8 text-[#8a4b3c]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#3a302c] mb-4">
                      {value.title}
                    </h3>
                    <p className="text-[#6e635c] leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

       
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 bg-[#f3ebe5]"
        >
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-light text-[#3a302c] mb-6">
              Join Our Artistic Journey
            </h2>
            <p className="text-xl text-[#6e635c] mb-8">
              Whether you're an artist looking to showcase your work or an art lover seeking 
              inspiration, we invite you to become part of our growing community.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#8a4b3c] text-white px-8 py-4 rounded-lg font-medium inline-flex items-center space-x-2 hover:shadow-lg transition-all"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
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

export default AboutPage;