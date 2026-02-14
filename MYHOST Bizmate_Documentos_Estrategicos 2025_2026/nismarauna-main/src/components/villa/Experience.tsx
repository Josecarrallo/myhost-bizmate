import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TreePalm, Footprints, Flower2, Home, Coffee, MapPin } from "lucide-react";

const experiences = [
  {
    icon: TreePalm,
    title: "Nature & Surroundings",
    description: "Surrounded by rice fields, palm trees, and lush greenery. A peaceful hideaway designed for calm mornings and slow evenings immersed in nature.",
  },
  {
    icon: Footprints,
    title: "Jogging & Walking Routes",
    description: "Ideal for morning walks or light jogging, with quiet village paths and scenic rice field routes just steps from the villa.",
  },
  {
    icon: Flower2,
    title: "Wellness & Slow Living",
    description: "A space created for rest, balance, and digital detox. Perfect for yoga, meditation, reading, and reconnecting with yourself.",
  },
  {
    icon: Home,
    title: "Village Life & Local Culture",
    description: "Experience authentic Balinese village life, with local temples, daily rituals, and traditional surroundings nearby.",
  },
  {
    icon: Coffee,
    title: "Cafés & Local Spots",
    description: "Easy access to nearby cafés, local warungs, and small dining spots, offering a taste of the area's lifestyle.",
  },
  {
    icon: MapPin,
    title: "Easy Access, Total Privacy",
    description: "While feeling completely private and secluded, the villa is conveniently located for short drives to nearby highlights.",
  },
];

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Vibrant Bali-inspired colors: lush greens, pool blues, golden sunlight, tropical warmth
  const cardStyles = [
    // Nature - Lush tropical green
    "bg-gradient-to-br from-[hsl(140_60%_40%)]/25 via-[hsl(140_50%_50%)]/15 to-[hsl(100_40%_85%)]/40 border-2 border-[hsl(140_60%_40%)]/40 hover:border-[hsl(140_60%_40%)]/70 hover:from-[hsl(140_60%_40%)]/35 shadow-[0_4px_20px_-4px_hsl(140_60%_40%/0.3)]",
    // Jogging - Golden morning sun
    "bg-gradient-to-br from-[hsl(45_90%_55%)]/30 via-[hsl(40_80%_60%)]/20 to-[hsl(35_70%_80%)]/40 border-2 border-[hsl(45_80%_50%)]/40 hover:border-[hsl(45_80%_50%)]/70 hover:from-[hsl(45_90%_55%)]/40 shadow-[0_4px_20px_-4px_hsl(45_80%_50%/0.3)]",
    // Wellness - Serene pool blue
    "bg-gradient-to-br from-[hsl(190_70%_50%)]/25 via-[hsl(195_60%_55%)]/15 to-[hsl(200_50%_80%)]/40 border-2 border-[hsl(190_70%_50%)]/40 hover:border-[hsl(190_70%_50%)]/70 hover:from-[hsl(190_70%_50%)]/35 shadow-[0_4px_20px_-4px_hsl(190_70%_50%/0.3)]",
    // Village - Warm terracotta/temple
    "bg-gradient-to-br from-[hsl(18_65%_50%)]/25 via-[hsl(25_55%_55%)]/15 to-[hsl(30_45%_80%)]/40 border-2 border-[hsl(18_65%_50%)]/40 hover:border-[hsl(18_65%_50%)]/70 hover:from-[hsl(18_65%_50%)]/35 shadow-[0_4px_20px_-4px_hsl(18_65%_50%/0.3)]",
    // Cafés - Rich coffee brown with warmth
    "bg-gradient-to-br from-[hsl(30_50%_45%)]/25 via-[hsl(35_45%_50%)]/15 to-[hsl(40_40%_75%)]/40 border-2 border-[hsl(30_50%_45%)]/40 hover:border-[hsl(30_50%_45%)]/70 hover:from-[hsl(30_50%_45%)]/35 shadow-[0_4px_20px_-4px_hsl(30_50%_45%/0.3)]",
    // Privacy - Fresh palm green
    "bg-gradient-to-br from-[hsl(160_50%_40%)]/25 via-[hsl(155_45%_45%)]/15 to-[hsl(150_40%_80%)]/40 border-2 border-[hsl(160_50%_40%)]/40 hover:border-[hsl(160_50%_40%)]/70 hover:from-[hsl(160_50%_40%)]/35 shadow-[0_4px_20px_-4px_hsl(160_50%_40%/0.3)]",
  ];

  const iconStyles = [
    // Nature - Lush green
    "bg-[hsl(140_60%_40%)] text-white shadow-lg shadow-[hsl(140_60%_40%)]/40 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[hsl(140_60%_40%)]/50",
    // Jogging - Golden sun
    "bg-[hsl(45_85%_50%)] text-[hsl(25_40%_20%)] shadow-lg shadow-[hsl(45_85%_50%)]/40 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[hsl(45_85%_50%)]/50",
    // Wellness - Pool blue
    "bg-[hsl(190_70%_50%)] text-white shadow-lg shadow-[hsl(190_70%_50%)]/40 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[hsl(190_70%_50%)]/50",
    // Village - Terracotta
    "bg-[hsl(18_65%_50%)] text-white shadow-lg shadow-[hsl(18_65%_50%)]/40 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[hsl(18_65%_50%)]/50",
    // Cafés - Coffee brown
    "bg-[hsl(30_50%_40%)] text-white shadow-lg shadow-[hsl(30_50%_40%)]/40 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[hsl(30_50%_40%)]/50",
    // Privacy - Palm green
    "bg-[hsl(160_50%_40%)] text-white shadow-lg shadow-[hsl(160_50%_40%)]/40 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[hsl(160_50%_40%)]/50",
  ];

  return (
    <section ref={ref} className="py-6 md:py-10 relative overflow-hidden">
      {/* Vibrant Bali-inspired background with tropical colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(140_40%_95%)] via-[hsl(45_50%_97%)] to-[hsl(190_40%_95%)]" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-[hsl(140_60%_50%)]/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[hsl(190_70%_50%)]/15 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      
      <div className="container-villa relative z-10">

        {/* Experience Grid - Compact cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.title}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 * index }}
              className="group"
            >
              <div className={`${cardStyles[index]} backdrop-blur-sm rounded-xl p-5 h-full transition-all duration-500 hover:-translate-y-1`}>
                {/* Icon - Smaller */}
                <div className="mb-3">
                  <div className={`w-12 h-12 rounded-xl ${iconStyles[index]} flex items-center justify-center transition-all duration-300`}>
                    <experience.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title - Smaller */}
                <h3 className="font-display text-lg md:text-xl text-foreground mb-2 transition-colors duration-300">
                  {experience.title}
                </h3>

                {/* Description - Smaller text */}
                <p className="font-body text-muted-foreground text-xs leading-relaxed">
                  {experience.description}
                </p>

                {/* Decorative accent line */}
                <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-[hsl(140_60%_40%)] via-[hsl(190_70%_50%)] to-[hsl(45_85%_50%)] rounded-full opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
