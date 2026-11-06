# 10X Shop — Project Plan

**Project period:** 17 October–6 November 2026
**Original plan version:** 1.1, revised 22 October 2026
**Implementation status updated:** 7 November 2026
**CORE target:** 31 October 2026
**Final repository deadline:** 6 November 2026, 23:59 Georgia time

## 1. Project objective

Build and deploy a responsive single-page online shop using React, TypeScript, Tailwind CSS v4, and the DummyJSON API.

The original plan was revised on 22 October 2026 to reflect the remaining project time. The overall project period remained 17 October–6 November. Tasks from 17–21 October were not to be marked complete unless the repository confirmed that they had been done.

This document preserves the original scope, estimates, work breakdown structure, schedule, and risk assessment. The implementation results section records which planned features were actually delivered and which remained outside the completed project scope.

## 2. Scope by module: CORE and FULL

The following matrix describes the original planned scope. CORE represented the required implementation baseline. FULL contained additional features to be considered only after CORE was stable.

| Module             | CORE — required first                                                                                                                                                           | FULL — only after CORE is stable                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Setup / TypeScript | Vite, React, TypeScript strict mode; scripts `dev`, `build`, `preview`, `typecheck`, `lint`; typed props, state, and API data                                                   | Advanced generics, OOP patterns, complex custom hooks                                               |
| Layout / routing   | Shared layout, navigation, React Router, required routes and 404                                                                                                                | Lazy route loading and advanced route optimization                                                  |
| Auth               | Controlled Login form, local simulated authentication with Context; protect Checkout and return after login                                                                     | Expanded auth flow and profile management                                                           |
| Catalog            | DummyJSON products, typed response, loading/error/empty states, reusable cards/grid, stable `key`                                                                               | Search/debounce, filters, sorting, pagination, and URL-backed filter state                          |
| Product            | Product route by ID, invalid/missing ID handling, quantity and Add to Cart                                                                                                      | Reviews and related products                                                                        |
| Cart               | Shared Cart Context, immutable add/update/remove, item count and correct totals                                                                                                 | Advanced persistence or cart rules beyond CORE                                                      |
| Checkout           | Controlled required fields, validation, local simulated confirmation, clear cart after success; no real payment                                                                 | Promo codes, order history, and detailed order pages                                                |
| Orders / Profile   | Not required for CORE unless a specific PRD CORE criterion says otherwise                                                                                                       | Orders list/details, status progression, reorder, profile                                           |
| Responsive UI      | Mobile ≤480px, tablet 481–1024px, desktop >1024px; all implemented pages usable at 375px without horizontal scrolling; hover/focus/disabled states; touch targets at least 44px | Cross-browser matrix and formal accessibility audit                                                 |
| Quality            | Error Boundary class component using `getDerivedStateFromError` and `componentDidCatch`, fallback and Reload; at least 3 real bugs in `DEBUG-LOG.md`; typecheck/build pass      | 5 real bugs with varied categories; performance profiling and Lighthouse before/after               |
| Docs / delivery    | English README, PLAN.md, REPORT.md; meaningful Git history; public repository; working Vercel/Netlify deployment and SPA route refresh                                          | GitHub Projects board, ≥20 labelled Issues, PR workflow, progress notes and expanded commit targets |

**Original priority rule:** do not start FULL features until every CORE acceptance criterion is met. CORE deployment, responsive behaviour, Error Boundary, documentation, and genuine bug records are not optional.

## 3. Work Breakdown Structure (WBS)

Estimates are focused-work estimates from the original plan. They are retained as planning estimates and should not be interpreted as actual time spent.

