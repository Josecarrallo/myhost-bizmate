import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Bed, Clock, CreditCard, Calendar, ShieldCheck } from "lucide-react";

const Details = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-8 md:py-10 bg-background" id="availability">
      <div className="container-villa">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Capacity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl text-foreground">Bedrooms & Capacity</h3>
            </div>
            <div className="space-y-2 text-muted-foreground font-body pl-0 md:pl-16">
              <p className="flex items-center justify-center md:justify-start">
                <Bed className="w-4 h-4 mr-2 text-primary/60" />
                2 Comfortable Bedrooms
              </p>
              <p>Maximum guests: 4 persons</p>
              <p className="text-sm italic">Ideal for couples, families, or small groups</p>
            </div>
          </motion.div>

          {/* Rates */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <CreditCard className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl text-foreground">Rates</h3>
            </div>
            <div className="space-y-2 text-muted-foreground font-body pl-0 md:pl-16">
              <p className="text-2xl font-display text-foreground">
                IDR 1,300,000 <span className="text-base text-muted-foreground">/ night</span>
              </p>
              <p className="text-sm">Breakfast not included</p>
            </div>
          </motion.div>

          {/* Check-in/out */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-2xl text-foreground">Check-in / Check-out</h3>
            </div>
            <div className="space-y-2 text-muted-foreground font-body pl-0 md:pl-16">
              <p>Check-in: <span className="text-foreground">2:00 PM</span></p>
              <p>Check-out: <span className="text-foreground">12:00 PM</span></p>
            </div>
          </motion.div>
        </div>

        {/* Policies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-2xl text-foreground">Policies</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-center md:text-left">
            <div className="space-y-3 text-muted-foreground font-body">
              <p className="flex items-center justify-center md:justify-start">
                <Calendar className="w-4 h-4 mr-2 text-primary/60" />
                Minimum stay: 1 night
              </p>
              <p>Free cancellation up to 3 days before check-in</p>
            </div>
            <div className="space-y-3 text-muted-foreground font-body">
              <p>Cancellations within 3 days: 1 night charged</p>
              <p>Pets not allowed</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Details;
