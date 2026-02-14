import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import finalRiceField from "@/assets/final-rice-field.jpg";
import finalVillaSide from "@/assets/final-villa-side.jpg";
import finalGardenPath from "@/assets/final-garden-path.jpg";
import finalVillaRice from "@/assets/final-villa-rice.jpg";

const images = [
  { src: finalRiceField, alt: "Rice fields with palm trees" },
  { src: finalVillaSide, alt: "Villa side view" },
  { src: finalGardenPath, alt: "Garden pathway to the villa" },
  { src: finalVillaRice, alt: "Villa and rice field panorama" },
];

const FinalGallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-10 md:py-14 bg-muted/20 overflow-hidden">
      <div className="container-villa">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-2 font-body">
            Discover
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">
            Nismara Uma Villa
          </h2>
          <div className="w-12 h-px bg-primary/30 mx-auto mt-4" />
        </motion.div>

        {/* Grid: show all 4 at once on laptop/desktop; keep a stable 2x2 on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="overflow-hidden rounded-sm"
            >
              {/* Slightly shorter ratio on large screens so the 4-up grid fits comfortably */}
              <div className="aspect-[4/3] lg:aspect-[1/1] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalGallery;