| ID / Epic                | Tasks                                                                                                                                                             |     Estimate | Window | Definition of Done                                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------: | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| W1 Setup                 | Check Node/npm; create Vite React + TypeScript app; install Router and Tailwind v4; configure scripts and strict TS; verify run/build; create GitHub repo         |        2–3 h | 22 Oct | App starts; Tailwind styles render; required scripts work; initial meaningful commit exists                                                    |
| W2 Planning              | Define scope, WBS, estimates, risks, and DoD in this plan before functional feature code                                                                          |      1–1.5 h | 22 Oct | `PLAN.md` is in repo root and committed; commit date reflects actual work                                                                      |
| W3 App shell             | Folder structure, shared types, Layout/Header/Footer, routes and 404                                                                                              |        3–4 h | 23 Oct | Routes load directly; shared layout renders; unknown route shows 404; typecheck passes                                                         |
| W4 Auth                  | Typed Auth Context; controlled Login; local login/logout; protect Checkout and redirect back after login                                                          |        3–4 h | 24 Oct | Login simulation works; guest is redirected; post-login redirect works; no real authentication is claimed                                      |
| W5 Catalog               | Product/API types; fetch DummyJSON; loading/error/empty states; ProductCard/ProductGrid with props, `map()` and stable `key`                                      |        4–5 h | 25 Oct | Typed data renders; states work; cards navigate to details; no TS errors                                                                       |
| W6 Product               | Fetch product by route ID; handle invalid ID/API errors; quantity selector; Add to Cart                                                                           |        3–4 h | 26 Oct | Valid and invalid product states work; quantity and Add to Cart work                                                                           |
| W7 Cart state            | Cart Context and types; immutable add/update/remove; derive totals                                                                                                |        3–4 h | 27 Oct | Shared state is consistent; repeated products update quantity; totals and badge count are correct                                              |
| W8 Cart page             | Items, empty state, quantity controls, remove action, subtotal/total and Checkout link                                                                            |        2–3 h | 28 Oct | Empty/populated cart work; totals stay synchronized; layout is responsive                                                                      |
| W9 Checkout              | Controlled fields and required validation; simulated order confirmation; clear cart after success                                                                 |        3–4 h | 29 Oct | Invalid fields are blocked; valid form confirms order; cart clears after success; no real payment                                              |
| W10 Integration / errors | Integrate main flow; class Error Boundary and fallback/Reload; test intentional render error during development                                                   |        3–4 h | 30 Oct | Main flow works; fallback is demonstrated; first genuine bug is logged                                                                         |
| W11 CORE freeze / QA     | Check all implemented pages at 375px and desktop; interactive states, 404, route refresh, console and forms; record 3 genuine bugs and fixes                      |        4–5 h | 31 Oct | CORE checklist passes; no horizontal scroll at 375px; typecheck/build pass; ≥3 real bug entries include required evidence and fix commit links |
| W12 CORE reserve         | Fix CORE blockers and regressions only                                                                                                                            |    Up to 4 h | 1 Nov  | No known CORE-blocking defects; no FULL features started                                                                                       |
| W13 Documentation        | English README; update plan with actual status; REPORT with planned-vs-delivered scope, available metrics, difficult problems, lessons and AI-use summary         |        3–4 h | 2 Nov  | Docs match actual repository; setup instructions and commands are verified                                                                     |
| W14 Deployment           | Deploy to Vercel/Netlify; configure SPA fallback/rewrite; test homepage and direct refresh on nested routes; add live URL to README                               |        2–3 h | 3 Nov  | Public site works; direct refresh on product/cart/checkout does not return host-level 404; repository is public                                |
| W15 Final QA / defense   | Clean install; typecheck/build/lint; test main flows and console; rehearse Context, controlled forms, useEffect, types, immutable updates and responsive Tailwind |        3–4 h | 4 Nov  | Checks pass after clean install; key flows work; implementation can be explained                                                               |
| W16 Theory test          | Sit 30-question, 45-minute test; only low-risk fixes afterward                                                                                                    | As scheduled | 5 Nov  | Test completed; project remains releasable                                                                                                     |
| W17 Submission           | Verify repo URL, README, deployment, branch and final commit; submit before deadline                                                                              |          1 h | 6 Nov  | Correct public repo submitted by 23:59 Georgia time; no unsubmitted changes remain                                                             |

## 3.1. Implementation results

This section records the final implementation status and supplements the original plan. The status below reflects the delivered application, not merely the original feature intentions.

### Implemented CORE functionality

- React application built with Vite and TypeScript strict mode.
- Tailwind CSS v4 configuration and responsive page layouts.
- Shared application layout and navigation.
- Product catalog loaded from the DummyJSON API.
- Product detail pages with route-based product loading.
- Shopping cart managed through React Context, with add, update, and remove operations.
- Cart item count and calculated totals.
- Simulated login using Context and local storage.
- Protected Checkout route and redirect to the requested page after login.
- Checkout form with validation and local order confirmation.
- Cart clearing after successful simulated checkout.
- Error Boundary with fallback and Reload action.
- Loading, error, and empty states in the relevant application flows.
- Persistent cart and simulated authentication state using local storage.
- Public deployment and support for direct navigation to application routes.

Authentication, checkout, and order processing are simulations. The application does not implement a real authentication service, backend order storage, or payment processing.

### Implemented FULL functionality

**Catalog functionality**

