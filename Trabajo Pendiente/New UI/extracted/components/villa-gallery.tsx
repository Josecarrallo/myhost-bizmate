export function VillaGallery() {
  const villas = [
    {
      name: "Villa Mandala",
      bedrooms: 3,
      pool: "Infinity Pool",
      image: "/luxury-villa-infinity-pool-ubud-jungle-view.jpg",
    },
    {
      name: "Villa Surya",
      bedrooms: 4,
      pool: "Private Pool",
      image: "/balinese-villa-bedroom-luxury-tropical-interior.jpg",
    },
    {
      name: "Villa Dewi",
      bedrooms: 2,
      pool: "Plunge Pool",
      image: "/bali-villa-outdoor-living-tropical-garden.jpg",
    },
  ]

  return (
    <section id="villas" className="py-24 px-6 md:px-12 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-16">
          <div>
            <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase block mb-4">
              Nuestras Propiedades
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-card-foreground">Villas Exclusivas</h2>
          </div>
          <button className="hidden md:block text-sm tracking-[0.2em] text-muted-foreground uppercase hover:text-primary transition-colors">
            Ver Todas →
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {villas.map((villa, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative aspect-[4/5] mb-6 overflow-hidden">
                <img
                  src={villa.image || "/placeholder.svg"}
                  alt={villa.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-2xl mb-2 text-card-foreground">{villa.name}</h3>
              <p className="text-muted-foreground text-sm tracking-wide">
                {villa.bedrooms} Habitaciones · {villa.pool}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
