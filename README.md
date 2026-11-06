# README.md — 10X Shop (Graduation Project)

A single-page online shop built as an individual graduation project for the **10X Front-end** course. Users can browse and search products from the DummyJSON API, filter and sort the catalog, view product details, manage a shopping cart, log in (simulated) and place an order (simulated).

> **Note:** Login and Checkout are local simulations by design. There is no real authentication, no server and no payment processing, and no card data is ever collected or stored.

**Live demo:** [https://10-x-shop-antar.vercel.app/](https://10-x-shop-antar.vercel.app/)

**Repository:** [`10X-Shop-AnTar`](https://github.com/TarAndr/10X-Shop-AnTar)

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

- **Catalog**: products loaded from DummyJSON and displayed as cards in a responsive grid. Each card shows a thumbnail, title, category and brand, discounted price with the original price crossed out, a discount badge, rating and a stock badge (`In stock`, `Only N left!`, `Out of stock`).
- **Loading, error and empty states** on pages that fetch data. API failures show readable messages and do not crash the application.
- **Product details** (`/products/:id`): image gallery with thumbnail switching, price, rating, stock status and description. An invalid or unknown id (`/products/abc`, `/products/999999`) shows the Not Found page.
- **Quantity selector** on the product page, limited between 1 and the available stock.
- **Shopping cart**: add items from the catalog or the product page, change quantity, remove items, clear the cart, and see subtotal and total. The cart is shared through React Context, so the header badge and the cart page always agree. Cart data is kept in `localStorage`, so it survives a page reload.
- **Toast notifications** provide feedback for relevant cart interactions.
- **Simulated login**: controlled form with validation. The login state lives in a React Context. Logging out does not clear the cart.
- **Protected checkout**: a guest who opens `/checkout` is redirected to `/login` and returned to `/checkout` after logging in.
- **Checkout**: controlled form with validation and an order summary. After a valid submit, the order is confirmed locally ("Thank you! Your order has been placed."), the cart is cleared and the badge resets.
- **404 page** for unknown routes, and scroll-to-top on navigation.
- **Responsive layout** (mobile-first) that works at 375 px and up without horizontal scrolling.
- **Error Boundary**: an unexpected rendering error shows a fallback screen with a *Reload* button instead of a blank page.

### Optional features (FULL)

- [X] Category filter, sorting and pagination with state stored in the URL (`useSearchParams`)
- [X] Search with debounce and URL state
- [X] Request cancellation with `AbortController`
- [X] Retry button after a failed catalog request
- [X] Lazy-loaded routes (`React.lazy` + `Suspense`)
- [X] Custom Tailwind theme tokens (`@theme`)
- [X] API abstraction with `ApiClient` and `ApiError`
- [X] Type guards and discriminated union `AsyncState<T>`
- [ ] Related products on the product page
- [ ] Product reviews
- [ ] Cart reducer (`useReducer`) and promo code

### Intentionally not included

Real authentication, real payments, a backend, order history and user profile are outside the scope of this project. Related products and product reviews have not been implemented.

---

## Tech stack

| Area | Technology |
|---|---|
| Build tool | [Vite](https://vite.dev/) |
| UI library | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) in `strict` mode |
| Routing | [React Router](https://reactrouter.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) via the `@tailwindcss/vite` plugin |
| Data source | [DummyJSON](https://dummyjson.com/) products API |
| API layer | `ApiClient`, `ApiError`, typed API functions |
| State | `useState`, `useEffect`, React Context, `useSearchParams` |
| Async state | Discriminated union `AsyncState<T>` |
| Request management | `AbortController` |
| Code splitting | `React.lazy` and `Suspense` |
| Linting | ESLint with `typescript-eslint` and `eslint-plugin-react-hooks` |
| Hosting | Vercel |

No UI kits, form libraries or external state-management libraries are used.

---

## Getting started

### Requirements

- A current LTS version of [Node.js](https://nodejs.org/) (20 or newer) and npm

### Install and run

```bash
git clone https://github.com/TarAndr/10X-Shop-AnTar.git
cd 10X-Shop-AnTar
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
| `lint` | `eslint .` | Lints the source code |

---

## Routes

All pages are rendered inside one shared `Layout` (header, `<Outlet />`, footer). The catalog is available at `/products`; the root route redirects to it.

| Route | Page | Access |
|---|---|---|
| `/` | Redirects to `/products` | Public |
| `/products` | Catalog | Public |
| `/products/:id` | Product details | Public |
| `/login` | Login | Public |
| `/cart` | Cart | Public |
| `/checkout` | Checkout | Requires login (guests are redirected to `/login`) |
| `*` | Page not found | Public |

Catalog search, category, sorting and pagination settings are reflected in URL query parameters. This allows catalog state to be preserved in the URL and shared through a link.

---

## Architecture

### Folder structure

```text
src/
├── api/          # API client and functions that communicate with DummyJSON
├── types/        # Domain types: Product, CartItem, AuthUser, AsyncState, ...
├── context/      # AuthContext and CartContext (providers and hooks)
├── components/   # Reusable UI: Header, Footer, ProductCard, ProductGrid, ErrorBoundary, ...
├── pages/        # Route-level pages: CatalogPage, ProductPage, CartPage, CheckoutPage, LoginPage, NotFoundPage
├── routes/       # Route configuration and ProtectedRoute
└── utils/        # Pure helpers: formatting, calculations, validation and type guards
```

### Data flow

User actions call event handlers, which update state through `useState` or a Context function. React then re-renders the affected components from the new immutable state.

Data is fetched through the API layer. `ApiClient` handles HTTP requests, while API functions provide typed access to product data. Asynchronous operations use the `AsyncState<T>` discriminated union to represent loading, success and error states. Requests can be cancelled with `AbortController`, preventing outdated search requests from updating the interface.

Catalog search, category filtering, sorting and pagination are synchronized with URL query parameters through `useSearchParams`. This keeps the catalog state navigable and shareable.

Shared application state is kept in two Contexts: `AuthContext` (who is logged in) and `CartContext` (cart items and the actions that change them), so components do not need to pass this data down through many levels of props.

Route-level pages are loaded lazily with `React.lazy` and rendered through `Suspense`.

### Key design decisions

- **Derived values are calculated, not stored.** The cart total, subtotal and header badge are computed from the list of items, so they cannot get out of sync.
- **Immutable updates only.** Cart changes use `map`, `filter` and the spread operator and never mutate existing state.
- **One source of truth for types.** Domain types are centralized in `src/types/`.
- **Stock is respected everywhere.** The product page and the cart never allow a quantity above the available stock.
- **URL as catalog state.** Search, category, sorting and pagination parameters are synchronized with the URL.
- **Requests are cancellable.** `AbortController` prevents obsolete requests, particularly during search input changes, from updating the current catalog state.
- **Persistence is limited.** The cart and simulated login state are stored in `localStorage` (`shop_cart` and `shop_user`). No passwords or payment details are stored.
- **Shared API handling.** HTTP request logic and API errors are centralized in `ApiClient` and `ApiError`.

---

## Data and API

The app uses the public [DummyJSON](https://dummyjson.com/docs/products) API.

| Request | Used for |
|---|---|
| `GET /products` | Product catalog |
| `GET /products/{id}` | Product details |
| `GET /products/search?q={query}` | Product search |
| `GET /products/categories` | Available product categories |
| `GET /products/category/{category}` | Products belonging to a category |

Catalog requests also use query parameters for pagination (`limit`, `skip`) and sorting (`sortBy`, `order`).

Search, category filtering, sorting and pagination are coordinated by the catalog page and reflected in the URL.

**Price calculation.** The discounted price is `price × (1 − discountPercentage / 100)`, rounded to two decimals and formatted as US dollars (for example `$1,299.00`).

**localStorage keys.**

| Key | Content |
|---|---|
| `shop_cart` | Cart items (product id, title, thumbnail, price, discount, stock and quantity) |
| `shop_user` | Simulated authenticated user's username |

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
- A custom Tailwind theme defines reusable design tokens through `@theme`.

---

## Error handling and debugging

- **API errors** are handled by `ApiClient` and represented by `ApiError`. API failures are displayed as readable messages.
- **Catalog retry**: if a catalog request fails, the user can retry loading products without manually refreshing the page.
- **Request cancellation**: obsolete requests are cancelled with `AbortController`, reducing unnecessary work during search.
- **Invalid product ids**: product ids that are not positive integers are handled without sending an invalid request. Unknown product ids show the Not Found page.
- **Async state handling**: `AsyncState<T>` represents the loading, success and error states explicitly.
- **Error Boundary** wraps the application and shows `Something went wrong.` with a *Reload* button if a component throws while rendering.
- **TypeScript** runs in `strict` mode with `noUnusedLocals`, `noUnusedParameters` and `noFallthroughCasesInSwitch`.
- Real bugs found during development, with their causes and fixes, are documented in [`DEBUG-LOG.md`](./DEBUG-LOG.md).

---

## Deployment

The app is a single-page application, so the hosting platform must serve `index.html` for every path. Otherwise opening a link such as `/products/5` directly, or refreshing the page, returns a 404 from the server.

- **Vercel:** `vercel.json` contains a rewrite from `/(.*)` to `/index.html`.

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

A walkthrough covering the core and FULL catalog functionality:

1. Open `/products` and check that products load.
2. Enter a search term and check that the results update after a short delay.
3. Change the category and verify that only products from that category are displayed.
4. Change the sorting option and check that the product order changes.
5. Navigate between catalog pages and verify that the `page` query parameter changes in the URL.
6. Copy a catalog URL containing search, category, sorting or pagination parameters and open it in a new tab. Check that the corresponding catalog state is restored.
7. Open a product, change the quantity and click **Add to cart**.
8. Check that the cart badge in the header increases and that a toast notification appears.
9. Open the cart, change the quantity, remove an item and check that the total updates.
10. Click **Proceed to checkout** as a guest and check that you land on the login page.
11. Try to submit the empty login form and check the error messages, then log in.
12. Check that you are returned to the checkout page.
13. Submit the empty checkout form, check the errors, then fill in valid data and place the order.
14. Check the confirmation message and that the cart and badge are empty.
15. Open `/products/999999` and `/anything` and check that the Not Found page appears.
16. Reload `/products/5` on the live site and check that it opens directly.
17. Reduce the browser width to 375 px and check every page.

If the catalog request fails, check that an error message and a **Retry** button are displayed.

---

## Known limitations

- Login is a local simulation. The username is persisted in localStorage, but there is no real authentication or server-side session management.
- The order is only confirmed on screen; orders are not stored or listed anywhere.
- The product data comes from a public test API and may change or be slow.
- Related products and product reviews have not been implemented.
- A cart reducer and promo code functionality have not been implemented.
- Features listed as not included above are outside the current project scope.

---

## Project documents

| File | Purpose |
|---|---|
| [`PLAN.md`](./PLAN.md) | Project plan: scope, work breakdown, risks and definition of done |
| [`REPORT.md`](./REPORT.md) | Final report: planned vs delivered, metrics, hardest problems |
| [`DEBUG-LOG.md`](./DEBUG-LOG.md) | Real bugs found and fixed, with the tools used |

---

## Credits

- Product data: [DummyJSON](https://dummyjson.com/)
- Built with [Vite](https://vite.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [React Router](https://reactrouter.com/) and [Tailwind CSS](https://tailwindcss.com/)
- AI assistance: **Claude** (Anthropic) was used for planning, **ChatGPT** was used for explanations and code review.

Author: **Andrey Tarasenko** · 10X Front-end graduation project · 2026