- Debounced product search.
- Category filtering.
- Product sorting by price, rating, discount, and title.
- Pagination using the API's `limit` and `skip` parameters.
- Synchronization of search, category, sorting, and pagination state with URL search parameters through `useSearchParams`.
- Search requests sent to the DummyJSON search endpoint.
- Request cancellation using `AbortController` when a request is no longer relevant.
- Retry action for catalog loading errors.
- Search, category, sorting, and pagination state can be represented in the URL and restored through navigation.

**API and data handling**

- Centralized API request handling through `ApiClient`.
- Custom `ApiError` class for API request errors.
- Generic `AsyncState<T>` type for asynchronous state representation.
- Type guards for safer handling of external data and stored values.
- Shared storage key definitions and guarded local storage access.

**UI and application loading**

- Tailwind CSS v4 theme tokens defined through `@theme`.
- Route-level lazy loading using `React.lazy` and `Suspense`.
- Toast notifications for relevant cart interactions.
- Persistent vertical scrollbar to prevent horizontal layout shifts when the scrollbar would otherwise appear or disappear.

### Planned functionality not implemented

The following items were considered in the original FULL scope but were not delivered in the final application:

- Custom `useDebounce` and `useFetch` hooks. Debouncing is implemented directly in the catalog logic; a separate reusable `useDebounce` hook was not created.
- Cart state refactoring with `useReducer`.
- Promo code functionality, including the planned `10X10` code.
- Product reviews.
- Related products.
- Dark mode and theme switching.
- Orders list, order details, and order history.
- Profile management.
- Memoization and performance optimization based on profiling.
- A formal Safari/Edge cross-browser test matrix.
- A separate formal accessibility audit.
- GitHub Projects board, labelled Issues, PR workflow, weekly progress notes, and a demo video.

These items are not represented as completed features in the project documentation.

### Final application routes

The final route configuration differs from the initial route proposal. The table below describes the implemented routing:

| Route           | Behaviour                |
| --------------- | ------------------------ |
| `/`             | Redirects to `/products` |
| `/products`     | Product catalog          |
| `/products/:id` | Product details          |
| `/cart`         | Shopping cart            |
| `/login`        | Simulated login          |
| `/checkout`     | Protected checkout       |
| `*`             | Not Found page           |

## 4. Calendar schedule

The following schedule preserves the original planning checkpoints. It is a record of the intended sequence of work, not a claim that every task was completed exactly on its planned date.

| Date        | Main focus                         | Checkpoint                                                      |
| ----------- | ---------------------------------- | --------------------------------------------------------------- |
| 17–21 Oct   | Original project period            | Verify existing work; do not assume completion without evidence |
| Thu, 22 Oct | Setup and commit `PLAN.md`         | App setup verified; plan committed before feature work          |
| Fri, 23 Oct | App shell, types, routing          | Layout, routes and 404 work                                     |
| Sat, 24 Oct | Login and Auth Context             | Controlled form and Checkout guard work                         |
| Sun, 25 Oct | Catalog and API states             | Typed catalog loads and handles errors                          |
| Mon, 26 Oct | Product details                    | Product route and Add to Cart work                              |
| Tue, 27 Oct | Cart Context and calculations      | Shared immutable state and correct totals                       |
| Wed, 28 Oct | Cart page                          | Empty and populated cart work                                   |
| Thu, 29 Oct | Checkout                           | Validation and simulated confirmation work                      |
| Fri, 30 Oct | Integration and Error Boundary     | Main flow and fallback verified                                 |
| Sat, 31 Oct | CORE freeze and responsive QA      | CORE complete; ≥3 genuine bug records                           |
| Sun, 1 Nov  | CORE reserve                       | Fix blockers/regressions only                                   |
| Mon, 2 Nov  | README, PLAN update, REPORT        | Documentation matches delivered work                            |
| Tue, 3 Nov  | Deployment / production QA         | Live URL and nested-route refresh verified                      |
| Wed, 4 Nov  | Final checks and defense rehearsal | Typecheck/build/lint and key flows pass                         |
| Thu, 5 Nov  | Theoretical test                   | Test completed; no risky refactors                              |
| Fri, 6 Nov  | Final submission                   | Submit by 23:59 Georgia time                                    |

## 5. Risks and mitigations

