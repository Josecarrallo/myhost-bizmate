import React, { useState, useEffect } from 'react';
import { Globe, Plus, Eye, Edit, Trash2, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { hasWebsite, getUserSites, deleteSite, publishSite, unpublishSite } from '@/services/mySiteService';
import SiteWizard from './wizard/SiteWizard';

const MySite = ({ onBack }) => {
  const [siteData, setSiteData] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load site data on mount
  useEffect(() => {
    loadSiteData();
  }, []);

  const loadSiteData = () => {
    setLoading(true);
    setTimeout(() => {
      const site = getUserSites('demo-user');
      setSiteData(site);
      setLoading(false);
    }, 500);
  };

  const handleCreateWebsite = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    loadSiteData(); // Reload data
  };

  const handlePublish = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      const updated = publishSite('demo-user');
      setSiteData(updated);
      alert('✅ Website published successfully!\n\nYour site is now live.');
    } catch (error) {
      console.error('Error publishing site:', error);
      alert('❌ Error publishing site. Please try again.');
    }
  };

  const handleUnpublish = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      const updated = unpublishSite('demo-user');
      setSiteData(updated);
      alert('Website unpublished.\n\nYour site is now in draft mode.');
    } catch (error) {
      console.error('Error unpublishing site:', error);
      alert('❌ Error unpublishing site. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your website? This action cannot be undone.')) {
      try {
        deleteSite('demo-user');
        setSiteData(null);
      } catch (error) {
        console.error('Error deleting site:', error);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSitePreview = (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (siteData.status !== 'published') {
      alert('⚠️ Please publish your website first before previewing it.');
      return;
    }

    // Open site in new tab
    const siteUrl = `/site/${siteData.slug}`;
    window.open(siteUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show wizard as full screen (not dialog)
  if (showWizard) {
    return (
      <div className="flex-1 h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
        <SiteWizard
          onComplete={handleWizardComplete}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

  // NO WEBSITE STATE - Show CTA
  if (!siteData) {
    return (
      <div className="flex-1 h-screen bg-[#2a2f3a] p-4 sm:p-6 overflow-auto">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white font-medium mb-3 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-2xl">
            My Site
          </h1>
          <p className="text-white/90 text-sm sm:text-base mt-1">
            Create your direct booking website
          </p>
        </div>

        {/* CTA Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-2xl border-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Create Your Website in 5 Minutes
              </h2>

              <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                Build a professional direct booking website for your properties.
                No coding required, no commissions, 100% control.
              </p>

              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">No Commissions</h3>
                    <p className="text-sm text-gray-600">
                      Keep 100% of your booking revenue
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Direct Contact</h3>
                    <p className="text-sm text-gray-600">
                      Connect directly with your guests
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Auto-Sync</h3>
                    <p className="text-sm text-gray-600">
                      Connected to your properties
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleCreateWebsite}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Creating
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                Takes only 5 minutes • No credit card required
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // HAS WEBSITE STATE - Show management panel
  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-4 sm:p-6 lg:p-8 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/90 hover:text-white font-medium mb-4 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl">
              My Site
            </h1>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg mt-2">
              Manage your direct booking website
            </p>
          </div>
        </div>
      </div>

      {/* Site Management Card */}
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white shadow-2xl border-0 mb-6">
          <CardHeader className="border-b pb-6">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{siteData.name}</CardTitle>
                <CardDescription className="mt-2">
                  {siteData.theme} theme • {siteData.properties?.length || 0} properties
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    siteData.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {siteData.status === 'published' ? '● Published' : '● Draft'}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* URL Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm font-mono">
                  {siteData.url}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(siteData.url);
                  }}
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {siteData.status === 'published' ? (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Your website is live! Click "View Site" to preview.
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Publish your website to make it accessible via this URL.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowWizard(true);
                }}
                variant="default"
                className="bg-gradient-to-r from-[#d85a2a] to-[#f5a524] hover:opacity-90"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Site
              </Button>

              <Button
                onClick={openSitePreview}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>

              {siteData.status === 'draft' ? (
                <Button
                  onClick={handlePublish}
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Publish Now
                </Button>
              ) : (
                <Button
                  onClick={handleUnpublish}
                  variant="outline"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                >
                  Unpublish
                </Button>
              )}

              <Button
                onClick={handleDelete}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 ml-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF8C42] mb-1">
                  {siteData.properties?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Properties Displayed</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {siteData.status === 'published' ? 'Live' : 'Draft'}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {siteData.theme}
                </div>
                <div className="text-sm text-gray-600">Active Theme</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MySite;
