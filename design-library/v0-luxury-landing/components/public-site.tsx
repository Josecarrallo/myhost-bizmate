"use client"

import { MapPin, ShieldCheck, Star, Headset, BadgePercent, Home, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "./property-card"

interface PublicSiteProps {
  siteName?: string
  siteTagline?: string
  location?: string
  description?: string
  whatsappNumber?: string
  properties?: Array<{
    name: string
    location: string
    beds: number
    baths: number
    guests: number
    price: number
    image: string
  }>
}

export function PublicSite({
  siteName = "L'ELEGANCE",
  siteTagline = "Exquisite Living for the Discerning Traveler",
  location = "French Riviera, France",
  description = "A curated collection of the world's most prestigious luxury rentals, offering unparalleled comfort and bespoke service in breathtaking locations.",
  whatsappNumber = "+1234567890",
  properties = [
    {
      name: "Villa Azure",
      location: "Saint-Tropez",
      beds: 6,
      baths: 7,
      guests: 12,
      price: 2450,
      image: "/luxury-villa-saint-tropez-pool.jpg",
    },
    {
      name: "Chateau de Lumiere",
      location: "Cannes Hills",
      beds: 8,
      baths: 9,
      guests: 16,
      price: 3800,
      image: "/luxury-chateau-cannes.jpg",
    },
    {
      name: "The Glass House",
      location: "Antibes Coast",
      beds: 4,
      baths: 4,
      guests: 8,
      price: 1900,
      image: "/modern-luxury-villa-antibes.jpg",
    },
  ],
}: PublicSiteProps) {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="/luxury-villa-exterior-sunset.jpg"
            alt="Luxury Villa"
            className="h-full w-full object-cover scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-center gap-2 text-white/90 font-medium tracking-[0.2em] uppercase text-sm mb-4">
            <MapPin className="w-4 h-4 text-secondary" />
            {location}
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white leading-tight">{siteName}</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light tracking-wide">{siteTagline}</p>
          <div className="pt-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-8 text-lg font-medium shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
            >
              <MessageCircle className="w-6 h-6" />
              Book Now
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/5 backdrop-blur-xl border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {[
              { label: "Elite Properties", value: "25+", icon: Home },
              { label: "Guest Rating", value: "5.0 ★", icon: Star },
              { label: "VIP Support", value: "24/7", icon: Headset },
              { label: "Verified Luxury", value: "100%", icon: ShieldCheck },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center border-r border-white/10 last:border-none"
              >
                <div className="flex items-center gap-2 text-secondary mb-1">
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
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Best Price Guarantee",
                desc: "Luxury doesn't have to be overpriced. We ensure the most competitive rates for elite stays.",
                icon: BadgePercent,
              },
              {
                title: "Concierge Service",
                desc: "Our 24/7 dedicated support team caters to your every whim, from private chefs to yacht charters.",
                icon: Headset,
              },
              {
                title: "Premium Quality",
                desc: "Every property in our portfolio undergoes a 150-point inspection for absolute perfection.",
                icon: ShieldCheck,
              },
              {
                title: "Feel at Home",
                desc: "Experience the intimacy of a private residence with the amenities of a world-class hotel.",
                icon: Home,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-[24px] bg-white border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20 group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-24 bg-muted/30" id="properties">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif">Signature Collection</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.slice(0, 3).map((property, i) => (
              <PropertyCard key={i} {...property} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white transition-all bg-transparent"
            >
              Explore All Properties
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#051C14] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-4xl font-serif tracking-tighter">{siteName}</h2>
            <p className="text-white/60 max-w-sm leading-relaxed">
              Curating moments of pure elegance and tranquility across the most beautiful destinations in the world.
            </p>
            <div className="flex gap-4">
              <Button size="icon" variant="ghost" className="rounded-full bg-white/5 hover:bg-white/10">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Quick Links</h4>
            <nav className="flex flex-col gap-4">
              <a href="#properties" className="text-white/60 hover:text-white transition-colors">
                Properties
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Services
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Destinations
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Contact
              </a>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40">Contact Us</h4>
            <div className="space-y-4 text-white/60">
              <p>concierge@lelegance.com</p>
              <p>+33 (0) 4 93 12 34 56</p>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white hover:text-emerald-950 rounded-full bg-transparent"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
              >
                <MessageCircle className="mr-2 w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2025 {siteName}. All rights reserved.</p>
          <p className="font-medium tracking-widest uppercase">Powered by MY HOST BizMate</p>
        </div>
      </footer>
    </main>
  )
}
