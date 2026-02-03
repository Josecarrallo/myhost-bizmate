import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Wind, 
  Bath, 
  Sofa, 
  UtensilsCrossed, 
  Wifi, 
  Tv, 
  Waves, 
  Sparkles, 
  Car 
} from "lucide-react";

const amenities = [
  { icon: Wind, label: "Air-Conditioned Bedrooms" },
  { icon: Bath, label: "Private Bathrooms" },
  { icon: Sofa, label: "Comfortable Living Area" },
  { icon: UtensilsCrossed, label: "Fully Equipped Kitchen" },
  { icon: Wifi, label: "Free High-Speed Wi-Fi" },
  { icon: Tv, label: "Television & Entertainment" },
  { icon: Waves, label: "Private Swimming Pool" },
  { icon: Sparkles, label: "Daily Housekeeping" },
  { icon: Car, label: "Private Parking Area" },
];

const Amenities = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-screen flex items-center bg-secondary/30 py-8 md:py-12">
      <div className="container-villa w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-3 font-body">
            Comfort & Convenience
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Villa Amenities
          </h2>
          <div className="w-16 h-px bg-primary/30 mx-auto mt-6" />
        </motion.div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {amenities.map((amenity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col items-center text-center p-4 md:p-6 bg-background rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <amenity.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-foreground font-body text-sm md:text-base leading-tight">
                {amenity.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
