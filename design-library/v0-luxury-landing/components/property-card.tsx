import { Bed, Bath, Users, ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PropertyProps {
  name: string
  location: string
  beds: number
  baths: number
  guests: number
  price: number
  image: string
}

export function PropertyCard({ name, location, beds, baths, guests, price, image }: PropertyProps) {
  return (
    <Card className="group overflow-hidden border-none bg-background transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] rounded-[16px]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white/80 text-sm font-medium tracking-wide uppercase">{location}</p>
          <h3 className="text-white text-2xl font-serif mt-1">{name}</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between text-muted-foreground text-sm mb-6">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-primary" />
            <span>{beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4 text-primary" />
            <span>{baths} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{guests} Guests</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground font-sans">${price}</span>
          <span className="text-muted-foreground text-sm">/ night</span>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-6 group/btn">
          View Details
          <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
