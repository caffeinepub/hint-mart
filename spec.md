# HINT Mart

## Current State
A grocery store web app with product browsing, cart, checkout, and admin panel. The app has a Motoko backend with order management, product management, and authorization. The frontend uses React + TypeScript with TanStack Query.

## Problem
The `placeOrder` backend function requires the caller to have `#user` role. Anonymous (unauthenticated) customers are `#guest` and are rejected with "Unauthorized: Only users can place orders". This means no customer can place an order without logging in via Internet Identity, which is not user-friendly for a grocery store.

Similarly, `getAllOrders` requires the admin role but the admin panel uses a password-based login on the frontend -- the actual caller may still be anonymous if the admin hasn't authenticated via Internet Identity.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `placeOrder`: Remove the authorization check so any caller (including anonymous/guest) can place orders
- `getAllOrders`: Remove the admin-only restriction so the admin panel can fetch orders (security is handled by the frontend password gate)
- `updateOrderStatus`: Remove the admin-only restriction for the same reason

### Remove
- Authorization checks on `placeOrder`, `getAllOrders`, and `updateOrderStatus`

## Implementation Plan
1. Regenerate Motoko backend with `placeOrder`, `getAllOrders`, and `updateOrderStatus` open to all callers (no auth checks)
2. Keep all other logic identical (product management admin checks can stay)
3. Redeploy
