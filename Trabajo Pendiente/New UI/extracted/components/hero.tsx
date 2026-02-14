"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-8 md:px-12">
        <div className="text-foreground">
          <h1 className="font-serif text-2xl md:text-3xl tracking-wide">ubud villas.</h1>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-foreground hover:text-primary transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12 py-24">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">Bali, Indonesia</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-balance text-foreground">
                Serenidad tropical en el corazón de Ubud
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl text-pretty">
                Descubre villas de lujo privadas rodeadas de exuberante naturaleza, cultura balinesa auténtica y
                tranquilidad absoluta.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Ver Villas
                </Button>
                <Button size="lg" variant="outline" className="border-border hover:bg-muted bg-transparent">
                  Contactar
                </Button>
              </div>
            </div>
            <div className="relative aspect-[3/4] lg:aspect-[4/5]">
              <img
                src="/luxury-villa-pool-ubud-bali-tropical-architecture.jpg"
                alt="Villa de lujo en Ubud"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-background z-40 flex items-center justify-center">
          <div className="text-center space-y-8">
            <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-6 text-3xl text-foreground">
              ×
            </button>
            <nav className="space-y-6 font-serif text-3xl">
              <a href="#villas" className="block hover:text-primary transition-colors">
                Villas
              </a>
              <a href="#experience" className="block hover:text-primary transition-colors">
                Experiencia
              </a>
              <a href="#location" className="block hover:text-primary transition-colors">
                Ubicación
              </a>
              <a href="#contact" className="block hover:text-primary transition-colors">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      )}
    </section>
  )
}
