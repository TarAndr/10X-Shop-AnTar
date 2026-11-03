# REPORT.md — 10X Shop (Graduation Project)

## 1. Project Overview

**10X Shop** is a responsive single-page online shop built as an individual graduation project for the 10X Front-end course.

The application allows users to browse products retrieved from the DummyJSON API, view product details, manage a shopping cart, log in through a simulated authentication flow, and place an order through a simulated checkout process.

The project was developed with a CORE-first approach. All CORE requirements defined in `PLAN.md` were completed. A limited number of additional FULL features were implemented where time allowed.

**Repository:** `https://github.com/TarAndr/10X-Shop-AnTar`  
**Live Demo:** `https://10-x-shop-antar.vercel.app/`

## 2. Planned vs. Delivered

### 2.1. CORE Requirements

| Module | Planned CORE scope | Delivered |
|---|---|---|
| React | Functional components, props, children composition, hooks, lists with stable keys, Context, controlled forms, React Router | Completed |
| TypeScript | Strict mode, application data types, typed component props, zero typecheck errors, ESLint | Completed |
| Tailwind CSS v4 | Utility-based styling, Flexbox, Grid, mobile-first responsive layout, interactive states | Completed |
| Optimization | Responsive layouts, Error Boundary, loading/error/empty states, debugging log, Lighthouse reports, Chrome and Firefox checks | Completed |
| Practical Project | Public repository, meaningful Git history, README, PLAN, REPORT, deployment with SPA routing | Completed |

All CORE requirements were implemented and checked. The application was deployed to Vercel, and direct access to nested routes was configured through an SPA rewrite.

### 2.2. FULL Features

The project prioritized completion and stability of CORE functionality. Only selected additional features were implemented.

**Additional functionality delivered:**
- Toast notifications for cart interactions.

**FULL backlog items not implemented:**
- Search with debounce, category filtering, sorting, pagination, and URL state.
- `useReducer` cart implementation and promo codes.
- Reviews and related products.
- Custom Tailwind theme tokens and dark mode.
- Orders and Profile pages.
- Lazy-loaded routes, memoization after profiling, and advanced API abstractions.
- Additional development process features such as GitHub Issues, Pull Requests, weekly progress notes, and a demo video.

These items were outside the completed CORE scope and were not required for the project submission.

## 3. Technical Implementation

### 3.1. Technology Stack

- **Vite** — development server and production build.
- **React 19** — component-based user interface.
- **TypeScript** — strict static typing.
- **React Router** — client-side routing and protected routes.
- **Tailwind CSS v4** — responsive utility-based styling.
- **DummyJSON API** — external product data.
- **ESLint** — code quality and linting.
- **Vercel** — application deployment.

### 3.2. Application Functionality

The application includes the following routes:

| Route | Purpose |
|---|---|
| `/` | Product catalog |
| `/products` | Redirect to the catalog |
| `/products/:id` | Product details |
| `/cart` | Shopping cart |
| `/login` | Simulated login |
| `/checkout` | Protected checkout |
| `*` | Not Found page |

Product data is retrieved through a typed API function. The catalog and product details pages handle loading and error states.

The cart is managed through React Context and immutable state updates. Cart data is persisted in `localStorage` under the `shop_cart` key. Quantity limits are checked against available stock, and totals are calculated using rounded discounted unit prices.

Authentication is simulated locally through `AuthContext`. The username is stored in `localStorage` under the `shop_user` key so that the simulated login state survives page reloads. Passwords and authentication tokens are not stored.

Checkout uses controlled form fields and validation. No real payment processing or backend order submission is performed. A successful simulated order displays a confirmation message and clears the cart.

### 3.3. Quality and Deployment

The following quality requirements were completed:

- Responsive layouts were checked at mobile (375 px), tablet, and desktop sizes.
- Interactive elements include hover, focus, and disabled states.
- An Error Boundary provides a fallback interface when a component throws an error.
- Loading, error, and empty states were implemented and checked.
- `DEBUG-LOG.md` documents three real development issues and their fixes.
- Lighthouse reports before and after optimization were saved in `docs/lighthouse/`.
- Browser compatibility checks for Chrome and Firefox were documented in `COMPATIBILITY.md`.
- The application was deployed to Vercel with SPA routing support.
- Direct access to nested application routes was checked.

## 4. Project Metrics

### 4.1. Development Metrics

| Metric | Result |
|---|---:|
| Git commits | 42 |
| Pull Requests | 0 |
| Closed Issues | 0 |
| Estimated development time | Approximately 57 hours |
| Production build | Successful |

All changes were committed directly to the `main` branch. Pull Requests and GitHub Issues were not used because the project was developed individually using a direct-commit workflow.

The estimated development time was reconstructed from the original Work Breakdown Structure (WBS) in `PLAN.md`. It is an approximate estimate rather than an exact time-tracking record.

### 4.2. Time by Epic

| Epic | Description | Estimated time |
|---|---|---:|
| 1 | Setup & Docs foundation | 4 h |
| 2 | Types & Layout/Routing | 5 h |
| 3 | Auth | 5 h |
| 4 | Catalog | 7 h |
| 5 | Product details | 6 h |
| 6 | Cart | 8 h |
| 7 | Checkout | 7 h |
| 8 | Quality | 9 h |
| 9 | Deploy, Docs, Submission | 6 h |
| | **Total** | **57 h** |

