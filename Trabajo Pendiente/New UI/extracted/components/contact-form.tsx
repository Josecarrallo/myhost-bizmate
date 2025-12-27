import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase block mb-4">
            Reserva tu estancia
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">Contáctanos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Completa el formulario y te responderemos en menos de 24 horas para ayudarte a planificar tu escape perfecto
            a Ubud.
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-foreground">
                Nombre completo
              </label>
              <Input id="name" placeholder="Tu nombre" className="bg-card border-border" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-foreground">
                Email
              </label>
              <Input id="email" type="email" placeholder="tu@email.com" className="bg-card border-border" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="checkin" className="block text-sm mb-2 text-foreground">
                Check-in
              </label>
              <Input id="checkin" type="date" className="bg-card border-border" />
            </div>
            <div>
              <label htmlFor="checkout" className="block text-sm mb-2 text-foreground">
                Check-out
              </label>
              <Input id="checkout" type="date" className="bg-card border-border" />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm mb-2 text-foreground">
              Mensaje
            </label>
            <Textarea
              id="message"
              placeholder="Cuéntanos sobre tu viaje..."
              rows={6}
              className="bg-card border-border"
            />
          </div>

          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Enviar Consulta
          </Button>
        </form>
      </div>
    </section>
  )
}
