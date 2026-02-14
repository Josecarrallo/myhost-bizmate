import { Palmtree, Waves, Coffee, Sparkles } from "lucide-react"

export function Experience() {
  const features = [
    {
      icon: Palmtree,
      title: "Entorno Natural",
      description: "Rodeado de arrozales y selva tropical",
    },
    {
      icon: Waves,
      title: "Piscinas Privadas",
      description: "Infinity pools con vistas espectaculares",
    },
    {
      icon: Coffee,
      title: "Servicio Completo",
      description: "Chef privado y personal dedicado",
    },
    {
      icon: Sparkles,
      title: "Experiencias",
      description: "Yoga, spa y ceremonias balinesas",
    },
  ]

  return (
    <section id="experience" className="py-24 px-6 md:px-12 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <span className="text-sm tracking-[0.2em] uppercase block mb-4 opacity-80">La Experiencia</span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-balance">
              Vive el lujo en armonía con la naturaleza
            </h2>
            <p className="text-lg leading-relaxed opacity-90 text-pretty">
              Cada villa ha sido diseñada para ofrecer la máxima privacidad y confort, integrando la arquitectura
              tradicional balinesa con las comodidades modernas. Despierta con el canto de los pájaros, disfruta de
              atardeceres mágicos y sumérgete en la cultura local.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="space-y-4">
                <feature.icon className="w-10 h-10 opacity-80" />
                <h3 className="font-serif text-xl">{feature.title}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
