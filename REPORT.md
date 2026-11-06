# REPORT.md — 10X Shop (Graduation Project)

## 1. Project Overview

**10X Shop** is a responsive single-page online shop developed as an individual graduation project for the **10X Front-end** course.

The application allows users to browse products retrieved from the DummyJSON API, search and filter the catalog, view product details, manage a shopping cart, log in through a simulated authentication flow, and place an order through a simulated checkout process.

The project followed a CORE-first approach. The required CORE functionality was implemented first, followed by selected FULL features within the available development time. The final application includes catalog search, category filtering, sorting, pagination, URL-synchronized catalog state, request cancellation, centralized API handling, and lazy-loaded routes.

**Repository:** https://github.com/TarAndr/10X-Shop-AnTar

**Live Demo:** https://10-x-shop-antar.vercel.app/

## 2. Planned vs. Delivered

### 2.1. CORE Requirements

| Module | Planned CORE scope | Delivered |
|---|---|---|
| React | Functional components, props, children composition, hooks, lists with stable keys, Context, controlled forms, React Router | Completed |
| TypeScript | Strict mode, application data types, typed component props, type checking | Completed |
| Tailwind CSS v4 | Utility-based styling, Flexbox, Grid, responsive layout, interactive states | Completed |
| Optimization and quality | Responsive layouts, Error Boundary, loading/error/empty states, debugging log, Lighthouse testing, browser checks | Completed |
| Practical project | Public repository, meaningful Git history, README, PLAN, REPORT, deployment with SPA routing | Completed |

The CORE implementation includes the product catalog, product details, shopping cart, simulated authentication, protected checkout, and local order confirmation. The application was deployed to Vercel, with SPA routing configured to support direct access to nested routes.

### 2.2. FULL Features

Selected FULL features were implemented after the CORE functionality had been completed.

**Additional functionality delivered:**

- Debounced product search.
- Category filtering.
- Sorting by price, rating, discount, and title.
- Pagination using the DummyJSON API.
- URL synchronization for search, category, sorting, and pagination state.
- Request cancellation using `AbortController`.
- Catalog retry action after a failed request.
- Centralized API handling through `ApiClient` and `ApiError`.
- Generic `AsyncState<T>` and type guards.
- Tailwind CSS v4 theme tokens defined through `@theme`.
- Lazy-loaded routes using `React.lazy` and `Suspense`.
- Toast notifications for relevant cart interactions.

**FULL backlog items not implemented:**

- Separate reusable `useDebounce` and `useFetch` custom hooks. Debouncing is implemented directly in the catalog logic.
- Cart state refactoring with `useReducer`.
- Promo codes.
- Product reviews and related products.
- Dark mode and theme switching.
- Orders and Profile pages.
- Memoization and performance optimization based on profiling.
- Formal Safari/Edge compatibility testing and a separate accessibility audit.
- GitHub Projects board, labelled Issues, Pull Requests, weekly progress notes, and a demo video.

The implemented and unimplemented features are also documented in `PLAN.md` and `README.md`.

## 3. Technical Implementation

### 3.1. Technology Stack

- **Vite 8** — development server and production build.
- **React 19** — component-based user interface.
- **TypeScript** — strict static typing.
- **React Router 8** — client-side routing and protected routes.
- **Tailwind CSS v4** — responsive utility-based styling and custom theme tokens.
- **DummyJSON API** — external product data.
- **ESLint** — code quality and linting.
- **Vercel** — application deployment.

### 3.2. Application Architecture and Functionality

The application uses a shared layout and client-side routing. Route-level pages are loaded lazily through `React.lazy` and `Suspense`. An Error Boundary provides a fallback interface if an unexpected rendering error occurs.

The final route configuration is:

| Route | Purpose |
|---|---|
| `/` | Redirects to `/products` |
| `/products` | Product catalog |
| `/products/:id` | Product details |
| `/cart` | Shopping cart |
| `/login` | Simulated login |
| `/checkout` | Protected checkout |
| `*` | Not Found page |

**Catalog and API**

Product data is retrieved from the DummyJSON API through the application's API layer. The catalog supports debounced search, category filtering, sorting, and pagination. Catalog parameters are synchronized with the URL through `useSearchParams`, allowing the current catalog state to be restored when navigating to a URL.

API requests are centralized through `ApiClient`. The custom `ApiError` class represents HTTP request failures, while the generic `AsyncState<T>` type provides an explicit representation of asynchronous states. Type guards are used to validate external or stored data where appropriate.

