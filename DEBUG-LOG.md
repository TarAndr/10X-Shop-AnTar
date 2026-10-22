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
https://github.com/TarAndr/10X-Shop-AnTar/commit/b6a4905

**Lesson learned**

Interactive elements should have distinct, non-overlapping responsibilities. A product card can provide navigation while retaining independent controls for actions such as adding an item to the cart.

