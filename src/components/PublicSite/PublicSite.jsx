import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSiteBySlug } from '../../services/mySiteService';
import { getTheme } from '../MySite/themes';
import {
  MapPin, ShieldCheck, Star, Headphones, BadgePercent, Home, MessageCircle,
  ArrowRight, Bed, Bath, Users, ChevronRight, Phone
} from 'lucide-react';

// Property Card Component
const PropertyCard = ({ name, location, beds, baths, maxGuests, basePrice, image, themeColors }) => {
  return (
    <div className="group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] rounded-[16px] bg-white border border-gray-200">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white/80 text-sm font-medium tracking-wide uppercase">{location}</p>
          <h3 className="text-white text-2xl font-serif mt-1">{name}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between text-gray-600 text-sm mb-6">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4" style={{ color: themeColors?.primary || '#10B981' }} />
            <span>{beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4" style={{ color: themeColors?.primary || '#10B981' }} />
            <span>{baths} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: themeColors?.primary || '#10B981' }} />
            <span>{maxGuests} Guests</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-gray-900">${basePrice}</span>
          <span className="text-gray-600 text-sm">/ night</span>
        </div>
        <button
          className="w-full text-white rounded-full py-3 font-medium transition-all flex items-center justify-center gap-2"
          style={{
            backgroundColor: themeColors?.primary || '#10B981',
            ':hover': { backgroundColor: themeColors?.secondary || '#059669' }
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = themeColors?.secondary || '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = themeColors?.primary || '#10B981'}
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PublicSite = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [theme, setTheme] = React.useState(null);

  React.useEffect(() => {
    const loadSite = () => {
      setLoading(true);
      const siteData = getSiteBySlug(slug);

      if (!siteData) {
        setLoading(false);
        return;
      }

      setSite(siteData);
      console.log('🎨 Site theme ID:', siteData.theme);
      const themeData = getTheme(siteData.theme);
      console.log('🎨 Theme data loaded:', themeData);
      setTheme(themeData);
      setLoading(false);
    };

    loadSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading website...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Website Not Found</h2>
          <p className="text-gray-300 mb-6">
            The website you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:opacity-90 text-white px-6 py-3 rounded-full font-medium"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (site.status !== 'published') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚧</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Under Construction</h2>
          <p className="text-gray-600 mb-6">
            This website is currently in draft mode and not published yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get theme colors (fallback to emerald green if no theme)
  const themeColors = theme?.colors || {
    primary: '#10B981',
    secondary: '#F59E0B',
    accent: '#34D399',
    text: '#1F2937',
    textLight: '#6B7280'
  };

  const siteName = site.name || 'L\'ELEGANCE';
  const siteTagline = site.about_title || 'Exquisite Living for the Discerning Traveler';
  const location = site.location || 'Bali, Indonesia';
  const description = site.about_text || 'A curated collection of luxury rentals';
  const whatsappNumber = site.whatsapp_number || '';
  const phoneNumber = site.contact_phone || '';
  const properties = site.properties || [];

  // VAPI Configuration (same as VoiceAssistant component)
  const VAPI_PUBLIC_KEY = '3716bc62-40e8-4f3b-bfa2-9e934db6b51d';
  const VAPI_ASSISTANT_ID = 'ae9ea22a-fc9a-49ba-b5b8-900ed69b7615'; // Izumi Hotel Receptionist

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"
            alt="Luxury Villa"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-white/90 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            <MapPin className="w-4 h-4" style={{ color: themeColors.secondary }} />
            {location}
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white leading-tight font-serif">{siteName}</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light tracking-wide">{siteTagline}</p>
          {whatsappNumber && (
            <div className="pt-8">
              <button
                className="text-white rounded-full px-12 py-6 text-lg font-medium shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
                style={{ backgroundColor: themeColors.primary }}
                onMouseEnter={(e) => e.target.style.backgroundColor = themeColors.secondary}
                onMouseLeave={(e) => e.target.style.backgroundColor = themeColors.primary}
                onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, "_blank")}
              >
                <MessageCircle className="w-6 h-6" />
                Book Now
              </button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/5 backdrop-blur-xl border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {[
              { label: "Properties", value: properties.length + "+", icon: Home },
              { label: "Guest Rating", value: "5.0 ★", icon: Star },
              { label: "Support", value: "24/7", icon: Headphones },
              { label: "Verified", value: "100%", icon: ShieldCheck },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center border-r border-white/10 last:border-none"
              >
                <div className="flex items-center gap-2 mb-1" style={{ color: themeColors.secondary }}>
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xl font-bold text-white">{stat.value}</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Best Price Guarantee",
                desc: "Book directly and get the best rates, always.",
                icon: BadgePercent,
              },
              {
                title: "24/7 Support",
                desc: "Our dedicated support team is available anytime you need assistance.",
                icon: Headphones,
              },
              {
                title: "Premium Quality",
                desc: "Hand-picked properties with top-rated amenities and service.",
                icon: ShieldCheck,
              },
              {
                title: "Feel at Home",
                desc: "Comfortable spaces designed for your perfect stay.",
                icon: Home,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-[24px] bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-xl group"
                style={{ ':hover': { borderColor: `${themeColors.primary}33` } }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${themeColors.primary}1A` }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: themeColors.primary }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-24 bg-gray-100/50" id="properties">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif">Signature Collection</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{description}</p>
          </div>

          {!properties || properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {properties.slice(0, 3).map((property, i) => (
                  <PropertyCard key={i} {...property} themeColors={themeColors} />
                ))}
              </div>

              {properties.length > 3 && (
                <div className="mt-16 text-center">
                  <button
                    className="rounded-full px-8 py-4 border-2 transition-all bg-transparent"
                    style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = themeColors.primary;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = themeColors.primary;
                    }}
                  >
                    Explore All Properties
                    <ArrowRight className="inline ml-2 w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#051C14] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-4xl font-serif tracking-tighter">{siteName}</h2>
            <p className="text-white/60 max-w-sm leading-relaxed">
              {site.footer_text || `Curating moments of pure elegance and tranquility across the most beautiful destinations in the world.`}
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Quick Links</h4>
            <nav className="flex flex-col gap-4">
              <a href="#properties" className="text-white/60 hover:text-white transition-colors">
                Properties
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Contact
              </a>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              )}
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Contact Us</h4>
            <div className="space-y-4 text-white/60">
              {site.contact_email && <p className="text-sm">{site.contact_email}</p>}

              {/* Phone Number - Human Contact */}
              {phoneNumber && (
                <button
                  className="w-full border border-white/20 text-white rounded-full py-3 bg-transparent transition-colors flex items-center justify-center gap-2"
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = themeColors.primary;
                    e.target.style.borderColor = themeColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onClick={() => window.open(`tel:${phoneNumber}`, "_self")}
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </button>
              )}

              {/* WhatsApp - Chatbot */}
              {whatsappNumber && (
                <button
                  className="w-full border border-white/20 text-white rounded-full py-3 bg-transparent transition-colors flex items-center justify-center gap-2"
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = themeColors.primary;
                    e.target.style.borderColor = themeColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onClick={() => window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, "_blank")}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Chat
                </button>
              )}

              {/* VAPI Voice Assistant - Always available */}
              <button
                className="w-full border border-white/20 text-white rounded-full py-3 bg-transparent transition-colors flex items-center justify-center gap-2"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = themeColors.primary;
                  e.target.style.borderColor = themeColors.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onClick={() => {
                  // If phone is configured, call it. Otherwise show info about voice assistant
                  if (phoneNumber) {
                    window.open(`tel:${phoneNumber}`, "_self");
                  } else {
                    alert('Voice Assistant\n\nCall us to speak with our AI-powered voice assistant. Available 24/7 to answer your questions and help with bookings.');
                  }
                }}
              >
                <Headphones className="w-4 h-4" />
                Talk to Us
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="font-medium tracking-widest uppercase">Powered by MY HOST BizMate</p>
        </div>
      </footer>
    </main>
  );
};

export default PublicSite;