The actual time spent on individual tasks may differ from these estimates.

### 4.3. Production Bundle

The final production build produced the following bundle sizes:

| Asset | Size | Gzip |
|---|---:|---:|
| JavaScript | 284.69 kB | 87.84 kB |
| CSS | 21.27 kB | 5.07 kB |
| HTML | 0.68 kB | 0.41 kB |
| Favicon SVG | 0.53 kB | 0.38 kB |

The production build completed successfully with 111 modules transformed.

### 4.4. Lighthouse Results

Lighthouse testing was performed on the deployed application using the mobile preset in an incognito Chrome session.

| Metric | Before optimization | After optimization |
|---|---:|---:|
| Performance | 68 | 75 |

The Performance score increased by 7 points after optimization.

The optimization work included prioritizing the first catalog product image so that the likely Largest Contentful Paint image could be requested earlier.

The before and after Lighthouse reports are stored in `docs/lighthouse/`.

## 5. Three Most Difficult Problems and Their Solutions

### 5.1. Invalid Interactive Element Nesting

**Problem:** The product card contained interactive elements nested in a way that violated the expected HTML content model. This could lead to incorrect interaction behavior.

**Root cause:** Product navigation and the Add to cart action were combined within an unsuitable interactive structure.

**Solution:** The product navigation and cart action were separated into independent interactive elements.

**Fix commit:** `a9303821bbc86e31ab5f1eb69be59afac10e4943`

**Lesson learned:** Interactive elements should have clearly separated responsibilities and valid HTML structure. This makes the interface more predictable and improves accessibility.

### 5.2. Cart Total Rounding Discrepancy

**Problem:** The displayed cart totals could differ because discounted prices were rounded at different stages of the calculation.

**Root cause:** The unit price used for display and the value used for calculating the cart total did not follow the same rounding sequence.

**Solution:** The cart calculation was changed to use the rounded discounted unit price before multiplying it by the item quantity.

**Fix commit:** `bd832b09210e4184d5b7f169714bf91c799a055a`

**Lesson learned:** Financial calculations should use a consistent rounding strategy. The same unit-price calculation must be used in both individual item displays and cart totals.

### 5.3. Simulated Login State Lost After Reload

**Problem:** The simulated authentication state was lost when the browser page was refreshed.

**Root cause:** The login state existed only in React Context memory and was not persisted between page reloads.

**Solution:** The username was stored in `localStorage` under the `shop_user` key and restored when the authentication context was initialized. Passwords and authentication tokens were not stored.

**Fix commit:** `fec9378e124d3806d75c36248ffc4808ccf57ec9`

**Lesson learned:** React Context is suitable for sharing application state, but persistence across reloads requires a separate storage mechanism when that behavior is part of the requirements.

## 6. What I Would Do Differently

If I started this project again, I would make several improvements to the development process:

1. **Add automated tests earlier.** I would introduce unit tests for utility functions and cart calculations, followed by integration tests for authentication and checkout flows. This would help detect regressions before manual testing.

2. **Measure performance earlier.** I would run Lighthouse during the initial implementation and after major UI changes, rather than concentrating performance work near the end.

3. **Improve the GitHub workflow.** Even for an individual project, I would use Issues to track tasks and separate branches and Pull Requests for larger changes. This would provide a clearer development history and make code review easier.

4. **Improve API resilience.** I would consider a local fallback dataset and more explicit API error handling so that the application remains easier to demonstrate if the external API is unavailable.

5. **Expand browser testing.** I would include Safari and Edge in addition to Chrome and Firefox, and add automated cross-browser checks where practical.

These improvements would make the development process more measurable and the application easier to maintain and extend.

## 7. AI Usage Summary

AI tools were used as development assistance throughout the project.

- AI assistance was used to clarify requirements, organize the implementation plan, and break the work into manageable tasks.
- AI was used to explain React, TypeScript, Context, routing, form validation, and state-management concepts.
- AI assistance helped investigate implementation problems, review error causes, and identify possible fixes.
- AI was used to review Lighthouse results and suggest performance improvements.
- AI helped prepare and refine project documentation, including README, PLAN, DEBUG-LOG, and this report.
- Suggestions that would expand the scope beyond the CORE requirements, introduce unnecessary dependencies, or conflict with the project specification were not adopted. The final implementation and technical decisions were reviewed against the requirements.

The use of AI did not replace the need to understand the implementation. The project code and its design decisions must be explainable by the author during the defense.

## 8. Final Conclusion

The 10X Shop graduation project was completed according to the CORE scope defined in `PLAN.md`.

The application provides the required product catalog, product details, shopping cart, simulated authentication, protected checkout, and order confirmation flows. It uses React Context for shared state, TypeScript strict mode for type safety, and Tailwind CSS v4 for responsive styling.

The application was successfully built and deployed. The final TypeScript, ESLint, and production build checks completed without errors. Lighthouse Performance increased from 68 to 75 after optimization.

The project also includes the required documentation, a meaningful Git history, a debugging log, Lighthouse reports, and a browser compatibility report.

All CORE requirements were completed. Selected additional functionality was implemented, while the remaining FULL backlog was left outside the project scope to preserve the priority of a stable and complete CORE implementation.