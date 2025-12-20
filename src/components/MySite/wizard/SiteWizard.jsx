import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
  Palette,
  Home,
  MessageCircle,
  Rocket,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { getThemesArray } from '../themes';
import {
  createSite,
  updateSite,
  saveWizardProgress,
  getWizardProgress,
  getDefaultSiteTemplate
} from '@/services/mySiteService';

// Mock properties data
const mockProperties = [
  {
    id: 1,
    name: "Villa Sunset Paradise",
    location: "Seminyak, Bali",
    type: "Villa",
    beds: 4,
    baths: 3,
    maxGuests: 8,
    basePrice: 280,
    image: "/images/properties/villa1.jpg"
  },
  {
    id: 2,
    name: "Beach House Deluxe",
    location: "Canggu, Bali",
    type: "House",
    beds: 5,
    baths: 4,
    maxGuests: 10,
    basePrice: 320,
    image: "/images/properties/villa2.jpg"
  },
  {
    id: 3,
    name: "Modern Studio Apartment",
    location: "Ubud, Bali",
    type: "Apartment",
    beds: 1,
    baths: 1,
    maxGuests: 2,
    basePrice: 80,
    image: "/images/properties/villa3.jpg"
  }
];

const SiteWizard = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const savedProgress = getWizardProgress();
    return savedProgress?.data || getDefaultSiteTemplate();
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Use ref to prevent re-rendering during typing
  const saveTimeoutRef = React.useRef(null);

  // Update function that doesn't trigger immediate saves
  const updateFormData = React.useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Clear previous save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Schedule save for later
      saveTimeoutRef.current = setTimeout(() => {
        saveWizardProgress(currentStep, newData);
      }, 1000);

      return newData;
    });
  }, [currentStep]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Create the site
    const site = createSite('demo-user', formData);
    onComplete(site);
  };

  // Step 1: Welcome
  const StepWelcome = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Globe className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Create Your Direct Booking Website
      </h2>

      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Build a professional website for your properties in just 5 minutes.
        No technical knowledge required!
      </p>

      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8 text-left">
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Zero Commissions</h3>
            <p className="text-sm text-gray-600">
              Keep 100% of your revenue. No hidden fees.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Auto-Sync</h3>
            <p className="text-sm text-gray-600">
              Automatically synced with your properties.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Beautiful Themes</h3>
            <p className="text-sm text-gray-600">
              Choose from 5 professionally designed themes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Direct Contact</h3>
            <p className="text-sm text-gray-600">
              WhatsApp or booking form - you choose.
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={nextStep}
        size="lg"
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8"
      >
        Let's Get Started
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  // Step 2: Name & Design
  const StepDesign = () => {
    const themes = getThemesArray();

    return (
      <div className="py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Name & Design</h2>
            <p className="text-sm text-gray-600">Choose your website name and theme</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Website Name */}
          <div>
            <Label htmlFor="siteName">Website Name *</Label>
            <Input
              id="siteName"
              placeholder="e.g., Bali Paradise Villas"
              defaultValue={formData.name || ''}
              onBlur={(e) => updateFormData('name', e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will appear in your website header
            </p>
          </div>

          {/* Language */}
          <div>
            <Label>Primary Language *</Label>
            <RadioGroup
              value={formData.language}
              onValueChange={(value) => updateFormData('language', value)}
              className="grid grid-cols-2 gap-3 mt-2"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en" className="cursor-pointer flex-1">English</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="es" id="lang-es" />
                <Label htmlFor="lang-es" className="cursor-pointer flex-1">Español</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Theme Selection */}
          <div>
            <Label>Choose Your Theme *</Label>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => updateFormData('theme', theme.id)}
                  className={`
                    border-2 rounded-lg p-4 cursor-pointer transition-all
                    ${formData.theme === theme.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {/* Theme Preview Colors */}
                  <div className="flex gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{theme.name}</h3>
                  <p className="text-xs text-gray-600">{theme.description}</p>

                  {formData.theme === theme.id && (
                    <div className="flex items-center gap-1 text-orange-600 text-sm mt-2">
                      <Check className="w-4 h-4" />
                      <span className="font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Properties Selection
  const StepProperties = () => {
    const toggleProperty = (propertyId) => {
      const currentProperties = formData.properties || [];
      const propertyExists = currentProperties.some(p => p.id === propertyId);

      if (propertyExists) {
        updateFormData('properties', currentProperties.filter(p => p.id !== propertyId));
      } else {
        const property = mockProperties.find(p => p.id === propertyId);
        updateFormData('properties', [...currentProperties, property]);
      }
    };

    const isSelected = (propertyId) => {
      return formData.properties?.some(p => p.id === propertyId) || false;
    };

    return (
      <div className="py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Properties</h2>
            <p className="text-sm text-gray-600">Choose which properties to display on your website</p>
          </div>
        </div>

        <div className="space-y-3">
          {mockProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => toggleProperty(property.id)}
              className={`
                border-2 rounded-lg p-4 cursor-pointer transition-all flex items-start gap-4
                ${isSelected(property.id)
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <Checkbox
                checked={isSelected(property.id)}
                className="mt-1"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{property.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  <span>{property.beds} beds</span>
                  <span>•</span>
                  <span>{property.baths} baths</span>
                  <span>•</span>
                  <span>Up to {property.maxGuests} guests</span>
                  <span>•</span>
                  <span className="font-semibold text-orange-600">${property.basePrice}/night</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Selected: {formData.properties?.length || 0} properties
        </p>
      </div>
    );
  };

  // Step 4: Booking Mode
  const StepBooking = () => {
    return (
      <div className="py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Booking Method</h2>
            <p className="text-sm text-gray-600">How do you want to receive bookings?</p>
          </div>
        </div>

        <RadioGroup
          value={formData.booking_mode}
          onValueChange={(value) => updateFormData('booking_mode', value)}
          className="space-y-4"
        >
          {/* WhatsApp Mode */}
          <div
            className={`
              border-2 rounded-lg p-5 cursor-pointer transition-all
              ${formData.booking_mode === 'whatsapp'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value="whatsapp" id="mode-whatsapp" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="mode-whatsapp" className="text-base font-semibold cursor-pointer">
                  WhatsApp Booking
                </Label>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Guests click a button and message you directly on WhatsApp. Simple and personal.
                </p>

                {formData.booking_mode === 'whatsapp' && (
                  <div className="space-y-3 mt-4">
                    <div>
                      <Label htmlFor="whatsapp_number">WhatsApp Number (with country code)</Label>
                      <Input
                        id="whatsapp_number"
                        placeholder="+62 812 3456 7890"
                        defaultValue={formData.whatsapp_number || ''}
                        onBlur={(e) => updateFormData('whatsapp_number', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp_message">Pre-filled Message Template</Label>
                      <Textarea
                        id="whatsapp_message"
                        rows={3}
                        defaultValue={formData.whatsapp_message_template || ''}
                        onBlur={(e) => updateFormData('whatsapp_message_template', e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use {'{{property}}'}, {'{{date}}'}, {'{{guests}}'} as placeholders
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Direct Booking Mode */}
          <div
            className={`
              border-2 rounded-lg p-5 cursor-pointer transition-all
              ${formData.booking_mode === 'direct'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value="direct" id="mode-direct" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="mode-direct" className="text-base font-semibold cursor-pointer">
                  Direct Booking Form
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Guests fill out a contact form. You receive booking requests by email. (Coming soon)
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
    );
  };

  // Step 5: Content & Publish
  const StepPublish = () => {
    return (
      <div className="py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Final Touches</h2>
            <p className="text-sm text-gray-600">Add your content and publish your site</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* About Section */}
          <div>
            <Label htmlFor="about_title">About Section Title</Label>
            <Input
              id="about_title"
              placeholder="e.g., Welcome to Our Properties"
              defaultValue={formData.about_title || ''}
              onBlur={(e) => updateFormData('about_title', e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="about_text">About Section Text</Label>
            <Textarea
              id="about_text"
              rows={4}
              placeholder="Describe your properties, location, and what makes them special..."
              defaultValue={formData.about_text || ''}
              onBlur={(e) => updateFormData('about_text', e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Contact Information */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="contact@example.com"
                defaultValue={formData.contact_email || ''}
                onBlur={(e) => updateFormData('contact_email', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder="+62 812 3456 7890"
                defaultValue={formData.contact_phone || ''}
                onBlur={(e) => updateFormData('contact_phone', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          {/* Footer Text */}
          <div>
            <Label htmlFor="footer_text">Footer Text</Label>
            <Input
              id="footer_text"
              placeholder="© 2025 All rights reserved"
              defaultValue={formData.footer_text || ''}
              onBlur={(e) => updateFormData('footer_text', e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
            <h3 className="font-semibold text-gray-900 mb-3">Ready to Publish!</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Website name: <strong>{formData.name || 'Not set'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Theme: <strong>{formData.theme}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Properties: <strong>{formData.properties?.length || 0}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Booking mode: <strong>{formData.booking_mode}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepWelcome />;
      case 2:
        return <StepDesign />;
      case 3:
        return <StepProperties />;
      case 4:
        return <StepBooking />;
      case 5:
        return <StepPublish />;
      default:
        return <StepWelcome />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 2:
        return formData.name && formData.theme && formData.language;
      case 3:
        return formData.properties && formData.properties.length > 0;
      case 4:
        if (formData.booking_mode === 'whatsapp') {
          return formData.whatsapp_number;
        }
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="flex-1 h-screen flex flex-col bg-white relative z-[60]">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 relative z-[60]">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Website</h1>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/90">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-white/80">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 mt-2 bg-white/20" />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-6">
          {renderStep()}
        </div>
      </div>

      {/* Navigation Buttons - Footer */}
      <div className="border-t bg-white px-6 py-4 relative z-[60]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <Button
              onClick={prevStep}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="ghost"
            >
              Cancel
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-orange-500 hover:bg-orange-600 gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 gap-2"
              >
                <Rocket className="w-4 h-4" />
                Create Website
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteWizard;
