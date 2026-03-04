import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  onNavigate: (page: "home" | "shop" | "admin") => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            aria-label="HINT Mart - Go to homepage"
          >
            <img
              src="/assets/generated/hint-mart-logo-transparent.dim_400x200.png"
              alt="HINT Mart Logo"
              className="h-10 w-auto object-contain"
            />
          </button>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Button
              variant={currentPage === "shop" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate("shop")}
              className={
                currentPage === "shop"
                  ? "bg-brand-green text-white hover:bg-brand-green/90"
                  : "text-foreground hover:text-brand-green hover:bg-brand-green-light"
              }
              data-ocid="nav.shop_link"
            >
              <Store className="h-4 w-4 mr-1.5" />
              Shop
            </Button>

            {/* Cart button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={openCart}
              className="relative text-foreground hover:text-brand-orange hover:bg-brand-orange-light"
              data-ocid="nav.cart_button"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.div
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-brand-orange text-white border-0 rounded-full">
                    {totalItems > 9 ? "9+" : totalItems}
                  </Badge>
                </motion.div>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("admin")}
              className="text-muted-foreground hover:text-foreground hover:bg-muted text-xs"
              data-ocid="nav.admin_link"
            >
              Admin
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
