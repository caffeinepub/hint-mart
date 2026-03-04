import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Lock,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import {
  useAddProduct,
  useAllOrders,
  useAllProducts,
  useCategories,
  useDeleteProduct,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

const ADMIN_PASSWORD = "admin123";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  originalPrice: string;
  description: string;
  inStock: boolean;
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  category: "",
  subcategory: "",
  price: "",
  originalPrice: "",
  description: "",
  inStock: true,
};

// ─── Status helpers ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    fulfilled: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${variants[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

// ─── Product Form Dialog ──────────────────────────────────────────────────────

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  editProduct: Product | null;
}

function ProductFormDialog({
  open,
  onClose,
  editProduct,
}: ProductFormDialogProps) {
  const { data: categories = [] } = useCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const isEdit = !!editProduct;

  const [form, setForm] = useState<ProductFormData>(() =>
    editProduct
      ? {
          name: editProduct.name,
          category: editProduct.category,
          subcategory: editProduct.subcategory,
          price: editProduct.price.toString(),
          originalPrice: editProduct.originalPrice.toString(),
          description: editProduct.description,
          inStock: editProduct.inStock,
        }
      : DEFAULT_FORM,
  );

  // Reset form when editProduct changes
  useState(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        category: editProduct.category,
        subcategory: editProduct.subcategory,
        price: editProduct.price.toString(),
        originalPrice: editProduct.originalPrice.toString(),
        description: editProduct.description,
        inStock: editProduct.inStock,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  });

  const selectedCategoryData = categories.find((c) => c.name === form.category);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const productData: Product = {
      id: editProduct?.id ?? BigInt(0),
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      price: BigInt(Math.round(Number.parseFloat(form.price) || 0)),
      originalPrice: BigInt(
        Math.round(Number.parseFloat(form.originalPrice || form.price) || 0),
      ),
      description: form.description,
      inStock: form.inStock,
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync(productData);
        toast.success("Product updated successfully");
      } else {
        await addProduct.mutateAsync(productData);
        toast.success("Product added successfully");
      }
      onClose();
    } catch {
      toast.error("Failed to save product. Please try again.");
    }
  }

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="admin.product_form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pf-name" className="text-sm font-semibold">
              Product Name *
            </Label>
            <Input
              id="pf-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1.5"
              placeholder="e.g. Basmati Rice 5kg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pf-category" className="text-sm font-semibold">
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v, subcategory: "" }))
                }
              >
                <SelectTrigger id="pf-category" className="mt-1.5">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pf-subcategory" className="text-sm font-semibold">
                Subcategory
              </Label>
              {selectedCategoryData &&
              selectedCategoryData.subcategories.length > 0 ? (
                <Select
                  value={form.subcategory}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, subcategory: v }))
                  }
                >
                  <SelectTrigger id="pf-subcategory" className="mt-1.5">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategoryData.subcategories.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="pf-subcategory"
                  value={form.subcategory}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subcategory: e.target.value }))
                  }
                  className="mt-1.5"
                  placeholder="Subcategory"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pf-price" className="text-sm font-semibold">
                Price (₹) *
              </Label>
              <Input
                id="pf-price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                className="mt-1.5"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="pf-origprice" className="text-sm font-semibold">
                Original Price (₹)
              </Label>
              <Input
                id="pf-origprice"
                type="number"
                min="0"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, originalPrice: e.target.value }))
                }
                className="mt-1.5"
                placeholder="0 (if on sale)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pf-desc" className="text-sm font-semibold">
              Description
            </Label>
            <Input
              id="pf-desc"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="mt-1.5"
              placeholder="Short product description"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="pf-instock"
              checked={form.inStock}
              onCheckedChange={(v) => setForm((f) => ({ ...f, inStock: !!v }))}
            />
            <Label
              htmlFor="pf-instock"
              className="text-sm font-medium cursor-pointer"
            >
              In Stock
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand-green hover:bg-brand-green/90 text-white"
              disabled={isPending}
              data-ocid="admin.product_form.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const { data: orders = [], isLoading, refetch } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const sortedOrders = [...orders].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  async function handleStatusChange(orderId: bigint, status: string) {
    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.orders.loading_state">
        {["o1", "o2", "o3", "o4"].map((k) => (
          <Skeleton key={k} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {sortedOrders.length} total orders
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {sortedOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table data-ocid="admin.orders.table">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-xs">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-xs hidden md:table-cell">
                  Phone
                </TableHead>
                <TableHead className="font-semibold text-xs hidden lg:table-cell">
                  Address
                </TableHead>
                <TableHead className="font-semibold text-xs">Items</TableHead>
                <TableHead className="font-semibold text-xs">Total</TableHead>
                <TableHead className="font-semibold text-xs">Status</TableHead>
                <TableHead className="font-semibold text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order, i) => (
                <TableRow
                  key={order.id.toString()}
                  className="hover:bg-muted/30 transition-colors"
                  data-ocid={`admin.orders.row.${i + 1}`}
                >
                  <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                    #{order.id.toString()}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell text-muted-foreground">
                    {order.phone}
                  </TableCell>
                  <TableCell className="text-xs hidden lg:table-cell text-muted-foreground max-w-[180px] truncate">
                    {order.address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {order.items.length} items
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-brand-green text-sm">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(v) => handleStatusChange(order.id, v)}
                    >
                      <SelectTrigger
                        className="h-8 text-xs w-28"
                        data-ocid={`admin.orders.status_select.${i + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const { data: products = [], isLoading } = useAllProducts();
  const deleteProduct = useDeleteProduct();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteProduct.mutateAsync(deleteId);
      toast.success("Product deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.products.loading_state">
        {["p1", "p2", "p3", "p4"].map((k) => (
          <Skeleton key={k} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {products.length} total products
        </p>
        <Button
          className="bg-brand-green hover:bg-brand-green/90 text-white gap-2"
          size="sm"
          onClick={() => setAddOpen(true)}
          data-ocid="admin.products.add_button"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No products yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table data-ocid="admin.products.table">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-xs">Name</TableHead>
                <TableHead className="font-semibold text-xs hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-xs">Price</TableHead>
                <TableHead className="font-semibold text-xs hidden md:table-cell">
                  Original
                </TableHead>
                <TableHead className="font-semibold text-xs">Stock</TableHead>
                <TableHead className="font-semibold text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => (
                <TableRow
                  key={product.id.toString()}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.subcategory}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm hidden sm:table-cell text-muted-foreground">
                    {product.category}
                  </TableCell>
                  <TableCell className="font-bold text-brand-green text-sm">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell text-muted-foreground line-through">
                    {product.originalPrice > product.price
                      ? `₹${Number(product.originalPrice).toLocaleString("en-IN")}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        product.inStock
                          ? "bg-green-100 text-green-800 border-green-200 text-xs"
                          : "bg-red-100 text-red-800 border-red-200 text-xs"
                      }
                      variant="outline"
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-border hover:bg-brand-green-light hover:border-brand-green hover:text-brand-green"
                        onClick={() => setEditProduct(product)}
                        data-ocid={`admin.product.edit_button.${i + 1}`}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-border hover:bg-red-50 hover:border-destructive hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                        data-ocid={`admin.product.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Product Dialog */}
      <ProductFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        editProduct={null}
      />

      {/* Edit Product Dialog */}
      <ProductFormDialog
        open={!!editProduct}
        onClose={() => setEditProduct(null)}
        editProduct={editProduct}
      />

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed from the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.product.delete_cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin.product.delete_confirm"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Try admin123.");
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card border border-border p-8 w-full max-w-sm"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-brand-green-light rounded-2xl flex items-center justify-center mb-3">
              <Lock className="h-7 w-7 text-brand-green" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Admin Login
            </h1>
            <p className="text-muted-foreground text-sm mt-1 text-center">
              Enter your password to access the admin panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-password" className="text-sm font-semibold">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1.5 ${loginError ? "border-destructive" : ""}`}
                autoComplete="current-password"
              />
              {loginError && (
                <p className="text-destructive text-xs mt-1">{loginError}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold h-11"
            >
              Login to Admin Panel
            </Button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-1">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            HINT Mart management dashboard
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLoggedIn(false)}
          className="text-muted-foreground hover:text-destructive hover:border-destructive"
        >
          Logout
        </Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="bg-muted/50 mb-6 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="orders"
            className="rounded-lg px-5 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs font-semibold"
            data-ocid="admin.orders.tab"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="rounded-lg px-5 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs font-semibold"
            data-ocid="admin.products.tab"
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