`AbortController` is used to cancel obsolete requests, particularly when search input changes before an earlier request has completed. The catalog also provides a Retry action when loading fails.

**Shopping cart**

The cart is managed through React Context and immutable state updates. Cart data is persisted in `localStorage` under the `shop_cart` key. The header badge, item quantities, and calculated totals are derived from the shared cart state.

Quantity limits are checked against available stock. Discounted unit prices are rounded consistently before being used in cart calculations.

**Authentication**

Authentication is simulated locally through `AuthContext`. The username is stored in `localStorage` under the `shop_user` key so that the simulated login state survives page reloads. Passwords and authentication tokens are not stored.

The Checkout route is protected. A guest who opens it is redirected to the login page and returned to the requested route after successful simulated login.

**Checkout**

Checkout uses controlled form fields and validation. No real payment processing or backend order submission is performed. A successful simulated order displays a confirmation message and clears the cart.

### 3.3. Quality and Deployment

The following quality measures were implemented:

- Responsive layouts were checked at mobile (375 px), tablet, and desktop sizes.
- Interactive elements include hover, focus, and disabled states.
- An Error Boundary provides a fallback interface and Reload action.
- Loading, error, and empty states are handled in the relevant application flows.
- `DEBUG-LOG.md` documents real development issues, their root causes, fixes, and associated commits.
- Lighthouse testing was performed on the deployed application using the mobile preset in Chrome.
- Browser compatibility checks for Chrome and Firefox were documented in `COMPATIBILITY.md`.
- The application was deployed to Vercel with SPA routing support.
- Direct access to nested application routes and page refreshes were checked.

## 4. Project Metrics

### 4.1. Development Metrics

| Metric | Result |
|---|---:|
| Git commits across all refs | 61 |
| Pull Requests | 0 |
| Closed Issues | 0 |
| Estimated development effort | Approximately 57 hours (WBS estimate) |
| CORE branch | `main` |
| FULL branch | `feature/full-features` |
| Production build | Successful |

The project used separate branches for the CORE implementation and additional FULL functionality. The `main` branch contains the CORE version, while `feature/full-features` contains the extended implementation.

The total commit count was obtained using `git rev-list --count --all`. Pull Requests and GitHub Issues were not used. Development changes were recorded through Git commits on the relevant branches.

The estimated development effort was reconstructed from the original Work Breakdown Structure in `PLAN.md`. It is an approximate planning estimate rather than an exact time-tracking record.

### 4.2. Time by Epic

| Epic | Description | Estimated time |
|---|---|---:|
| 1 | Setup and documentation foundation | 4 h |
| 2 | Types and layout/routing | 5 h |
| 3 | Authentication | 5 h |
| 4 | Catalog | 7 h |
| 5 | Product details | 6 h |
| 6 | Cart | 8 h |
| 7 | Checkout | 7 h |
| 8 | Quality assurance | 9 h |
| 9 | Deployment, documentation, and submission | 6 h |
| | **Total** | **57 h** |

The actual time spent on individual tasks may differ from these estimates.

### 4.3. Production Build

The final production build was generated successfully using `npm run build`. Vite transformed 115 modules and produced the following assets:

| Asset | Size | Gzip |
|---|---:|---:|
| All JavaScript chunks combined | 296.23 kB | 95.32 kB |
| Main JavaScript chunk | 267.11 kB | 85.03 kB |
| CSS | 22.11 kB | 5.26 kB |
| HTML | 0.68 kB | 0.41 kB |
| Favicon SVG | 0.53 kB | 0.38 kB |

The JavaScript output is split into multiple files because route-level lazy loading is implemented. The combined JavaScript size represents the sum of the generated JavaScript assets; the main chunk is listed separately for reference.

### 4.4. Lighthouse Result

Lighthouse testing was performed on the deployed application using the mobile preset in an incognito Chrome session.

| Metric | Final optimized result |
|---|---:|
| Performance | 75 |

The optimization work included prioritizing the first catalog product image so that the likely Largest Contentful Paint image could be requested earlier.

The final optimized Lighthouse report is stored in `docs/lighthouse/`.

## 5. Three Most Difficult Problems and Their Solutions

### 5.1. Invalid Interactive Element Nesting

**Problem:** The product card contained interactive elements nested in a way that violated the expected HTML content model. This could lead to incorrect interaction behaviour.

**Root cause:** Product navigation and the Add to Cart action were combined within an unsuitable interactive structure.

**Solution:** Product navigation and the cart action were separated into independent interactive elements.