| Risk                                       | Warning sign / impact                                  | Mitigation and contingency                                                                                                                                                             |
| ------------------------------------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DummyJSON unavailable or response differs  | Catalog/product page fails                             | Implement loading/error/empty states; inspect Network response; keep a small local JSON fixture as a development/test fallback if needed, clearly distinguishing it from live API data |
| CORE slips past 31 Oct                     | Main user flow incomplete by 29–30 Oct                 | Prioritize the minimum complete user journey; stop FULL work; simplify visual polish before cutting required behaviour; use 1 Nov only for blockers                                    |
| TypeScript or routing problems appear late | `typecheck` fails or deployed nested route returns 404 | Run typecheck after each vertical feature; test direct routes locally; reserve 3 Nov for SPA rewrite and production refresh checks                                                     |
| Cart/checkout state becomes inconsistent   | Badge, quantity, total and confirmation disagree       | Keep shared cart logic in Context; use immutable updates and derived totals; test add/update/remove and empty-cart cases                                                               |
| Responsive defects found at the end        | Horizontal scroll or unusable controls at 375px        | Check mobile during each page implementation; audit every implemented route at 375px and desktop                                                                                       |
| Docs/deployment postponed                  | README missing or public site broken                   | Reserve 2–4 Nov for docs, deployment and QA; freeze features after CORE; verify links on 6 Nov                                                                                         |

## 6. Project-wide Definition of Done

A task is done only when its behaviour works, relevant loading/error/empty or validation states are handled, TypeScript types are appropriate, the UI remains usable at required viewport sizes, and the change is recorded in a meaningful Git commit. Rendering once is not sufficient evidence.

CORE is ready only when all applicable CORE requirements in the PRD are implemented and checked, `npm run typecheck` and `npm run build` pass, responsive checks pass, Error Boundary behaviour is demonstrated, `DEBUG-LOG.md` contains at least 3 genuine bugs with the required evidence, and the application is deployed.

For FULL features, completion is determined by the implementation results in Section 3.1. Features listed there as not implemented must not be presented as delivered functionality.

## 7. Release checklist

### CORE

- [x] React + TypeScript strict mode and Tailwind CSS v4 configured
- [x] `dev`, `build`, `preview`, `typecheck`, and `lint` scripts configured and used
- [x] Required routes, shared layout, and 404 work
- [x] Login uses controlled inputs and local simulated authentication
- [x] Catalog uses DummyJSON, typed data, and loading/error/empty states
- [x] Product details and Add to Cart work
- [x] Cart add/update/remove, badge, and totals work
- [x] Checkout validation and local confirmation work
- [x] Error Boundary fallback and Reload implemented
- [x] Implemented pages are usable at 375px without horizontal scrolling
- [x] `DEBUG-LOG.md` contains genuine bugs with symptoms, reproduction details, root causes, fixes, and commit references
- [x] Public repository and deployment are available
- [x] Direct navigation and refresh on application routes are supported

### FULL

- [x] Debounced catalog search
- [x] Category filtering
- [x] Sorting by price, rating, discount, and title
- [x] Pagination
- [x] URL synchronization for catalog state
- [x] Request cancellation with `AbortController`
- [x] Catalog retry action
- [x] Centralized `ApiClient` and `ApiError`
- [x] Generic `AsyncState<T>` and type guards
- [x] Tailwind `@theme` tokens
- [x] Lazy route loading with `React.lazy` and `Suspense`
- [x] Toast notifications for relevant cart interactions
- [ ] Separate `useDebounce` and `useFetch` custom hooks
- [ ] Cart state refactoring with `useReducer`
- [ ] Promo codes
- [ ] Product reviews
- [ ] Related products
- [ ] Dark mode
- [ ] Orders and profile pages
- [ ] Profiling-based memoization
- [ ] Formal Safari/Edge test matrix
- [ ] Separate formal accessibility audit
- [ ] GitHub Projects board, Issues, and PR workflow
- [ ] Weekly progress notes and demo video

### Documentation and submission

- [x] `README.md` updated to describe the implemented application
- [x] `PLAN.md` updated with implementation results
- [x] `REPORT.md` finalized and checked against the repository
- [x] Public repository has meaningful Git history
- [x] Deployment works, including direct refresh on nested routes
- [x] Repository submitted by 6 November 2026, 23:59 Georgia time

## 8. Scope control and honesty of progress

The original scope-control rule required CORE to be stable before starting FULL-only search/debounce, filters, sorting, pagination, Orders/Profile, reviews/related products, promo codes, theme switching, lazy routes, Lighthouse before/after, advanced generics/OOP, or complex custom hooks.

After CORE completion, selected FULL features were implemented according to the available time and project priorities. The final delivered scope is recorded in Section 3.1 and the release checklist.

The project documentation must distinguish between planned, implemented, and unimplemented functionality. Do not claim that a feature was completed unless it exists in the repository and its behaviour has been verified. Do not backdate commits or claim that tasks were completed when they were not.
