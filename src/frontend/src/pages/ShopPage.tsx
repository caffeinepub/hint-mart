import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";
import { useAllProducts, useCategories } from "../hooks/useQueries";

interface ShopPageProps {
  initialCategory?: string;
}

const ITEMS_PER_PAGE = 12;

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % ITEMS_PER_PAGE) * 0.05, duration: 0.35 }}
      layout
    >
      <Card
        className="shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-border group h-full flex flex-col"
        data-ocid={`shop.product.item.${index + 1}`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Product icon & sale badge */}
          <div className="relative flex items-start justify-between mb-3">
            <div className="w-14 h-14 bg-brand-green-light rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              {getCategoryEmoji(product.category)}
            </div>
            <div className="flex flex-col items-end gap-1">
              {isOnSale && (
                <Badge className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-0">
                  {discount}% OFF
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Name & category */}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm leading-snug mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
              {product.category} · {product.subcategory}
            </p>
            {product.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Price & CTA */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display font-bold text-brand-green text-xl">
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
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold text-xs h-9"
              onClick={() => addItem(product)}
              disabled={!product.inStock}
              data-ocid={`product.add_button.${index + 1}`}
            >
              {product.inStock ? (
                <>
                  <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                  Add to Cart
                </>
              ) : (
                "Out of Stock"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <Card className="border border-border p-4">
      <Skeleton className="w-14 h-14 rounded-2xl mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-4" />
      <Skeleton className="h-6 w-1/3 mb-3" />
      <Skeleton className="h-9 w-full rounded-md" />
    </Card>
  );
}

export function ShopPage({ initialCategory = "All" }: ShopPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { data: allProducts = [], isLoading } = useAllProducts();
  const { data: categories = [] } = useCategories();

  const currentCategoryData = categories.find(
    (c) => c.name === selectedCategory,
  );

  const filteredProducts = useMemo(() => {
    let products = allProducts;

    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }
    if (selectedSubcategory !== "All") {
      products = products.filter((p) => p.subcategory === selectedSubcategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      );
    }
    return products;
  }, [allProducts, selectedCategory, selectedSubcategory, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE);

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    setSelectedSubcategory("All");
    setPage(1);
  }

  const allCategoryNames = ["All", ...categories.map((c) => c.name)];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-foreground mb-1">
          Shop All Products
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-11 bg-white border-border focus:border-brand-green"
            data-ocid="shop.search_input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          className="h-11 gap-2 lg:hidden"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside
          className={`w-56 flex-shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}
        >
          <div className="bg-white rounded-2xl border border-border p-4 sticky top-24">
            <h3 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
              Categories
            </h3>
            <div className="space-y-1">
              {allCategoryNames.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors font-medium ${
                    selectedCategory === cat
                      ? "bg-brand-green text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                  data-ocid="shop.category_filter.tab"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Subcategories */}
            {currentCategoryData &&
              currentCategoryData.subcategories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="font-display font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                    Subcategories
                  </h3>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory("All")}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        selectedSubcategory === "All"
                          ? "bg-brand-orange text-white font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      All
                    </button>
                    {currentCategoryData.subcategories.map((sub) => (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                          selectedSubcategory === sub
                            ? "bg-brand-orange text-white font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {(selectedCategory !== "All" || searchTerm) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("All")}
                  className="flex items-center gap-1.5 bg-brand-green-light text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-xs font-medium hover:bg-brand-green hover:text-white transition-colors"
                >
                  {selectedCategory}
                  <X className="h-3 w-3" />
                </button>
              )}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="flex items-center gap-1.5 bg-brand-orange-light text-brand-orange border border-brand-orange/20 px-3 py-1 rounded-full text-xs font-medium hover:bg-brand-orange hover:text-white transition-colors"
                >
                  "{searchTerm}"
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
                <ProductSkeleton key={k} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="shop.empty_state"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try a different search term or category
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  handleCategoryChange("All");
                }}
                className="border-brand-green text-brand-green hover:bg-brand-green-light"
              >
                Clear filters
              </Button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedProducts.map((product, i) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      index={i}
                    />
                  ))}
                </div>
              </AnimatePresence>

              {/* Load More */}
              {page < totalPages && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    className="border-brand-green text-brand-green hover:bg-brand-green-light px-8"
                    onClick={() => setPage((p) => p + 1)}
                    data-ocid="shop.pagination_next"
                  >
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
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
