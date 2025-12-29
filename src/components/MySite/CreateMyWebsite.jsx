import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../layout/PageShell';
import mySiteService from '../../services/mySiteService';
import { supabaseService } from '../../services/supabase';
import {
  Globe,
  Palette,
  Eye,
  Sparkles,
  Check,
  X,
  Upload,
  Link as LinkIcon,
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Wifi,
  Coffee,
  Utensils,
  Dumbbell,
  Home,
  ChevronRight,
  ExternalLink,
  Copy,
  Wand2,
  Save,
  Zap
} from 'lucide-react';

/**
 * Create My Website - Modern Website Builder
 * Premium themes, AI-powered content, instant preview
 */
const CreateMyWebsite = ({ onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Content, 2: Contact Info, 3: Preview & Publish
  const [websiteData, setWebsiteData] = useState({
    propertyName: '',
    tagline: '',
    description: '',
    location: '',
    amenities: [],
    gallery: [],
    pricing: { from: '', currency: 'USD' },
    contact: {
      email: '',
      phone: '',           // Teléfono humano
      whatsapp: ''         // WhatsApp chatbot
    },
    social: { instagram: '', facebook: '' },
    slug: ''
  });
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [isPublishing, setIsPublishing] = useState(false);

  // Modern Premium Themes
  const themes = [
    {
      id: 'minimal-luxury',
      name: 'Minimal Luxury',
      description: 'Clean, sophisticated design with large images and elegant typography',
      preview: '/villa1.jpg',
      colors: {
        primary: '#1a1a1a',
        secondary: '#c9a55a',
        accent: '#f5f5f5',
        text: '#2c2c2c',
        textLight: '#6b6b6b'
      },
      fonts: {
        heading: 'Playfair Display, serif',
        body: 'Inter, sans-serif'
      },
      style: 'minimal',
      features: ['Full-screen hero', 'Parallax scrolling', 'Smooth animations', 'Mobile-first']
    },
    {
      id: 'tropical-paradise',
      name: 'Tropical Paradise',
      description: 'Vibrant, colorful design perfect for beach villas and resort properties',
      preview: '/villa2.jpg',
      colors: {
        primary: '#0fa',
        secondary: '#ff6b35',
        accent: '#fff8e7',
        text: '#1a3a3a',
        textLight: '#4a7a7a'
      },
      fonts: {
        heading: 'Poppins, sans-serif',
        body: 'Nunito, sans-serif'
      },
      style: 'vibrant',
      features: ['Bold colors', 'Dynamic layouts', 'Instagram feed', 'Video backgrounds']
    },
    {
      id: 'modern-glass',
      name: 'Modern Glass',
      description: 'Contemporary glassmorphism design with blur effects and gradient overlays',
      preview: '/villa3.jpg',
      colors: {
        primary: 'rgba(255, 255, 255, 0.1)',
        secondary: '#6366f1',
        accent: 'rgba(99, 102, 241, 0.1)',
        text: '#f8fafc',
        textLight: '#cbd5e1'
      },
      fonts: {
        heading: 'Space Grotesk, sans-serif',
        body: 'DM Sans, sans-serif'
      },
      style: 'glass',
      features: ['Glassmorphism', 'Gradient mesh', 'Dark mode', '3D transforms']
    },
    {
      id: 'boutique-elegant',
      name: 'Boutique Elegant',
      description: 'Refined, luxurious design for high-end boutique properties',
      preview: '/villa4.jpg',
      colors: {
        primary: '#2d2d2d',
        secondary: '#d4af37',
        accent: '#fafaf5',
        text: '#1a1a1a',
        textLight: '#7a7a7a'
      },
      fonts: {
        heading: 'Cormorant Garamond, serif',
        body: 'Lato, sans-serif'
      },
      style: 'elegant',
      features: ['Serif typography', 'Gold accents', 'Refined spacing', 'Premium feel']
    },
    {
      id: 'eco-nature',
      name: 'Eco Nature',
      description: 'Organic, earthy design for eco-lodges and sustainable properties',
      preview: '/villa5.jpg',
      colors: {
        primary: '#2f5233',
        secondary: '#8b6f47',
        accent: '#f4efe7',
        text: '#2c3e2f',
        textLight: '#5a7a5f'
      },
      fonts: {
        heading: 'Merriweather, serif',
        body: 'Source Sans Pro, sans-serif'
      },
      style: 'organic',
      features: ['Earth tones', 'Natural textures', 'Eco badges', 'Sustainability focus']
    },
    {
      id: 'urban-chic',
      name: 'Urban Chic',
      description: 'Modern, edgy design for city apartments and urban properties',
      preview: '/villa6.jpg',
      colors: {
        primary: '#111827',
        secondary: '#ef4444',
        accent: '#f3f4f6',
        text: '#1f2937',
        textLight: '#6b7280'
      },
      fonts: {
        heading: 'Montserrat, sans-serif',
        body: 'Open Sans, sans-serif'
      },
      style: 'urban',
      features: ['Bold typography', 'Split layouts', 'Metro vibes', 'High contrast']
    }
  ];

  const amenitiesOptions = [
    { icon: Wifi, label: 'Free WiFi', id: 'wifi' },
    { icon: Coffee, label: 'Kitchen', id: 'kitchen' },
    { icon: Utensils, label: 'Breakfast', id: 'breakfast' },
    { icon: Dumbbell, label: 'Gym', id: 'gym' },
    { icon: Home, label: 'Pool', id: 'pool' },
    { icon: MapPin, label: 'Parking', id: 'parking' }
  ];

  const kpis = [
    { label: 'Step', value: `${step}/3`, icon: Sparkles, color: 'purple' },
    { label: 'Content Added', value: websiteData.propertyName ? 'Yes' : 'No', icon: Palette, color: 'blue' },
    { label: 'Ready to Publish', value: step >= 3 ? 'Yes' : 'No', icon: Zap, color: 'orange' },
    { label: 'Estimated Time', value: '3min', icon: Globe, color: 'green' }
  ];

  const handlePropertyNameChange = (value) => {
    setWebsiteData(prev => ({
      ...prev,
      propertyName: value,
      slug: mySiteService.generateSlug(value)
    }));
  };

  const handlePublishWebsite = async () => {
    try {
      setIsPublishing(true);

      // Map CreateMyWebsite theme IDs to mySiteService theme IDs
      const themeMapping = {
        'minimal-luxury': 'bali-minimal',
        'tropical-paradise': 'tropical-luxury',
        'modern-glass': 'ocean-breeze',
        'boutique-elegant': 'sunset-warmth',
        'eco-nature': 'jungle-modern',
        'urban-chic': 'bali-minimal' // fallback
      };

      // Fetch user's properties from Supabase
      let properties = [];
      try {
        const propertiesData = await supabaseService.getProperties();
        // Transform properties to match expected structure
        properties = propertiesData.map(prop => ({
          id: prop.id,
          name: prop.name,
          location: prop.location || 'Bali, Indonesia',
          beds: prop.beds || 2,
          baths: prop.baths || 2,
          maxGuests: prop.max_guests || 4,
          basePrice: prop.base_price || 100,
          description: prop.description || 'Beautiful property in paradise'
        }));
      } catch (error) {
        console.warn('Could not fetch properties from Supabase:', error);
        // Continue with empty properties array
      }

      // Prepare site data compatible with mySiteService structure
      const siteData = {
        name: websiteData.propertyName,
        slug: websiteData.slug,
        theme: 'bali-minimal', // Fixed theme - no selection
        about_title: websiteData.tagline || `Welcome to ${websiteData.propertyName}`,
        about_text: websiteData.description || 'Discover our beautiful properties in paradise',
        contact_email: websiteData.contact.email,
        contact_phone: websiteData.contact.phone,
        whatsapp_number: websiteData.contact.whatsapp,
        booking_mode: websiteData.contact.whatsapp ? 'whatsapp' : 'direct',
        whatsapp_message_template: `Hello, I'd like to book a property from ${websiteData.propertyName}. Can you help me?`,
        properties: properties,
        footer_text: `© ${new Date().getFullYear()} ${websiteData.propertyName}. All rights reserved.`,
        language: 'en'
      };

      // Create the site
      const createdSite = mySiteService.createSite('demo-user', siteData);

      // Publish it immediately
      const publishedSite = mySiteService.publishSite('demo-user');

      // Show success message with URL
      const websiteURL = `${window.location.origin}/site/${publishedSite.slug}`;

      // Create success modal
      const successModal = confirm(
        `🎉 Website Published Successfully!\n\n` +
        `Your website is now live at:\n${websiteURL}\n\n` +
        `Properties included: ${properties.length}\n\n` +
        `Click OK to visit your website now, or Cancel to stay here.`
      );

      if (successModal) {
        // Navigate to the public website
        navigate(`/site/${publishedSite.slug}`);
      }

    } catch (error) {
      console.error('Error publishing website:', error);
      alert('❌ Error publishing website. Please try again.\n\nError: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const generateAIContent = () => {
    const name = websiteData.propertyName || 'Our Property';
    const loc = websiteData.location || 'paradise';

    // Simulate AI content generation
    const descriptions = [
      `Escape to paradise at ${name}. Nestled in ${loc}, our property offers the perfect blend of luxury and comfort. Experience breathtaking views, world-class amenities, and unforgettable memories.`,
      `Welcome to ${name}, where luxury meets tranquility. Located in the heart of ${loc}, we offer an exclusive retreat designed for those who appreciate the finer things in life. From stunning architecture to impeccable service, every detail has been crafted to perfection.`,
      `Discover your dream getaway at ${name}. Surrounded by natural beauty in ${loc}, our property provides the ultimate escape from everyday life. Indulge in luxury accommodations, premium amenities, and personalized service that exceeds expectations.`
    ];

    const taglines = [
      'Your Paradise Awaits',
      'Luxury Redefined',
      'Where Memories Are Made',
      'Experience the Extraordinary',
      'Your Home Away From Home'
    ];

    setWebsiteData(prev => ({
      ...prev,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      tagline: taglines[Math.floor(Math.random() * taglines.length)]
    }));
  };

  const copyWebsiteURL = () => {
    const url = `${window.location.origin}/site/${websiteData.slug}`;
    navigator.clipboard.writeText(url);
    alert('✓ Website URL copied to clipboard!\n\n' + url);
  };

  const renderStep1_Content = () => (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Add Your Content</h2>
          <p className="text-white/60">Tell guests about your amazing property</p>
        </div>
        <button
          onClick={generateAIContent}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          AI Generate
        </button>
      </div>

      <div className="space-y-4">
        {/* Property Name */}
        <div>
          <label className="text-sm font-medium text-white block mb-2">Property Name *</label>
          <input
            type="text"
            value={websiteData.propertyName}
            onChange={(e) => handlePropertyNameChange(e.target.value)}
            placeholder="e.g., Villa Sunset Paradise"
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
          />
          <p className="text-xs text-white/40 mt-1">Your website URL: myhost.com/site/{websiteData.slug || 'your-property'}</p>
        </div>

        {/* Tagline */}
        <div>
          <label className="text-sm font-medium text-white block mb-2">Tagline</label>
          <input
            type="text"
            value={websiteData.tagline}
            onChange={(e) => setWebsiteData(prev => ({ ...prev, tagline: e.target.value }))}
            placeholder="e.g., Your Paradise Awaits"
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-white block mb-2">Location *</label>
          <input
            type="text"
            value={websiteData.location}
            onChange={(e) => setWebsiteData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Bali, Indonesia"
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-white block mb-2">Description *</label>
          <textarea
            value={websiteData.description}
            onChange={(e) => setWebsiteData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your property, its unique features, and what makes it special..."
            rows={5}
            className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50 resize-none"
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white block mb-2">Price From</label>
            <input
              type="number"
              value={websiteData.pricing.from}
              onChange={(e) => setWebsiteData(prev => ({ ...prev, pricing: { ...prev.pricing, from: e.target.value } }))}
              placeholder="150"
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white block mb-2">Currency</label>
            <select
              value={websiteData.pricing.currency}
              onChange={(e) => setWebsiteData(prev => ({ ...prev, pricing: { ...prev.pricing, currency: e.target.value } }))}
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="IDR">IDR</option>
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-medium text-white block mb-3">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenitiesOptions.map(amenity => {
              const Icon = amenity.icon;
              const isSelected = websiteData.amenities.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  onClick={() => {
                    setWebsiteData(prev => ({
                      ...prev,
                      amenities: isSelected
                        ? prev.amenities.filter(a => a !== amenity.id)
                        : [...prev.amenities, amenity.id]
                    }));
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-[#d85a2a]/20 border-[#d85a2a] text-white'
                      : 'bg-[#1a1f2e] border-white/10 text-white/60 hover:border-[#d85a2a]/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{amenity.label}</span>
                  {isSelected && <Check className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact Info */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white block mb-2">Email</label>
              <input
                type="email"
                value={websiteData.contact.email}
                onChange={(e) => setWebsiteData(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                placeholder="contact@yourproperty.com"
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">Phone Number</label>
              <input
                type="tel"
                value={websiteData.contact.phone}
                onChange={(e) => setWebsiteData(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))}
                placeholder="+1 xxx xxx xxxx"
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">WhatsApp (Chatbot)</label>
              <input
                type="tel"
                value={websiteData.contact.whatsapp}
                onChange={(e) => setWebsiteData(prev => ({ ...prev, contact: { ...prev.contact, whatsapp: e.target.value } }))}
                placeholder="+62 xxx xxxx xxxx"
                className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d85a2a]/50"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={() => setStep(1)}
            className="flex-1 px-6 py-3 bg-[#1a1f2e] border border-white/10 text-white rounded-lg font-medium hover:bg-[#2a2f3a] transition-colors"
          >
            Back to Themes
          </button>
          <button
            onClick={() => {
              console.log('Button clicked! Data:', websiteData);
              setStep(3);
            }}
            disabled={!websiteData.propertyName || !websiteData.location || !websiteData.description}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d85a2a] to-[#f5a524] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Preview
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3_Preview = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Preview & Publish</h2>
          <p className="text-white/60">See how your website looks before publishing</p>
        </div>
        <div className="flex gap-2">
          {['desktop', 'tablet', 'mobile'].map(mode => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                previewMode === mode
                  ? 'bg-[#d85a2a] text-white'
                  : 'bg-[#1a1f2e] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Frame */}
      <div className="bg-[#1a1f2e] rounded-2xl border border-white/10 p-8">
        <div className={`mx-auto transition-all ${
          previewMode === 'desktop' ? 'max-w-full' :
          previewMode === 'tablet' ? 'max-w-2xl' :
          'max-w-sm'
        }`}>
          {/* Website Preview */}
          <div
            className="bg-white rounded-xl overflow-hidden shadow-2xl"
            style={{
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {/* Hero Section */}
            <div
              className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white"
              style={{ backgroundColor: '#10B981' }}
            >
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 text-center px-6">
                <h1
                  className="text-5xl font-bold mb-4"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#34D399' }}
                >
                  {websiteData.propertyName}
                </h1>
                <p
                  className="text-2xl mb-2"
                  style={{ color: '#34D399' }}
                >
                  {websiteData.tagline}
                </p>
                <p
                  className="flex items-center justify-center gap-2 text-lg"
                  style={{ color: '#6B7280' }}
                >
                  <MapPin className="w-4 h-4" />
                  {websiteData.location}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-12">
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: '#1F2937' }}
              >
                {websiteData.description}
              </p>

              {/* Amenities */}
              {websiteData.amenities.length > 0 && (
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold mb-4"
                    style={{ fontFamily: 'Playfair Display, serif', color: '#10B981' }}
                  >
                    Amenities
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {websiteData.amenities.map(amenityId => {
                      const amenity = amenitiesOptions.find(a => a.id === amenityId);
                      const Icon = amenity?.icon;
                      return (
                        <div key={amenityId} className="flex items-center gap-2" style={{ color: '#1F2937' }}>
                          {Icon && <Icon className="w-5 h-5" style={{ color: '#F59E0B' }} />}
                          <span>{amenity?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pricing */}
              {websiteData.pricing.from && (
                <div
                  className="p-6 rounded-xl mb-8"
                  style={{ backgroundColor: '#34D399' }}
                >
                  <p className="text-sm" style={{ color: '#6B7280' }}>Starting from</p>
                  <p
                    className="text-4xl font-bold"
                    style={{ fontFamily: 'Playfair Display, serif', color: '#F59E0B' }}
                  >
                    {websiteData.pricing.currency} ${websiteData.pricing.from} <span className="text-lg font-normal">/ night</span>
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <button
                className="w-full py-4 rounded-xl text-white font-bold text-lg"
                style={{ backgroundColor: '#F59E0B' }}
              >
                Book Now via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 px-6 py-3 bg-[#1a1f2e] border border-white/10 text-white rounded-lg font-medium hover:bg-[#2a2f3a] transition-colors"
        >
          Back to Edit
        </button>
        <button
          onClick={copyWebsiteURL}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy URL
        </button>
        <button
          onClick={handlePublishWebsite}
          disabled={isPublishing}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5" />
          {isPublishing ? 'Publishing...' : 'Publish Website'}
        </button>
      </div>
    </div>
  );

  return (
    <PageShell
      title="Create My Website"
      subtitle="Build a stunning website in minutes with AI"
      aiHelperText="Our AI-powered website builder creates professional, mobile-responsive websites optimized for direct bookings. Choose from premium themes, generate content with AI, and publish instantly with zero coding required."
      kpis={kpis}
      onBack={onBack}
    >
      {step === 1 && renderStep1_Content()}
      {step === 2 && renderStep2_ContactInfo()}
      {step === 3 && renderStep3_Preview()}
    </PageShell>
  );
};

export default CreateMyWebsite;
