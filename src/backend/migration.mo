import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    subcategory : Text;
    price : Nat;
    originalPrice : Nat;
    inStock : Bool;
    description : Text;
  };

  type OrderItem = {
    productId : Nat;
    quantity : Nat;
    name : Text;
    price : Nat;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    total : Nat;
    status : Text;
    createdAt : Int;
  };

  type UserProfile = {
    name : Text;
    phone : Text;
    address : Text;
  };

  type OldActor = {
    currentProductId : Nat;
    currentOrderId : Nat;
    products : Map.Map<Nat, Product>;
    orders : Map.Map<Nat, Order>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
