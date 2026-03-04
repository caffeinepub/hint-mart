import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    inStock: boolean;
    originalPrice: bigint;
    subcategory: string;
    name: string;
    description: string;
    category: string;
    price: bigint;
}
export interface OrderItem {
    name: string;
    productId: bigint;
    quantity: bigint;
    price: bigint;
}
export interface NewOrder {
    customerName: string;
    total: bigint;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    total: bigint;
    createdAt: bigint;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface Category {
    name: string;
    subcategories: Array<string>;
}
export interface UserProfile {
    name: string;
    address: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(productId: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(newOrder: NewOrder): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProductsByName(searchTerm: string): Promise<Array<Product>>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
