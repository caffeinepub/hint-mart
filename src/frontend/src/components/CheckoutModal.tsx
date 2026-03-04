import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useQueries";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderId, setOrderId] = useState<bigint | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.address.trim())
      newErrors.address = "Delivery address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));

      const id = await placeOrder.mutateAsync({
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        total: BigInt(totalPrice),
        items: orderItems,
      });

      setOrderId(id);
      clearCart();
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  }

  function handleClose() {
    setForm({ name: "", phone: "", address: "" });
    setErrors({});
    setOrderId(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="checkout.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {orderId ? "Order Confirmed! 🎉" : "Complete Your Order"}
          </DialogTitle>
        </DialogHeader>

        {orderId ? (
          <div
            className="flex flex-col items-center gap-4 py-6 text-center"
            data-ocid="order.success_state"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-brand-green" />
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-brand-green">
                Thank You!
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Your order has been placed successfully
              </p>
            </div>
            <div className="bg-brand-green-light rounded-xl p-4 w-full">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-display font-bold text-xl text-brand-green">
                #{orderId.toString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              We will contact you at your provided phone number to confirm
              delivery.
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm text-foreground mb-3">
                Order Summary
              </h3>
              {items.slice(0, 4).map((item) => (
                <div
                  key={item.product.id.toString()}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold flex-shrink-0">
                    ₹
                    {(
                      Number(item.product.price) * item.quantity
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              {items.length > 4 && (
                <p className="text-xs text-muted-foreground">
                  +{items.length - 4} more items
                </p>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-brand-green text-lg">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="checkout-name"
                  className="text-sm font-semibold"
                >
                  Full Name *
                </Label>
                <Input
                  id="checkout-name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={`mt-1.5 ${errors.name ? "border-destructive" : ""}`}
                  data-ocid="checkout.name_input"
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="checkout-phone"
                  className="text-sm font-semibold"
                >
                  Phone Number *
                </Label>
                <Input
                  id="checkout-phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className={`mt-1.5 ${errors.phone ? "border-destructive" : ""}`}
                  data-ocid="checkout.phone_input"
                />
                {errors.phone && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="checkout-address"
                  className="text-sm font-semibold"
                >
                  Delivery Address *
                </Label>
                <Textarea
                  id="checkout-address"
                  placeholder="House no., street, area, city, pincode"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  className={`mt-1.5 min-h-[80px] ${errors.address ? "border-destructive" : ""}`}
                  data-ocid="checkout.address_textarea"
                />
                {errors.address && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold h-12 text-base"
              disabled={placeOrder.isPending}
              data-ocid="checkout.submit_button"
            >
              {placeOrder.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Confirm Order →"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
