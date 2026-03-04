import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { CheckoutModal } from "./CheckoutModal";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    totalItems,
    isCartOpen,
    closeCart,
  } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            data-ocid="cart.drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-green" />
                <h2 className="font-display font-bold text-lg text-foreground">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="bg-brand-green text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                className="h-8 w-8 rounded-full hover:bg-muted"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                  data-ocid="cart.empty_state"
                >
                  <div className="w-20 h-20 bg-brand-green-light rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-brand-green" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-lg">
                      Your cart is empty
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Add items to get started
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={closeCart}
                    className="mt-2 border-brand-green text-brand-green hover:bg-brand-green-light"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id.toString()}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-start gap-3 py-4 border-b border-border last:border-0"
                      data-ocid={`cart.item.${index + 1}`}
                    >
                      <div className="w-10 h-10 bg-brand-green-light rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                        {getCategoryEmoji(item.product.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {item.product.name}
                        </p>
                        <p className="text-brand-orange text-sm font-bold mt-0.5">
                          ₹{Number(item.product.price).toLocaleString("en-IN")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="text-sm font-bold text-foreground">
                          ₹
                          {(
                            Number(item.product.price) * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-border bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-foreground font-semibold">
                    Subtotal
                  </span>
                  <span className="font-display font-bold text-xl text-brand-green">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <Separator className="mb-4" />
                <Button
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold h-12 text-base"
                  onClick={() => setCheckoutOpen(true)}
                  data-ocid="cart.checkout_button"
                >
                  Place Order →
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          closeCart();
        }}
      />
    </>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    Kirana: "🛒",
    "Soft Drinks": "🥤",
    "Electronic Products": "📱",
    Books: "📚",
    "Home Equipment": "🏠",
    "Woman Clothing": "👗",
  };
  return map[category] ?? "📦";
}
