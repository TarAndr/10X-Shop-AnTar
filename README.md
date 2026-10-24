# 10X Shop

A single-page online shop built as an individual graduation project for the **10X Front-end** course. Users can browse products from the DummyJSON API, view product details, manage a shopping cart, log in (simulated) and place an order (simulated).

> **Note:** Login and Checkout are local simulations by design. There is no real authentication, no server and no payment processing, and no card data is ever collected or stored.

**Live demo:** TODO: paste your Vercel / Netlify URL here
**Repository:** `10x-shop-{TODO-your-name}`

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Scripts](#scripts)
5. [Routes](#routes)
6. [Architecture](#architecture)
7. [Data and API](#data-and-api)
8. [Forms and validation](#forms-and-validation)
9. [Responsive design and accessibility](#responsive-design-and-accessibility)
10. [Error handling and debugging](#error-handling-and-debugging)
11. [Deployment](#deployment)
12. [Test account](#test-account)
13. [Manual test scenario](#manual-test-scenario)
14. [Known limitations](#known-limitations)
15. [Project documents](#project-documents)
16. [Credits](#credits)

---

## Features

### Core features

- **Catalog**: products loaded from DummyJSON (`GET /products`), shown as cards in a responsive grid. Each card shows a thumbnail, title, category and brand, discounted price with the original price crossed out, a discount badge, rating and a stock badge (`In stock`, `Only N left!`, `Out of stock`).
- **Loading, error and empty states** on every page that fetches data. An API failure shows a readable message and never crashes the app.
- **Product details** (`/products/:id`): image gallery with thumbnail switching, price, rating, stock status and description. An invalid or unknown id (`/products/abc`, `/products/999999`) shows the Not Found page.
- **Quantity selector** on the product page, limited between 1 and the available stock.
- **Shopping cart**: add items from the catalog or the product page, change quantity, remove items, clear the cart, see subtotal and total. The cart is shared through React Context, so the header badge and the cart page always agree. The cart is kept in `localStorage`, so it survives a page reload.
- **Simulated login**: controlled form with validation. The login state lives in a React Context. Logging out does not clear the cart.
- **Protected checkout**: a guest who opens `/checkout` is redirected to `/login` and returned to `/checkout` after logging in.
- **Checkout**: controlled form with validation and an order summary. After a valid submit, the order is confirmed locally ("Thank you! Your order has been placed."), the cart is cleared and the badge resets.
- **404 page** for unknown routes, and scroll-to-top on every navigation.
- **Responsive layout** (mobile-first) that works at 375 px and up with no horizontal scrolling.
- **Error Boundary**: an unexpected rendering error shows a fallback screen with a *Reload* button instead of a blank page.

### Optional features (FULL)

<!-- TODO: keep ONLY the items that are really implemented and working. Delete the rest. -->

- [ ] Category filter, sorting and pagination with the state stored in the URL (`useSearchParams`)
- [ ] Search with debounce and request cancellation (`AbortController`)
- [ ] Retry button on a failed catalog request
- [ ] Related products on the product page
- [ ] Cart reducer (`useReducer`) and promo code
- [ ] Lazy-loaded routes (`React.lazy` + `Suspense`)
- [ ] Custom Tailwind theme token (`@theme`)
- [ ] `ApiClient` / `ApiError` classes, type guards and a discriminated union `AsyncState<T>`

### Intentionally not included

Real authentication, real payments, a backend, order history, user profile and reviews are outside the scope of this project.

---

## Tech stack

| Area | Technology |
|---|---|
| Build tool | [Vite](https://vite.dev/) |
| UI library | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) in `strict` mode (no `any`) |
| Routing | [React Router](https://reactrouter.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) via the `@tailwindcss/vite` plugin |
| Data source | [DummyJSON](https://dummyjson.com/) products API, called with `fetch` |
| State | `useState`, `useEffect`, React Context (auth and cart) |
| Linting | ESLint with `typescript-eslint` and `eslint-plugin-react-hooks` |
| Hosting | Vercel / Netlify (TODO: keep the one you used) |

No UI kits, form libraries or state-management libraries are used.

---

## Getting started

### Requirements

- A current LTS version of [Node.js](https://nodejs.org/) (20 or newer) and npm

### Install and run

```bash
git clone https://github.com/TODO-your-username/10x-shop-TODO-your-name.git
cd 10x-shop-TODO-your-name
npm install
npm run dev
```

The app opens at the address printed in the terminal (by default `http://localhost:5173`).

### Verify before building

```bash
npm run typecheck   # must report 0 errors
npm run lint        # must report no errors
npm run build       # production build into dist/
npm run preview     # serve the production build locally
```

---

## Scripts

| Script | Command | What it does |
|---|---|---|
| `dev` | `vite` | Starts the development server with hot reload |
| `build` | `tsc -b && vite build` | Type-checks the project and creates the production build in `dist/` |
| `preview` | `vite preview` | Serves the production build locally |
| `typecheck` | `tsc` (no emit) | Runs the TypeScript compiler in strict mode without producing files |
| `lint` | `eslint .` | Lints the source code; `any` is forbidden by `@typescript-eslint/no-explicit-any` |

<!-- TODO: check the exact commands in your package.json and adjust the table if they differ. -->

---

## Routes

All pages are rendered inside one shared `Layout` (header, `<Outlet />`, footer).

| Route | Page | Access |
|---|---|---|
| `/` | Catalog | Public |
| `/login` | Login | Public |
| `/products/:id` | Product details | Public |
| `/cart` | Cart | Public |
| `/checkout` | Checkout | Requires login (guests are redirected to `/login`) |
| `*` | Page not found | Public |

---

## Architecture

### Folder structure

```
src/
├── api/          # Functions that talk to DummyJSON (typed fetch helpers)
├── types/        # All domain types in one place: Product, CartItem, AuthUser, ...
├── context/      # AuthContext and CartContext (providers and hooks)
├── components/   # Reusable UI: Header, Footer, ProductCard, ProductGrid, ErrorBoundary, ...
├── pages/        # Route-level pages: CatalogPage, ProductPage, CartPage, CheckoutPage, LoginPage, NotFoundPage
├── routes/       # Route configuration and ProtectedRoute
└── utils/        # Pure helpers: formatPrice, discountedPrice, validation functions
```

<!-- TODO: update the tree so it matches your real folders and files. -->

### Data flow

User actions call event handlers, which update state through `useState` or a Context function. React then re-renders the affected components from the new immutable state. Data is fetched inside `useEffect`, and the loading, error and empty states are rendered with conditional rendering. Shared state is kept in two Contexts: `AuthContext` (who is logged in) and `CartContext` (cart items and the actions that change them), so components do not need to pass this data down through many levels of props.

### Key design decisions

- **Derived values are calculated, not stored.** The cart total, subtotal and header badge are computed from the list of items, so they cannot get out of sync.
- **Immutable updates only.** Cart changes use `map`, `filter` and the spread operator and never mutate existing state.
- **One source of truth for types.** Every domain type lives in `src/types/`; no type is defined twice.
- **Stock is respected everywhere.** The product page and the cart never allow a quantity above the available stock.
- **Persistence is limited.** Only the cart is stored in `localStorage` (key `shop_cart`). The login state is intentionally not persisted and resets on reload.

---

## Data and API

The app uses the public [DummyJSON](https://dummyjson.com/docs/products) API.

| Request | Used for |
|---|---|
| `GET https://dummyjson.com/products?limit=12&skip=0` | Catalog list |
| `GET https://dummyjson.com/products/{id}` | Product details (404 for an unknown id) |

<!-- TODO: add the extra endpoints only if you implemented them (e.g. /products/categories, /products/category/{slug}, /products/search?q=). -->

**Price calculation.** The discounted price is `price × (1 − discountPercentage / 100)`, rounded to two decimals and formatted as US dollars (for example `$1,299.00`).

**localStorage keys.**

| Key | Content |
|---|---|
| `shop_cart` | Cart items (product id, title, thumbnail, price, discount, stock and quantity) |

---

## Forms and validation

Both forms are **controlled** React forms (`value` and `onChange` bound to state) that call `preventDefault()` on submit, so the page never reloads. Error messages appear next to the field they belong to.

### Login

| Field | Rule | Error message |
|---|---|---|
| Username | Required (spaces are trimmed) | `Username is required` |
| Password | Required, at least 6 characters | `Password is required` / `Password must be at least 6 characters` |

### Checkout

| Field | Rule | Error message |
|---|---|---|
| Full name | At least 3 characters after trimming | `Full name must be at least 3 characters` |
| Email | Valid email format | `Please enter a valid email address` |
| Address | At least 5 characters | `Address must be at least 5 characters` |
| City | Required | `City is required` |

While a valid order is being placed, the *Place order* button is disabled to prevent double submission. If the cart is empty, the user is sent back to `/cart` with an explanation.

---

## Responsive design and accessibility

- Styling is done with Tailwind CSS utility classes, mobile-first, using flexbox and grid.
- The product grid changes with the screen width: one column on mobile, two or three on tablet and four on desktop.
- Every page works at **375 px** wide without horizontal scrolling, and interactive elements are large enough to tap.
- Buttons and inputs have `hover:`, `focus:` and `disabled:` states.
- Semantic HTML (`header`, `nav`, `main`, `footer`), `alt` text on images and `label` elements connected to every form field with `htmlFor` and `id`.

---

## Error handling and debugging

- **API errors** are caught and shown as readable messages. Product ids that are not positive integers are handled without a request.
- **Error Boundary** wraps the application and shows `Something went wrong.` with a *Reload* button if a component throws while rendering.
- **TypeScript** runs in `strict` mode with `noUnusedLocals`, `noUnusedParameters` and `noFallthroughCasesInSwitch`.
- Real bugs found during development, with their causes and fixes, are documented in [`DEBUG-LOG.md`](./DEBUG-LOG.md).

---

## Deployment

The app is a single-page application, so the hosting platform must serve `index.html` for every path. Otherwise opening a link such as `/products/5` directly, or refreshing the page, returns a 404 from the server.

- **Vercel:** `vercel.json` contains a rewrite from `/(.*)` to `/index.html`.
- **Netlify:** `public/_redirects` contains `/*  /index.html  200`.

<!-- TODO: keep only the line for the platform you used. -->

To deploy your own copy, import the repository into Vercel or Netlify, use the build command `npm run build` and the output directory `dist`.

---

## Test account

Login is a local simulation, so there is no real account database. The following credentials from the course materials can be used:

| Username | Password |
|---|---|
| `emilys` | `emilyspass` |

Any non-empty username with a password of at least 6 characters is also accepted.

---

## Manual test scenario

A quick walkthrough that covers the main flow:

1. Open the catalog and check that products load.
2. Open a product, change the quantity and click **Add to cart**.
3. Check that the cart badge in the header increases.
4. Open the cart, change the quantity, remove an item and check that the total updates.
5. Click **Proceed to checkout** as a guest and check that you land on the login page.
6. Try to submit the empty login form and check the error messages, then log in.
7. Check that you are returned to the checkout page.
8. Submit the empty checkout form, check the errors, then fill in valid data and place the order.
9. Check the confirmation message and that the cart and badge are empty.
10. Open `/products/999999` and `/anything` and check that the Not Found page appears.
11. Reload `/products/5` on the live site and check that it opens directly.
12. Reduce the browser width to 375 px and check every page.

---

## Known limitations

<!-- TODO: be honest and specific. Examples are below; replace them with your own. -->

- The login state is not saved between page reloads.
- The order is only confirmed on screen; orders are not stored or listed anywhere.
- The product data comes from a public test API and may change or be slow.
- Features listed as not included above are out of scope for this project.

---

## Project documents

| File | Purpose |
|---|---|
| [`PLAN.md`](./PLAN.md) | Project plan: scope, work breakdown, risks and definition of done |
| [`REPORT.md`](./REPORT.md) | Final report: planned vs delivered, metrics, hardest problems |
| [`DEBUG-LOG.md`](./DEBUG-LOG.md) | Real bugs found and fixed, with the tools used |

<!-- TODO: add COMPATIBILITY.md and the docs/lighthouse folder if you created them. -->

---

## Credits

- Product data: [DummyJSON](https://dummyjson.com/)
- Built with [Vite](https://vite.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [React Router](https://reactrouter.com/) and [Tailwind CSS](https://tailwindcss.com/)
- AI assistance: **Claude** (Anthropic) was used for TODO: describe honestly what you used it for (for example planning, explanations, code review), and add anyone else who helped.

Author: **TODO: your name** · 10X Front-end graduation project · 2026
