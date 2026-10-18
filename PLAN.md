# PLAN.md — 10X Shop (Graduation Project)

> Individual graduation project, 10X Front-end course. Plan written on **22 Oct 2026**, before any feature code.
> Repository: `10x-shop-AnTar` · Stack: Vite, React 19, TypeScript (strict), React Router, Tailwind CSS v4, DummyJSON API.

## 1. Goal and scope

**Goal.** Build "10X Shop", an online-shop SPA: browse products, view details, manage a cart, log in (simulated) and place an order (simulated). The app must work, be deployed, and I must be able to explain every part of the code at the defense.

**Priority rule.** CORE first and fully finished. FULL only after the CORE checklist is green. BONUS is not planned.

**Hard rules from the PRD that shape the plan**
- Login is a local simulation: React Context only, no real auth, no external auth API. Any non-empty username and a password of 6+ characters are accepted.
- Checkout is a local simulation: controlled form, no payment, no card fields, no `POST /carts/add`.
- No libraries beyond what CORE needs (no form libraries, no state libraries, no UI kits).
- `any` is forbidden; `npm run typecheck` must report 0 errors.
- UI text is in English.
- If the spec is ambiguous or contradicts itself, the CORE/FULL definition wins; if still unclear, ask before building.

### Scope per module

| Module | CORE (must have, pass threshold) | FULL (only if time remains) |
|---|---|---|
| **React** | Functional components, props, `children` composition, `useState`/`useEffect` (with correct deps), `map` + stable `key`, controlled Login/Checkout forms, React Router, AuthContext, CartContext with immutable updates, conditional rendering, lifting state up | Custom hooks (`useDebounce`, `useFetch`), `useReducer` cart, Search/Category/Sort/Pagination with URL state, Reviews, Related products, Promo code, Orders, Profile, Toasts |
| **TypeScript** | `strict`, types for `Product`, `ProductsResponse`, `CartItem`/`CartState`, `AuthUser`, Login and Checkout form values; Props interfaces; `typecheck` = 0; ESLint with `no-explicit-any` | Generics, `ApiClient`/`ApiError`, OOP classes, type guards, discriminated unions, utility types |
| **Tailwind CSS v4** | `@tailwindcss/vite` + `@import "tailwindcss"`, utility styling on Header/ProductCard/Catalog/Product/Cart, Flex/Grid, mobile-first responsive (`md:` changes the grid), `hover:`/`focus:`/`disabled:` | `@theme` token, `@layer`, dark mode |
| **Optimization** | Responsive at 375 px / tablet / desktop with no horizontal scroll, Error Boundary, `DEBUG-LOG.md` (3+ real bugs), loading/error/empty states, Lighthouse before/after report, Chrome + Firefox check | `React.lazy` routes, memoization after profiling, Safari/Edge, a11y audit |
| **Practical project** | Public repo, real Git history, `README.md` (EN), `PLAN.md`, `REPORT.md`, deploy (Vercel/Netlify) with SPA rewrite | GitHub Issues (20+) and Project board, PRs, weekly progress notes, demo video |

### Routes (CORE)

`/` Catalog · `/login` · `/products/:id` · `/cart` · `/checkout` (guest is redirected to `/login`, then returned to `/checkout`) · `*` Not Found.

## 2. Timeline

| Week | Dates | Focus |
|---|---|---|
| 1 | 17–23 Oct | Setup, PLAN.md, types, Layout/Router, Auth + Login, Catalog |
| 2 | 24–30 Oct | Product Details, CartContext, Cart, Checkout, order confirmation |
| 3 | 31 Oct – 6 Nov | Responsive polish, states, Error Boundary, debugging log, deploy, docs, final QA |

**Fixed dates:** theory test **5 Nov** (30 questions, 45 min; React, TypeScript, Tailwind, optimization); repository submission **6 Nov, 23:59 (Georgia time)**; defense **7–8 Nov**. Commits after the deadline are not evaluated.

**Buffer.** 5 Nov is kept free for test revision; 6 Nov is for deploy check and submission only. All CORE work must be finished by **4 Nov**.

## 3. Work breakdown (WBS)

Estimates are in hours and cover coding, testing and committing. Total CORE ≈ 57 h.

### Epic 1 — Setup & Docs foundation (week 1) — ~4 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 1.1 | Create public GitHub repo, first commit with this `PLAN.md` (before feature code) | 0.5 | PLAN.md commit predates feature commits |
| 1.2 | Vite + React + TS template, strict `tsconfig`, scripts `dev`, `build`, `preview`, `typecheck`, `lint` | 1 | `npm run typecheck` and `npm run build` pass |
| 1.3 | Tailwind CSS v4 via `@tailwindcss/vite` | 0.5 | A utility class visibly changes the UI |
| 1.4 | ESLint (typescript-eslint, react-hooks, `no-explicit-any: error`) | 1 | `npm run lint` passes |
| 1.5 | Folder structure (`api/ types/ context/ components/ pages/ routes/ utils/`) | 0.5 | Matches the structure in the spec |
| 1.6 | Start `DEBUG-LOG.md` and `README.md` skeletons | 0.5 | Files exist, filled as I go |

