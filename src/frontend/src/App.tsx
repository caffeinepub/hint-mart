import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";

type Page = "home" | "shop" | "admin";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [shopCategory, setShopCategory] = useState<string>("All");

  function handleNavigate(newPage: Page, category?: string) {
    if (newPage === "shop" && category) {
      setShopCategory(category);
    } else if (newPage === "shop") {
      setShopCategory("All");
    }
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header onNavigate={handleNavigate} currentPage={page} />

        <div className="flex-1">
          {page === "home" && <HomePage onNavigate={handleNavigate} />}
          {page === "shop" && <ShopPage initialCategory={shopCategory} />}
          {page === "admin" && <AdminPage />}
        </div>

        <Footer />
        <CartDrawer />
        <Toaster position="bottom-right" richColors />
      </div>
    </CartProvider>
  );
}
