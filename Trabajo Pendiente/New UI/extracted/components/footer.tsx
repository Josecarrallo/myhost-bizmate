export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl mb-4">ubud villas.</h3>
            <p className="text-sm leading-relaxed opacity-80">Villas de lujo en el corazón cultural de Bali</p>
          </div>
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-4 opacity-80">Contacto</h4>
            <div className="space-y-2 text-sm">
              <p>Jl. Raya Ubud, Bali 80571</p>
              <p>Indonesia</p>
              <p className="pt-2">info@ubudvillas.com</p>
              <p>+62 361 123 4567</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-4 opacity-80">Síguenos</h4>
            <div className="space-y-2 text-sm">
              <p>Instagram</p>
              <p>Facebook</p>
              <p>Pinterest</p>
            </div>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/20 pt-8 text-center text-sm opacity-60">
          <p>© 2025 Ubud Villas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
