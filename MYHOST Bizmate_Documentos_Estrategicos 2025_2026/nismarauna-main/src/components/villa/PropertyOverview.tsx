import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import villaExterior from "@/assets/villa-exterior.jpg";

const PropertyOverview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-10 md:py-14 bg-secondary/30">
      <div className="container-villa">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Image - Larger and more prominent */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden lg:order-1"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-sm">
              <img
                src={villaExterior}
                alt="Nismara Uma Villa exterior with pool"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Content - More compact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:order-2"
          >
            <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-2 font-body">
              The Property
            </p>

            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
              Your Private Sanctuary
            </h2>

            <div className="w-12 h-px bg-primary/30 mb-4" />

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4 font-body">
              Set amidst lush rice paddies and tropical gardens, Nismara Uma Villa 
              offers an authentic Balinese experience with modern comforts.
            </p>

            <ul className="space-y-2 text-foreground font-body text-sm md:text-base">
              {[
                "Private swimming pool with rice field views",
                "Cozy living room with entertainment area",
                "Fully equipped kitchen for your convenience",
                "Designed for comfort, privacy, and serenity"
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                  className="flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mr-3" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PropertyOverview;
