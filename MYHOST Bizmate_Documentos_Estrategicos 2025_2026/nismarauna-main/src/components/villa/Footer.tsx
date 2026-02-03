import { motion } from "framer-motion";
import { MapPin, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-wood-dark text-primary-foreground/80 py-16" id="contact">
      <div className="container-villa">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl text-primary-foreground mb-4">
              Nismara Uma Villa
            </h3>
            <p className="font-body text-primary-foreground/60 leading-relaxed max-w-md">
              A private boutique escape in the heart of Bali, designed for those 
              seeking tranquility, comfort, and authentic island living.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-xl text-primary-foreground mb-6">Contact</h4>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-primary-foreground/40 mt-0.5 flex-shrink-0" />
              <p className="font-body text-primary-foreground/70">
                Bali, Indonesia
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-foreground/40" />
              <a 
                href="mailto:hello@nismarauma.com" 
                className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                hello@nismarauma.com
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-primary-foreground/40" />
              <a 
                href="https://wa.me/62123456789" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                WhatsApp: +62 123 456 789
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 text-center">
          <p className="font-body text-sm text-primary-foreground/40">
            © {new Date().getFullYear()} Nismara Uma Villa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
