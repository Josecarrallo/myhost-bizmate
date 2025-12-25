import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSiteBySlug } from '@/services/mySiteService';
import { getTheme } from '@/components/MySite/themes';
import { Phone, Mail, MessageCircle, MapPin, Users, Bed, Bath, DollarSign, Check, Star, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PublicSite = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const loadSite = () => {
      setLoading(true);
      const siteData = getSiteBySlug(slug);

      if (!siteData) {
        setLoading(false);
        return;
      }

      setSite(siteData);

      // Load theme
      const themeData = getTheme(siteData.theme);
      setTheme(themeData);

      setLoading(false);
    };

    loadSite();
  }, [slug]);

  const handleBooking = (property) => {
    if (site.booking_mode === 'whatsapp' && site.whatsapp_number) {
      const message = site.whatsapp_message_template
        .replace('{{property}}', property.name)
        .replace('{{date}}', 'your dates')
        .replace('{{guests}}', 'your group size');

      const whatsappUrl = `https://wa.me/${site.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('Booking form coming soon! For now, please contact us directly.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:opacity-90"
          >
            Go to Homepage
          </Button>
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
          <Button
            onClick={() => navigate('/')}
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const themeColors = theme?.colors || {
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#fdba74'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: themeColors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {site.name}
            </h1>
            <div className="flex gap-3">
              {site.contact_phone && (
                <a
                  href={`tel:${site.contact_phone}`}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#d85a2a]/10 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Call</span>
                </a>
              )}
              {site.booking_mode === 'whatsapp' && site.whatsapp_number && (
                <a
                  href={`https://wa.me/${site.whatsapp_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative py-20 sm:py-32 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${themeColors.primary}E6, ${themeColors.secondary}E6)`
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              {site.about_title || 'Welcome to Our Properties'}
            </h2>
            <p className="text-xl sm:text-2xl text-white/95 max-w-3xl mx-auto mb-8 leading-relaxed">
              {site.about_text || 'Discover our beautiful properties in paradise'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => {
                  const propertiesSection = document.getElementById('properties-section');
                  propertiesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-6 text-lg font-semibold shadow-xl"
              >
                Explore Properties
              </Button>
              {site.booking_mode === 'whatsapp' && site.whatsapp_number && (
                <Button
                  onClick={() => window.open(`https://wa.me/${site.whatsapp_number.replace(/[^0-9]/g, '')}`, '_blank')}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg font-semibold shadow-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">
                  {site.properties?.length || 0}
                </div>
                <div className="text-sm text-white/80">Properties</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">5★</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-white/80">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section id="properties-section" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully selected collection of premium accommodations
            </p>
          </div>

          {!site.properties || site.properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties available at the moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {site.properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Property Image Placeholder */}
                  <div
                    className="h-64 flex items-center justify-center text-white font-bold text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${themeColors.secondary}, ${themeColors.accent})`
                    }}
                  >
                    {property.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {property.name}
                    </h3>
                    <p className="text-gray-600 text-base mb-4 flex items-center gap-1">
                      <MapPin className="w-5 h-5" />
                      {property.location}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-6 text-base text-gray-700">
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                        <Bed className="w-5 h-5 mb-1" />
                        <span className="font-semibold">{property.beds}</span>
                        <span className="text-xs text-gray-500">Beds</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                        <Bath className="w-5 h-5 mb-1" />
                        <span className="font-semibold">{property.baths}</span>
                        <span className="text-xs text-gray-500">Baths</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 mb-1" />
                        <span className="font-semibold">{property.maxGuests}</span>
                        <span className="text-xs text-gray-500">Guests</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold" style={{ color: themeColors.primary }}>
                        ${property.basePrice}
                        <span className="text-base text-gray-600 font-normal">/night</span>
                      </div>
                      <Button
                        onClick={() => handleBooking(property)}
                        style={{ backgroundColor: themeColors.primary }}
                        className="hover:opacity-90 text-base px-6 py-3"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of comfort, service, and unforgettable moments
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <Check className="w-8 h-8" style={{ color: themeColors.primary }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">
                Book directly and get the best rates, always
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <MessageCircle className="w-8 h-8" style={{ color: themeColors.primary }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is available anytime you need assistance
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <Star className="w-8 h-8" style={{ color: themeColors.primary }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Hand-picked properties with top-rated amenities
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${themeColors.primary}20` }}
              >
                <Home className="w-8 h-8" style={{ color: themeColors.primary }} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Feel at Home</h3>
              <p className="text-gray-600">
                Comfortable spaces designed for your perfect stay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help make your stay unforgettable
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {site.contact_email && (
              <a
                href={`mailto:${site.contact_email}`}
                className="flex items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <Mail className="w-6 h-6" style={{ color: themeColors.primary }} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold text-gray-900">{site.contact_email}</div>
                </div>
              </a>
            )}

            {site.contact_phone && (
              <a
                href={`tel:${site.contact_phone}`}
                className="flex items-center gap-3 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${themeColors.primary}20` }}
                >
                  <Phone className="w-6 h-6" style={{ color: themeColors.primary }} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="font-semibold text-gray-900">{site.contact_phone}</div>
                </div>
              </a>
            )}

            {site.booking_mode === 'whatsapp' && site.whatsapp_number && (
              <a
                href={`https://wa.me/${site.whatsapp_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">WhatsApp</div>
                  <div className="font-semibold text-gray-900">Message Us</div>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 sm:py-16"
        style={{ backgroundColor: themeColors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">{site.name}</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {site.about_text?.slice(0, 120) || 'Your perfect stay awaits'}...
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#properties-section" className="text-white/80 hover:text-white transition-colors">
                    Properties
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                {site.booking_mode === 'whatsapp' && (
                  <li>
                    <a
                      href={`https://wa.me/${site.whatsapp_number?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/80">
                {site.contact_email && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${site.contact_email}`} className="hover:text-white transition-colors">
                      {site.contact_email}
                    </a>
                  </li>
                )}
                {site.contact_phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${site.contact_phone}`} className="hover:text-white transition-colors">
                      {site.contact_phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Book Now</h4>
              <p className="text-white/80 text-sm mb-4">
                Ready to experience paradise?
              </p>
              {site.booking_mode === 'whatsapp' && site.whatsapp_number && (
                <Button
                  onClick={() => window.open(`https://wa.me/${site.whatsapp_number.replace(/[^0-9]/g, '')}`, '_blank')}
                  className="bg-white hover:bg-gray-100 text-gray-900 font-semibold"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/80">
                {site.footer_text || `© ${new Date().getFullYear()} ${site.name}. All rights reserved.`}
              </p>
              <p className="text-xs text-white/60">
                Powered by <span className="font-semibold">MY HOST BizMate</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicSite;
