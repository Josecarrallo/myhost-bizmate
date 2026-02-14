import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { CreditCard, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkIn?: Date;
  checkOut?: Date;
  numberOfNights: number;
  totalPrice: number;
  formatCurrency: (amount: number) => string;
}

type Step = "details" | "payment" | "confirmation";

const BookingDialog = ({ 
  open, 
  onOpenChange, 
  checkIn, 
  checkOut, 
  numberOfNights, 
  totalPrice,
  formatCurrency 
}: BookingDialogProps) => {
  const [step, setStep] = useState<Step>("details");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    guests: "2",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleContinue = () => {
    if (step === "details") {
      setStep("payment");
    } else if (step === "payment") {
      setStep("confirmation");
    }
  };

  const handleClose = () => {
    setStep("details");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      guests: "2",
    });
    onOpenChange(false);
  };

  const isDetailsValid = formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-background border-border/50 p-0 overflow-hidden">
        {/* Progress Steps */}
        <div className="flex border-b border-border/50">
          {["details", "payment", "confirmation"].map((s, i) => (
            <div 
              key={s}
              className={cn(
                "flex-1 py-3 text-center text-sm font-body transition-colors",
                step === s ? "bg-primary/5 text-foreground" : "text-muted-foreground",
                i < ["details", "payment", "confirmation"].indexOf(step) && "text-primary"
              )}
            >
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>

        <div className="p-6">
          {/* Booking Summary */}
          <div className="mb-6 pb-6 border-b border-border/50">
            <h3 className="font-display text-lg mb-3">Nismara Uma Villa</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              <div>
                <p className="text-muted-foreground">Check-in</p>
                <p className="text-foreground">{checkIn ? format(checkIn, "MMM d, yyyy") : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Check-out</p>
                <p className="text-foreground">{checkOut ? format(checkOut, "MMM d, yyyy") : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="text-foreground">{numberOfNights} night{numberOfNights > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="text-foreground font-display">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Step: Details */}
          {step === "details" && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Guest Details</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-body text-sm">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="font-body"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-body text-sm">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="font-body"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-sm">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="font-body"
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-body text-sm">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="font-body"
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests" className="font-body text-sm">Number of Guests</Label>
                <Input 
                  id="guests" 
                  name="guests"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="font-body"
                />
                <p className="text-xs text-muted-foreground font-body">Maximum 4 guests</p>
              </div>

              <Button 
                onClick={handleContinue}
                disabled={!isDetailsValid}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-body"
                size="lg"
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {/* Step: Payment */}
          {step === "payment" && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Payment Method</DialogTitle>
              </DialogHeader>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
                  paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}>
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-body text-sm">Credit / Debit Card</p>
                      <p className="text-xs text-muted-foreground font-body">Visa, Mastercard, American Express</p>
                    </div>
                  </Label>
                </div>
                
                <div className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
                  paymentMethod === "bank" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}>
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-body text-sm">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground font-body">Direct bank transfer (BCA, Mandiri, BNI)</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="font-body text-sm">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      className="font-body"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="font-body text-sm">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        className="font-body"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="font-body text-sm">CVV</Label>
                      <Input 
                        id="cvv" 
                        className="font-body"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-sm font-body text-muted-foreground">
                    After clicking "Complete Reservation", you will receive bank transfer details via email. 
                    Your reservation will be confirmed once payment is received.
                  </p>
                </div>
              )}

              <Button 
                onClick={handleContinue}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body"
                size="lg"
              >
                Complete Reservation — {formatCurrency(totalPrice)}
              </Button>
            </div>
          )}

          {/* Step: Confirmation */}
          {step === "confirmation" && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-primary" />
              </div>
              
              <div>
                <h3 className="font-display text-2xl mb-2">Reservation Confirmed</h3>
                <p className="text-muted-foreground font-body">
                  Thank you for your reservation at Nismara Uma Villa.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 text-left space-y-3">
                <p className="text-sm font-body">
                  <span className="text-muted-foreground">Confirmation sent to:</span><br />
                  <span className="text-foreground">{formData.email}</span>
                </p>
                <p className="text-sm font-body">
                  <span className="text-muted-foreground">Guest:</span><br />
                  <span className="text-foreground">{formData.firstName} {formData.lastName}</span>
                </p>
              </div>

              <p className="text-sm text-muted-foreground font-body">
                We will contact you shortly to confirm your stay and provide arrival details.
              </p>

              <Button 
                onClick={handleClose}
                variant="outline"
                className="font-body"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
