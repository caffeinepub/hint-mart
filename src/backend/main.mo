import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Product = {
    id : Nat;
    name : Text;
    category : Text;
    subcategory : Text;
    price : Nat;
    originalPrice : Nat;
    inStock : Bool;
    description : Text;
  };

  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
    name : Text;
    price : Nat;
  };

  public type Order = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    total : Nat;
    status : Text; // "pending" | "fulfilled" | "cancelled"
    createdAt : Int;
  };

  public type Category = {
    name : Text;
    subcategories : [Text];
  };

  public type NewOrder = {
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    total : Nat;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    address : Text;
  };

  var currentProductId = 16;
  var currentOrderId = 0;

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  let categories = [
    {
      name = "Kirana";
      subcategories = ["Dal", "Rice", "Tomato Ketchup", "Masale"];
    },
    {
      name = "Soft Drinks";
      subcategories = [];
    },
  ];

  let seedProducts = [
    {
      id = 1;
      name = "Moong Dal";
      category = "Kirana";
      subcategory = "Dal";
      price = 120;
      originalPrice = 140;
      inStock = true;
      description = "High quality moong dal";
    },
    {
      id = 2;
      name = "Maaza 1.2 liter";
      category = "Soft Drinks";
      subcategory = "Soft Drinks";
      price = 60;
      originalPrice = 75;
      inStock = true;
      description = "Mango flavored drink";
    },
    {
      id = 3;
      name = "Basmati Rice 5kg";
      category = "Kirana";
      subcategory = "Rice";
      price = 450;
      originalPrice = 500;
      inStock = true;
      description = "Premium basmati rice";
    },
    {
      id = 4;
      name = "Sugar 500gm (चीनी)";
      category = "Kirana";
      subcategory = "Kirana";
      price = 24;
      originalPrice = 25;
      inStock = true;
      description = "Fine granulated sugar";
    },
    {
      id = 5;
      name = "Chat Masala 250gm";
      category = "Kirana";
      subcategory = "Masale";
      price = 170;
      originalPrice = 185;
      inStock = true;
      description = "Spicy chat masala powder";
    },
    {
      id = 6;
      name = "Tomato Ketchup 500gm";
      category = "Kirana";
      subcategory = "Tomato Ketchup";
      price = 90;
      originalPrice = 110;
      inStock = true;
      description = "Thick tomato ketchup";
    },
    {
      id = 7;
      name = "Kashmiri Red Chili Powder 1kg";
      category = "Kirana";
      subcategory = "Masale";
      price = 350;
      originalPrice = 400;
      inStock = true;
      description = "Vibrant red chili powder";
    },
    {
      id = 8;
      name = "Turmeric Powder (Haldi) 1kg";
      category = "Kirana";
      subcategory = "Masale";
      price = 250;
      originalPrice = 300;
      inStock = true;
      description = "Pure turmeric powder";
    },
    {
      id = 9;
      name = "Mirinda 2.25 liter";
      category = "Soft Drinks";
      subcategory = "Soft Drinks";
      price = 85;
      originalPrice = 100;
      inStock = true;
      description = "Orange flavored drink";
    },
    {
      id = 10;
      name = "Fanta 2.25 liter";
      category = "Soft Drinks";
      subcategory = "Soft Drinks";
      price = 90;
      originalPrice = 100;
      inStock = true;
      description = "Fizzy orange drink";
    },
    {
      id = 11;
      name = "7up 2.25 liter";
      category = "Soft Drinks";
      subcategory = "Soft Drinks";
      price = 90;
      originalPrice = 100;
      inStock = true;
      description = "Lemon-lime drink";
    },
    {
      id = 12;
      name = "Pepsi 2.25 liter";
      category = "Soft Drinks";
      subcategory = "Soft Drinks";
      price = 90;
      originalPrice = 100;
      inStock = true;
      description = "Classic cola drink";
    },
    {
      id = 13;
      name = "Basmati Rice 1kg";
      category = "Kirana";
      subcategory = "Rice";
      price = 95;
      originalPrice = 100;
      inStock = true;
      description = "Premium basmati rice";
    },
    {
      id = 14;
      name = "Sugar 1kg (चीनी)";
      category = "Kirana";
      subcategory = "Kirana";
      price = 48;
      originalPrice = 50;
      inStock = true;
      description = "Fine granulated sugar";
    },
    {
      id = 15;
      name = "Chana Dal 500gm";
      category = "Kirana";
      subcategory = "Dal";
      price = 50;
      originalPrice = 63;
      inStock = true;
      description = "Premium chana dal";
    },
    {
      id = 16;
      name = "Chana Dal 1kg";
      category = "Kirana";
      subcategory = "Dal";
      price = 100;
      originalPrice = 125;
      inStock = true;
      description = "Bulk chana dal";
    },
  ];

  for (product in seedProducts.values()) {
    products.add(product.id, product);
  };

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Query Functions (Public - no auth required)
  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.category == category }
    );
    filtered.sort();
  };

  public query func searchProductsByName(searchTerm : Text) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.name.toLower().contains(#text(searchTerm.toLower())) }
    );
    filtered.sort();
  };

  public query func getCategories() : async [Category] {
    categories;
  };

  // Order Management Functions
  public shared ({ caller }) func placeOrder(newOrder : NewOrder) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let order : Order = {
      id = currentOrderId;
      customerName = newOrder.customerName;
      phone = newOrder.phone;
      address = newOrder.address;
      items = newOrder.items;
      total = newOrder.total;
      status = "pending";
      createdAt = Time.now();
    };
    orders.add(currentOrderId, order);
    currentOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // Product Management Functions (Admin Only)
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let newProduct = {
      product with id = currentProductId
    };
    products.add(currentProductId, newProduct);
    currentProductId += 1;
    newProduct.id;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(product.id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.add(product.id, product);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };
};
