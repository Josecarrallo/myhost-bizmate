import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/hero-bali.jpg';
    img.onload = () => setImageLoaded(true);
    // If already cached, it loads instantly
    if (img.complete) setImageLoaded(true);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundColor: '#3d4a32', // Fallback matching hero tones
        backgroundImage: 'url(/hero-bali.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        opacity: imageLoaded ? 1 : 0.95,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      {/* Overlay */}
      <div className="image-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center container-villa">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Location Tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-primary-foreground/80 text-sm tracking-[0.3em] uppercase mb-6 font-body"
          >
            Bali, Indonesia
          </motion.p>

          {/* Main Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary-foreground font-medium leading-tight mb-6">
            Nismara Uma Villa
          </h1>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-24 h-px bg-primary-foreground/40 mx-auto mb-6"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-display text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 italic mb-4"
          >
            A Private Boutique Escape
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-primary-foreground/75 text-base md:text-lg font-body max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A peaceful hideaway designed for slow, comfortable living, surrounded by nature and calm.
          </motion.p>

        </motion.div>
      </div>

      {/* CTA Button - Positioned at bottom center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-24 left-0 right-0 z-10 flex justify-center"
      >
        <a 
          href="#availability" 
          className="inline-flex items-center justify-center px-8 py-3 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground text-sm tracking-[0.15em] uppercase font-body hover:bg-primary-foreground/20 transition-all duration-300 rounded-sm"
        >
          Check Availability
        </a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 border border-primary-foreground/40 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-primary-foreground/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