**Fix commit:** `a9303821bbc86e31ab5f1eb69be59afac10e4943`

**Lesson learned:** Interactive elements should have clearly separated responsibilities and valid HTML structure. This makes the interface more predictable and improves accessibility.

### 5.2. Cart Total Rounding Discrepancy

**Problem:** Displayed cart totals could differ because discounted prices were rounded at different stages of the calculation.

**Root cause:** The unit price used for display and the value used to calculate the cart total did not follow the same rounding sequence.

**Solution:** The cart calculation was changed to use the rounded discounted unit price before multiplying it by the item quantity.

**Fix commit:** `bd832b09210e4184d5b7f169714bf91c799a055a`

**Lesson learned:** Financial calculations should use a consistent rounding strategy. The same unit-price calculation must be used in both individual item displays and cart totals.

### 5.3. Simulated Login State Lost After Reload

**Problem:** The simulated authentication state was lost when the browser page was refreshed.

**Root cause:** The login state existed only in React Context memory and was not persisted between page reloads.

**Solution:** The username was stored in `localStorage` under the `shop_user` key and restored when the authentication context was initialized. Passwords and authentication tokens were not stored.

**Fix commit:** `fec9378e124d3806d75c36248ffc4808ccf57ec9`

**Lesson learned:** React Context is suitable for sharing application state, but persistence across reloads requires a separate storage mechanism when that behaviour is part of the requirements.

### Additional issues documented in DEBUG-LOG.md

Other issues were also investigated and fixed during development:

- Incorrect handling of product API errors, where a failed request could lead to an inappropriate Not Found state. The error handling was corrected in the product page.
- Horizontal layout shifts caused by the vertical scrollbar appearing and disappearing. A persistent vertical scrollbar was configured to stabilize the page width.

These additional fixes are recorded in `DEBUG-LOG.md` with their associated commits.

## 6. What I Would Do Differently

If I started this project again, I would make several improvements to the development process:

1. **Add automated tests earlier.** I would introduce unit tests for utility functions and cart calculations, followed by integration tests for authentication and checkout flows. This would help detect regressions before manual testing.

2. **Measure performance earlier.** I would run Lighthouse during the initial implementation and after major UI changes, rather than concentrating performance work near the end.

3. **Improve the GitHub workflow.** Even for an individual project, I would use Issues to track tasks and Pull Requests for larger changes. This would provide a clearer development history and make code review easier.

4. **Improve API resilience.** I would consider a local fallback dataset and more explicit API error handling so that the application remains easier to demonstrate if the external API is unavailable.

5. **Expand browser testing.** I would include Safari and Edge in addition to Chrome and Firefox, and add automated cross-browser checks where practical.

These improvements would make the development process more measurable and the application easier to maintain and extend.

## 7. AI Usage Summary

AI tools were used as development assistance throughout the project.

- AI assistance was used to clarify requirements, organize the implementation plan, and break the work into manageable tasks.
- AI was used to explain React, TypeScript, Context, routing, form validation, API handling, and state-management concepts.
- AI assistance helped investigate implementation problems, review error causes, and identify possible fixes.
- AI was used to review Lighthouse results and suggest performance improvements.
- AI helped prepare and refine project documentation, including README, PLAN, DEBUG-LOG, and this report.
- Suggestions that would expand the scope beyond the project requirements, introduce unnecessary dependencies, or conflict with the project specification were not adopted without review.

The final implementation and technical decisions were reviewed against the project requirements. The code and its design decisions must be explainable by the author during the defense.

## 8. Final Conclusion

The 10X Shop graduation project was completed with the required CORE functionality and a selected set of additional FULL features.

The application provides a product catalog, product details, shopping cart, simulated authentication, protected checkout, and local order confirmation. The extended catalog functionality includes debounced search, category filtering, sorting, pagination, URL-synchronized state, and request cancellation.

The project uses React Context for shared application state, TypeScript strict mode for static type checking, Tailwind CSS v4 for responsive styling, and a centralized API layer for communication with DummyJSON. Route-level lazy loading and an Error Boundary provide additional application structure and error handling.

The application was successfully built and deployed to Vercel. The final optimized Lighthouse Performance score was 75. The repository also includes project documentation, a debugging log, Lighthouse results, and a browser compatibility report.

The remaining FULL backlog, including reviews, related products, promo codes, Orders/Profile pages, and dark mode, was not implemented. These limitations are documented rather than presented as completed functionality.

The final result is a functional and deployed online shop that meets the CORE project scope and includes selected additional features implemented within the available development time.
