import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, Phone, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";
import { useAllProducts } from "../hooks/useQueries";

interface HomePageProps {
  onNavigate: (page: "home" | "shop" | "admin", category?: string) => void;
}

const CATEGORIES = [
  {
    name: "Kirana",
    emoji: "🛒",
    description: "Daily essentials & groceries",
    color: "bg-amber-50 border-amber-200",
  },
  {
    name: "Soft Drinks",
    emoji: "🥤",
    description: "Beverages & cold drinks",
    color: "bg-blue-50 border-blue-200",
  },
  {
    name: "Electronic Products",
    emoji: "📱",
    description: "Gadgets & electronics",
    color: "bg-purple-50 border-purple-200",
  },
  {
    name: "Books",
    emoji: "📚",
    description: "Books & stationery",
    color: "bg-orange-50 border-orange-200",
  },
  {
    name: "Home Equipment",
    emoji: "🏠",
    description: "Home & kitchen items",
    color: "bg-teal-50 border-teal-200",
  },
  {
    name: "Woman Clothing",
    emoji: "👗",
    description: "Fashion & clothing",
    color: "bg-pink-50 border-pink-200",
  },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const isOnSale = product.originalPrice > product.price;
  const discount = isOnSale
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100,
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card
        className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border group"
        data-ocid={`shop.product.item.${index + 1}`}
      >
        <div className="p-4">
          <div className="relative flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-brand-green-light rounded-xl flex items-center justify-center text-2xl">
              {getCategoryEmoji(product.category)}
            </div>
            {isOnSale && (
              <Badge className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-0">
                {discount}% OFF
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            {product.subcategory}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-display font-bold text-brand-green text-lg">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {isOnSale && (
              <span className="text-muted-foreground text-sm line-through">
                ₹{Number(product.originalPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold text-xs h-8"
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            data-ocid={`product.add_button.${index + 1}`}
          >
            {product.inStock ? (
              <>
                <ShoppingCart className="h-3 w-3 mr-1.5" />
                Add to Cart
              </>
            ) : (
              "Out of Stock"
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { data: allProducts = [] } = useAllProducts();

  const saleProducts = allProducts
    .filter((p) => p.originalPrice > p.price && p.inStock)
    .slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24 overflow-hidden relative">
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "oklch(0.75 0.14 60)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.52 0.15 145)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20 mb-4 text-sm px-3 py-1">
                🛍️ Your Neighborhood Store
              </Badge>
              <h1 className="font-display font-extrabold text-4xl md:text-6xl text-foreground leading-tight mb-4">
                Welcome to <span className="text-brand-green">HINT Mart</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Your trusted neighborhood store for fresh groceries, daily
                essentials, electronics, and more. Delivered right to your
                doorstep.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-8 h-12 text-base"
                  onClick={() => onNavigate("shop")}
                  data-ocid="hero.primary_button"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-border">
                  <Clock className="h-4 w-4 text-brand-green" />
                  <span className="text-sm font-medium">9 AM – 9 PM Daily</span>
                </div>
                <a
                  href="tel:7797796622"
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl border border-border hover:bg-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-orange" />
                  <span className="text-sm font-medium">7797796622</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-display font-bold text-3xl text-foreground mb-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground">
            Explore our wide range of products across all categories
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("shop", cat.name)}
              className={`${cat.color} border-2 rounded-2xl p-4 flex flex-col items-center gap-2 text-center cursor-pointer transition-shadow hover:shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              data-ocid="shop.category_filter.tab"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {cat.emoji}
              </span>
              <span className="font-semibold text-xs sm:text-sm text-foreground leading-tight">
                {cat.name}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block leading-tight">
                {cat.description}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="bg-gradient-to-r from-green-50 to-orange-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="font-display font-bold text-3xl text-foreground mb-1">
                  🏷️ Hot Deals Today
                </h2>
                <p className="text-muted-foreground">
                  Limited time offers — grab them before they're gone!
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => onNavigate("shop")}
                className="border-brand-green text-brand-green hover:bg-brand-green-light hidden sm:flex"
              >
                View All
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {saleProducts.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6 sm:hidden">
              <Button
                variant="outline"
                onClick={() => onNavigate("shop")}
                className="border-brand-green text-brand-green hover:bg-brand-green-light"
              >
                View All Deals
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About / Store Info Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-foreground rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">
              HINT MARKET RAY STORE
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Serving our community with quality products at the best prices.
              We're open every day from 9 AM to 9 PM so you never miss out on
              your daily needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-sm">9 AM – 9 PM Daily</span>
              </div>
              <a
                href="tel:7797796622"
                className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-sm">7797796622</span>
              </a>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-brand-green hover:bg-brand-green/90 text-white font-semibold px-10 h-12 text-base flex-shrink-0"
            onClick={() => onNavigate("shop")}
          >
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>
    </main>
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
