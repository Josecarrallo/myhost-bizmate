import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface LifestyleImageProps {
  src: string;
  alt: string;
  caption?: string;
}

const LifestyleImage = ({ src, alt, caption }: LifestyleImageProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative overflow-hidden py-2 md:py-3">
      <div className="container-villa">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-[16/9] md:aspect-[21/9] max-w-5xl mx-auto rounded-sm overflow-hidden"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
          <div className="image-overlay-light" />
        
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
            <p className="text-primary-foreground/80 font-display text-base italic">
              {caption}
            </p>
          </div>
        )}
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleImage;
