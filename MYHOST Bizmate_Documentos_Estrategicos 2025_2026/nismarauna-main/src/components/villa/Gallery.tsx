import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import poolLoungers from "@/assets/pool-loungers.jpg";
import villaExterior from "@/assets/villa-exterior.jpg";
import bedroomGarden from "@/assets/bedroom-garden.jpg";
import bedroomSwans from "@/assets/bedroom-swans.jpg";
import bedroomWide from "@/assets/bedroom-wide.jpg";
import poolPalms from "@/assets/pool-palms.jpg";

const galleryImages = [
  { src: poolLoungers, alt: "Private pool with loungers and tropical garden", label: "Pool Terrace" },
  { src: villaExterior, alt: "Villa exterior at dusk", label: "Villa Exterior" },
  { src: bedroomGarden, alt: "Master bedroom with garden view", label: "Master Suite" },
  { src: bedroomSwans, alt: "Bedroom with elegant towel art", label: "Guest Bedroom" },
  { src: bedroomWide, alt: "Spacious bedroom with natural light", label: "Living Space" },
  { src: poolPalms, alt: "Pool area with palm trees", label: "Garden View" },
];

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-10 md:py-14 bg-background">
      <div className="container-villa">
        {/* Section Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-2 font-body">
            Explore
          </p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground">
            The Villa Experience
          </h2>
          <div className="w-12 h-px bg-primary/30 mx-auto mt-4" />
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`gallery-image relative group cursor-pointer ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image.src)}
            >
              <div className={`overflow-hidden ${index === 0 ? "aspect-[4/3] md:aspect-square" : "aspect-[4/3]"}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-end justify-start p-6">
                <span className="text-primary-foreground font-display text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                  {image.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Gallery image"
                className="w-full h-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;
