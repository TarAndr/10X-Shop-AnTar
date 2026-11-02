### Bug 1 — Invalid interactive element nesting in product cards

**Symptom**

The initial product grid implementation wrapped the entire `ProductCard` component in a React Router `Link`. The card already contained an `Add to cart` button, resulting in a button nested inside a link.

**Steps to reproduce**

1. Open the initial `ProductGrid` implementation.
2. Wrap each `ProductCard` in a `Link` pointing to `/products/:id`.
3. Inspect the rendered HTML or test interactions with the card.
4. Observe that the navigation link contains the cart button.

**Evidence**

The initial component structure placed the `ProductCard`—including its interactive button—inside a `Link`. This created invalid interactive element nesting. No browser console error or automated test failure was recorded.

**Root cause**

Navigation and cart actions were combined into one interactive region instead of being represented by separate interactive elements.

**Fix**

Moved the product details link inside `ProductCard`, restricting it to the product image and title. Kept the `Add to cart` button outside the link and rendered each card directly from `ProductGrid` using `key={product.id}`.

**Fix commit**

`fix: separate product navigation from cart action`

[View commit](https://github.com/TarAndr/10X-Shop-AnTar/commit/a9303821bbc86e31ab5f1eb69be59afac10e4943)

**Lesson learned**

Interactive elements should have distinct, non-overlapping responsibilities. A product card can provide navigation while retaining independent controls for actions such as adding an item to the cart.

---

### Bug 2 — Cart total differs from displayed item subtotal

**Symptom**

The displayed subtotal for a cart item did not match the Order Summary and Total. For example, four units priced at `$69.56` each produced an item subtotal of `$278.24`, while the Order Summary and Total showed `$278.22`.

**Reproduction steps**

1. Add a product to the cart.
2. Set its quantity to four.
3. Open the Cart page and compare the item subtotal with the Order Summary and Total.
4. Proceed to Checkout and compare the Order Summary with the Total.

**Evidence**

The Cart page displayed `$278.24` for the item subtotal and `$278.22` for the Order Summary. The Checkout page also displayed `$278.24` in the Order Summary and `$278.22` as the Total.

**Root cause**

The cart total was calculated using the unrounded discounted unit price, while the displayed item subtotal used the discounted price rounded to two decimal places. This difference in rounding order caused a discrepancy in the final amount.

**Fix**

Updated the cart subtotal calculation to use the shared `discountedPrice()` utility for each item's unit price before multiplying by quantity. This aligns the cart total with the displayed item subtotals.

**Fix commit**

`fix: align cart totals with rounded unit prices`

[View commit](https://github.com/TarAndr/10X-Shop-AnTar/commit/bd832b0)

**Lesson learned**

Monetary calculations must use a consistent rounding strategy across item subtotals, order summaries, and final totals to prevent discrepancies.


### Bug 3 — Login state is lost after page reload

**Symptom**

After logging in, refreshing the page or opening a protected route directly caused the application to treat the user as logged out and redirect to `/login`.

**Reproduction steps**

1. Open the application and log in with valid simulated credentials.
2. Navigate to `/checkout`.
3. Refresh the browser page or open `/checkout` directly.
4. Observe that the application redirects to `/login` instead of preserving the authenticated state.

**Evidence**

Before the fix, the authentication state was stored only in React Context. After a full page reload, the application initialized the user state as `null`, causing `ProtectedRoute` to redirect the user to `/login`.

**Root cause**

The authentication state existed only in memory and was not persisted between page reloads.

**Fix**

Updated `AuthContext` to initialize the authentication state from `localStorage` and persist the simulated username under the `shop_user` key. The stored username is removed on logout. No passwords or authentication tokens are stored.

**Fix commit**

`feat: save isLogged in localStorage`

[View commit](https://github.com/TarAndr/10X-Shop-AnTar/commit/fec9378)

**Lesson learned**

React Context provides shared application state but does not persist it across full page reloads. When persistence is required, the application must explicitly restore the necessary state from a persistent storage mechanism.