### Epic 2 — Types & Layout/Routing (week 1) — ~5 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 2.1 | Types in `types/`: `Product`, `ProductsResponse`, `CartItem`, `CartState`, `AuthUser`, `LoginFormValues`, `CheckoutFormValues` | 1 | No duplicate model definitions elsewhere |
| 2.2 | `Layout` with `Header`, `<Outlet />`, `Footer`; `NavLink` active state | 1.5 | Header is written once |
| 2.3 | Routes for all CORE paths + `NotFound` page | 1 | Navigation works without page reload |
| 2.4 | `ScrollToTop` | 0.5 | New route opens at the top |
| 2.5 | `utils/format.ts`: `formatPrice`, `discountedPrice` | 1 | Pure, typed functions |

### Epic 3 — Auth (week 1) — ~5 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 3.1 | `AuthContext`: `user`, `isLoggedIn`, `login(username)`, `logout()` | 1.5 | State shared via Context, no prop drilling |
| 3.2 | Login page: controlled fields, `preventDefault`, validation (exact texts: `Username is required`, `Password is required`, `Password must be at least 6 characters`) | 2 | Invalid form does not submit |
| 3.3 | `ProtectedRoute` for `/checkout`; redirect to `/login`, return to `/checkout` after login | 1 | Guest flow works end to end |
| 3.4 | Header Log in / Log out; logout keeps the cart | 0.5 | Cart survives logout |

### Epic 4 — Catalog (week 1) — ~7 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 4.1 | `api/products.api.ts` with typed `fetchProducts` (`GET /products?limit=12&skip=0`) | 1 | Returns `ProductsResponse` |
| 4.2 | `CatalogPage`: `useEffect`, loading / error / empty states | 2 | API failure does not crash the app |
| 4.3 | `ProductCard` (thumbnail, title, price with discount, rating, stock badge, Add to cart) | 2.5 | Works for stock = 0, ≤ 5 and > 5 |
| 4.4 | `ProductGrid` with `map` and `key = product.id`; card opens details | 1 | Responsive grid (1 / 2–3 / 4 columns) |
| 4.5 | `children` composition (e.g. `PageContainer` or `Card`) | 0.5 | At least one real use of `props.children` |

### Epic 5 — Product details (week 2) — ~6 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 5.1 | `ProductPage`: `useParams`, `GET /products/:id`, loading / error | 2 | `/products/1` loads; `id` is in `useEffect` deps |
| 5.2 | Invalid id (`abc`, `999999`) shows NotFound, no console crash | 1 | Both cases handled |
| 5.3 | Image gallery (thumbnail switch via `useState`) and quantity stepper (1 ≤ qty ≤ stock) | 2 | Buttons disabled at the limits |
| 5.4 | Stock status text and Add to cart | 1 | Item appears in the cart; no more than the stock |

### Epic 6 — Cart (week 2) — ~8 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 6.1 | `CartContext`: `addItem`, `removeItem`, `setQuantity`, `clear`, immutable updates, stock limit | 3 | State never mutated |
| 6.2 | Persist cart in `localStorage` (`shop_cart`), safe `JSON.parse` | 1 | Cart survives refresh |
| 6.3 | Cart page: list, quantity change, remove, subtotal/total, empty state | 3 | Totals update instantly |
| 6.4 | Header badge = sum of quantities, hidden at 0 | 0.5 | Matches Cart page |
| 6.5 | Clear cart with confirm | 0.5 | Asks before clearing |

### Epic 7 — Checkout (week 2) — ~7 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 7.1 | Checkout form: Full name, Email, Address, City, all controlled (`value`/`onChange`) | 2 | Errors appear next to the field |
| 7.2 | Validation with exact texts (`Full name must be at least 3 characters`, `Please enter a valid email address`, `Address must be at least 5 characters`, `City is required`) | 1.5 | Invalid submit is blocked |
| 7.3 | Order summary from the cart; empty cart redirects to `/cart` with a message | 1.5 | Total matches Cart page |
| 7.4 | Place order: button disabled during submit, "Thank you! Your order has been placed.", summary shown, cart cleared, badge reset | 2 | Full flow works, no page reload |

### Epic 8 — Quality (weeks 2–3) — ~9 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 8.1 | Responsive pass on all pages at 375 px, tablet, desktop; burger or wrapped nav on mobile | 3 | No horizontal scroll; touch targets ≥ 44 px |
| 8.2 | `hover:`, `focus:`, `disabled:` states on real buttons and inputs | 1 | Visible and demonstrable |
| 8.3 | Error Boundary (class component, fallback "Something went wrong." + Reload) | 1 | Fallback shows when a component throws |
| 8.4 | Loading / error / empty states checked on every data page (use DevTools Offline) | 1 | No crashes |
| 8.5 | `DEBUG-LOG.md`: 3+ real bugs (symptom → reproduction → tool → root cause → fix commit → lesson) | 1.5 | Every entry links to a real commit |
| 8.6 | Lighthouse (mobile, incognito) before/after + short table in REPORT.md; Chrome + Firefox check | 1.5 | Screenshots in `docs/` |

