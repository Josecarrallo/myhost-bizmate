import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, addDays, differenceInDays, isBefore, isAfter, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BookingDialog from "./BookingDialog";

// Mock booked dates for demo
const bookedDates = [
  new Date(2026, 1, 5),
  new Date(2026, 1, 6),
  new Date(2026, 1, 7),
  new Date(2026, 1, 15),
  new Date(2026, 1, 16),
  new Date(2026, 1, 17),
  new Date(2026, 1, 18),
  new Date(2026, 2, 1),
  new Date(2026, 2, 2),
  new Date(2026, 2, 3),
];

const PRICE_PER_NIGHT = 1300000;

const BookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(date, bookedDate));
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, new Date()) || isDateBooked(date);
  };

  const isCheckOutDisabled = (date: Date) => {
    // must be after check-in (at least 1 night)
    if (!checkIn) return true;
    return isBefore(date, addDays(checkIn, 1)) || isDateBooked(date);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(undefined);
    } else if (checkIn && !checkOut) {
      if (isAfter(date, checkIn)) {
        setCheckOut(date);
      } else {
        setCheckIn(date);
      }
    }
  };

  const numberOfNights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = numberOfNights * PRICE_PER_NIGHT;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const clearDates = () => {
    setCheckIn(undefined);
    setCheckOut(undefined);
  };

  return (
    <section id="availability" ref={ref} className="py-8 md:py-10 bg-muted/30">
      <div className="container-villa">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-4 font-body">
            Plan Your Stay
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground">
            Check Availability
          </h2>
          <div className="elegant-separator" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Select your dates to see availability and pricing for your private escape in Ubud.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40" />
                  <span className="text-sm text-muted-foreground font-body">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <span className="text-sm text-muted-foreground font-body">Booked</span>
                </div>
              </div>
              
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                numberOfMonths={2}
                className="pointer-events-auto w-full"
                classNames={{
                  months: "flex flex-col sm:flex-row gap-4 sm:gap-8",
                  month: "space-y-4 flex-1",
                  caption: "flex justify-center pt-1 relative items-center font-display text-lg",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
                  ),
                  table: "w-full border-collapse",
                  head_cell: "text-muted-foreground font-body text-xs w-10 font-normal",
                  cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-10 w-10 p-0 font-body text-sm aria-selected:opacity-100",
                    "hover:bg-primary/10 rounded-md transition-colors"
                  ),
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary",
                  day_today: "border border-primary/50",
                  day_disabled: "text-muted-foreground/40 hover:bg-transparent cursor-not-allowed",
                  day_outside: "text-muted-foreground/30",
                }}
                modifiers={{
                  booked: bookedDates,
                  checkIn: checkIn ? [checkIn] : [],
                  checkOut: checkOut ? [checkOut] : [],
                }}
                modifiersClassNames={{
                  booked: "bg-muted-foreground/20 text-muted-foreground/60 line-through",
                  checkIn: "bg-primary text-primary-foreground rounded-l-md",
                  checkOut: "bg-primary text-primary-foreground rounded-r-md",
                }}
              />
            </div>
          </motion.div>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50 sticky top-24">
              {/* Price */}
              <div className="mb-6 pb-6 border-b border-border/50">
                <p className="text-sm text-muted-foreground font-body mb-1">Starting from</p>
                <p className="font-display text-2xl text-foreground">
                  {formatCurrency(PRICE_PER_NIGHT)}
                  <span className="text-base text-muted-foreground font-body"> / night</span>
                </p>
              </div>

              {/* Date Selection Display */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground font-body block mb-2">Check-in</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full p-3 rounded-md border text-sm font-body text-left transition-colors hover:border-primary/70",
                          checkIn ? "border-primary/50 bg-primary/5" : "border-border bg-muted/30",
                        )}
                      >
                        {checkIn ? format(checkIn, "EEEE, MMMM d, yyyy") : "Select date"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={(date) => {
                          if (!date) return;
                          setCheckIn(date);
                          setCheckOut(undefined);
                        }}
                        disabled={isDateDisabled}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground font-body block mb-2">Check-out</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={!checkIn}
                        className={cn(
                          "w-full p-3 rounded-md border text-sm font-body text-left transition-colors hover:border-primary/70 disabled:opacity-60 disabled:cursor-not-allowed",
                          checkOut ? "border-primary/50 bg-primary/5" : "border-border bg-muted/30",
                        )}
                      >
                        {checkOut
                          ? format(checkOut, "EEEE, MMMM d, yyyy")
                          : checkIn
                            ? "Select check-out date"
                            : "Select check-in first"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={(date) => {
                          if (!date) return;
                          setCheckOut(date);
                        }}
                        disabled={isCheckOutDisabled}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Price Summary */}
              {numberOfNights > 0 && (
                <div className="mb-6 pb-6 border-b border-border/50 space-y-2">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">
                      {formatCurrency(PRICE_PER_NIGHT)} × {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                    </span>
                    <span className="text-foreground">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-display text-lg pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={() => setIsBookingOpen(true)}
                  disabled={!checkIn || !checkOut}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body tracking-wide"
                  size="lg"
                >
                  Reserve Your Stay
                </Button>
                
                {(checkIn || checkOut) && (
                  <button 
                    onClick={clearDates}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
                  >
                    Clear dates
                  </button>
                )}
              </div>

              {/* Info */}
              <p className="text-xs text-muted-foreground font-body text-center mt-4">
                Free cancellation up to 3 days before check-in
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Dialog */}
      <BookingDialog 
        open={isBookingOpen} 
        onOpenChange={setIsBookingOpen}
        checkIn={checkIn}
        checkOut={checkOut}
        numberOfNights={numberOfNights}
        totalPrice={totalPrice}
        formatCurrency={formatCurrency}
      />
    </section>
  );
};

export default BookingSection;
