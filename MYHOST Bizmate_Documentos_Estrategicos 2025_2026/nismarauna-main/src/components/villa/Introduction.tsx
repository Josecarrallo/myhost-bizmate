import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Introduction = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-12 md:py-16 relative overflow-hidden">
      {/* Colorful background with tropical gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(45_60%_96%)] via-[hsl(140_30%_97%)] to-[hsl(190_40%_96%)]" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-[hsl(45_90%_60%)]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[hsl(140_60%_50%)]/15 rounded-full blur-3xl" />
      
      <div className="container-villa relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Section Label with gradient pill */}
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block px-5 py-2 bg-gradient-to-r from-[hsl(140_60%_40%)] via-[hsl(190_70%_50%)] to-[hsl(45_85%_50%)] text-white text-xs tracking-[0.25em] uppercase mb-6 font-body rounded-full shadow-lg shadow-[hsl(140_60%_40%)]/30"
          >
            The Experience
          </motion.span>

          {/* Main Text with gradient highlight */}
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed mb-5">
            Nismara Uma Villa is a{" "}
            <span className="bg-gradient-to-r from-[hsl(140_60%_40%)] via-[hsl(190_70%_50%)] to-[hsl(45_85%_50%)] bg-clip-text text-transparent">
              peaceful hideaway
            </span>{" "}
            designed for slow, comfortable living.
          </h2>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(140_60%_40%)] via-[hsl(190_70%_50%)] to-[hsl(45_85%_50%)] mx-auto mb-5 rounded-full" />

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-body">
            With two cozy bedrooms, a warm living space, and a private swimming pool, 
            it offers a calm and intimate environment for couples, families, or friends 
            seeking <span className="text-[hsl(140_60%_35%)] font-medium">privacy and simplicity</span> in Bali.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Introduction;