### Epic 9 — Deploy, Docs, Submission (week 3) — ~6 h
| # | Task | Est. | Done when |
|---|---|---|---|
| 9.1 | Deploy to Vercel/Netlify with SPA rewrite (`vercel.json` or `_redirects`) | 1.5 | `/products/5` opens directly and survives refresh |
| 9.2 | Remove `console.log`; final `typecheck`, `lint`, `build` | 0.5 | All three pass |
| 9.3 | `README.md` (EN): About, Features, Tech Stack, Architecture, How to Run, Scripts, Live Demo, Test Account, Credits | 1.5 | A stranger can run the project |
| 9.4 | `REPORT.md`: planned vs delivered, metrics, 3 hardest problems, what I would change, AI-usage summary | 1.5 | Honest and matches the repo |
| 9.5 | Full manual walkthrough: Catalog → Product → Cart → Login → Checkout → confirmation | 0.5 | Works on the live URL |
| 9.6 | Final QA and submit the repo link | 0.5 | Sent before **6 Nov, 23:59** |

### FULL backlog (only after CORE is green, in this order)
1. Search with debounce, category filter, sort, pagination, URL state (`useSearchParams`).
2. `useReducer` cart, promo code `10X10`, Toast.
3. Reviews and Related products.
4. `@theme` design token, dark mode.
5. Orders and Profile pages.
6. `React.lazy` routes, memoization (only after profiling), `ApiClient`/`ApiError`, type guards.
7. Process extras: GitHub Issues (20+), PRs, `docs/progress/week-*.md`, demo video.

If FULL work is started, it goes into separate branches so CORE stays stable and deployable.

## 4. Risks

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| 1 | DummyJSON is slow or unavailable | Catalog and Product pages empty | Clear error state; keep a small local JSON fallback for development and demo; test with DevTools Offline |
| 2 | Time runs out because the project starts late in week 1 | CORE incomplete | Strict CORE-first order; FULL is gated; all CORE finished by 4 Nov; cut anything not in the CORE checklist |
| 3 | Theory test on 5 Nov takes preparation time | Less coding time | No new features after 3 Nov; 5 Nov reserved for revision |
| 4 | SPA routes return 404 on refresh in production | Fails the deploy requirement | Add rewrite config at the first deploy (not at the end); test `/products/5` directly |
| 5 | I cannot explain AI-generated code at the defense | Lost points regardless of a working app | Read and understand each piece before committing; keep notes on key decisions; practice explaining `useEffect` deps, Context, immutable updates, `interface` vs `type` |
| 6 | Scope creep into FULL features | Unfinished CORE | Follow the priority rule; no extra libraries |
| 7 | Cart state bugs (mutation, stale data, stock limits) | Wrong totals | Immutable updates only; test add / change / remove paths manually; log real bugs in `DEBUG-LOG.md` |
| 8 | Missing the submission deadline | Work not evaluated | Submit on 6 Nov before 18:00, not at 23:59 |

## 5. Definition of Done

**For every task**
- Works in the browser with no console errors.
- Typed correctly; no `any`; `npm run typecheck` = 0 errors.
- Styled with Tailwind utilities; looks right at 375 px and on desktop.
- Committed with a meaningful message (`feat:`, `fix:`, `refactor:`, `docs:`) and pushed.
- I can explain the code in my own words.

**For CORE as a whole (final checklist)**
- [ ] `npm install && npm run typecheck && npm run build` succeed; `npm run lint` shows no `any`.
- [ ] Routes work: `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, `*`.
- [ ] Login validation and Context state work; guest is redirected from `/checkout` and returned after login.
- [ ] Catalog loads from DummyJSON with loading / error / empty states.
- [ ] Product details work; invalid id shows NotFound.
- [ ] Cart: add, change quantity, remove, totals; Header badge in sync.
- [ ] Checkout: controlled form, validation, order confirmation, cart cleared.
- [ ] Responsive at 375 px with no horizontal scroll; hover / focus / disabled states present.
- [ ] Error Boundary and `DEBUG-LOG.md` (3+ real bugs) done.
- [ ] Lighthouse before/after saved; Chrome + Firefox checked.
- [ ] Deployed; `/products/5` works on refresh; link is in README.
- [ ] `README.md` (EN), `PLAN.md`, `REPORT.md` in the repo; Git history is real and meaningful.
- [ ] Repository submitted before **6 Nov, 23:59**.

## 6. Decisions and open points

- **Checkout fields.** The spec contains leftover rows from an older 11-field schema (phone, postal code, country, card). By the spec's own priority rule, the CORE definition wins: **four fields** (Full name, Email, Address, City). No card fields at all.
- **Login persistence.** Not required; losing the login on refresh is allowed. Only the cart is stored in `localStorage` (`shop_cart`).
- **Data fetching.** Plain `fetch` inside `useEffect` or a small typed API function; no custom hook or `ApiClient` in CORE.
- **Language of docs.** `PLAN.md` and `README.md` in English; `REPORT.md` in English for consistency.
- **Test account in README.** `emilys / emilyspass` as the spec asks, with a note that any valid input works because Login is simulated.
