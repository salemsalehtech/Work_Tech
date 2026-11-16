# Team plan: 10 days to delivery

Six roles, each owning its own folders, so nobody waits for anybody. Everything shared (tokens, UI kit, data layer, store, translations, layout) is already in the repository: build on it from day 1.

Read first: `CLAUDE.md` §7 (architecture and building blocks) and the **WorkTech Design System** (tokens, components, the Pages section and the screens Figma does not have).

## What is ready

| Ready                                        | Where                                                    |
| -------------------------------------------- | -------------------------------------------------------- |
| Design tokens (colors, type, spacing)        | `src/shared/styles/tokens.css`                           |
| UI kit (18 components)                       | `src/shared/components/ui`                               |
| Product card                                 | `src/features/catalog/components/ProductCard`            |
| Requests: products, product, reviews         | `src/features/catalog/api/catalogApi.js`                 |
| Requests: orders (list, one, create, cancel) | `src/features/orders/api/ordersApi.js`                   |
| Requests: accessories                        | `src/features/cart/api/accessoriesApi.js`                |
| Cart math: shipping, promo, totals           | `src/features/cart/model/cartTotals.js` (tested)         |
| Store with localStorage persistence          | `src/app/store`                                          |
| Translations, one file per namespace         | `src/services/i18n/locales/<en and ar>/<namespace>.json` |
| Page frame: header, footer, error page       | `src/app/layout`                                         |
| Routes and link helpers                      | `src/shared/constants/routes.js`                         |
| Architecture checks                          | `npm run lint` fails on a broken import boundary         |

## Roles

| #   | Role                      | Owner | Folders                                                                                                                                    |
| --- | ------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Team lead and integration |       | `src/app`, `src/services`, deployment                                                                                                      |
| 2   | UI kit and content pages  |       | `src/shared/components/ui`, `src/shared/styles`, `src/pages/{About,Contact,Faq,Policies,NotFound}`, `locales/*/content.json`               |
| 3   | Catalog                   |       | `src/features/catalog`, `src/pages/{Products,SearchResults,ProductDetails}`, `locales/*/catalog.json`                                      |
| 4   | Cart and checkout         |       | `src/features/{cart,checkout}`, `src/pages/{Cart,Checkout,OrderSuccess}`, `locales/*/{cart,checkout}.json`                                 |
| 5   | Account and orders        |       | `src/features/{auth,orders,wishlist}`, `src/pages/{Auth,Account,Orders,OrderDetails,Wishlist}`, `locales/*/{account,orders,wishlist}.json` |
| 6   | Smart tools and home      |       | `src/features/{finder,compare}`, `src/pages/{Finder,Compare,Home}`, `locales/*/{finder,compare,home}.json`                                 |

## Day by day

Days 1–3: logic and data with a simple layout. Days 4–7: the final look at 1440, 834 and 390. Day 8: Arabic and RTL, the four states. Day 9: tests and fixes. Day 10: code freeze and deployment.

### 1. Team lead and integration

1. Day 1: host `db.json` on Render (json-server, Node), set `VITE_API_URL` on Vercel, connect Vercel to the repository.
2. Day 1–2: header search: submit goes to `searchPath(q)`.
3. Day 3–6: full header (category row with the current link, short nav for the help pages), mobile menu (`Drawer side="start"`), four-column footer for Home and the catalog, page titles.
4. Every day: review and merge pull requests into `develop` before 11 pm.
5. Day 8–10: read all Arabic text once, write the test report, deploy, freeze.

### 2. UI kit and content pages

1. Day 1–4: build the rest of the kit from the Design System, same names and props: Tabs, Toggle, SegmentedControl, ChoiceList, OptionCards, InstallmentPicker, Breadcrumbs, SectionHeader, Accordion, Toast (with a provider in `AppLayout`, ask the lead), CheckoutStepper, OrderTracker, AccountNav, CompareBar, FilterGroup. Export each one from `ui/index.js` the day it works, even before it is polished.
2. Day 5–7: About, Contact (form with validation), FAQ (Accordion and category filter), Policies (three tabs), Not found.
3. Day 8–9: check every page at 834 and 390 and fix the kit where needed.

### 3. Catalog

1. Day 1–2: filters and sort in the URL (`useSearchParams`) mapped to json-server params; pagination with `_page` and `_limit=9` and `total`.
2. Day 2–3: finish `ProductCard` (tag badges from `tags`). Others already use it: never change its props without telling the group.
3. Day 3–5: Products and Search results (sidebar on desktop, `Drawer` with filters below 1200px, load more, empty and error states).
4. Day 5–7: Product details: gallery, options that change the price (`priceWithOptions`), installment plans, spec tabs, reviews with sort and helpful, similar laptops.

### 4. Cart and checkout

1. Day 1–2: `cartSlice` reducers: add (merge by `cartItemKey`), set quantity (1 to min(stock, 5)), remove, clear, apply promo. Tests next to the slice.
2. Day 3–4: Cart page: lines, "Complete the setup" accessories, promo code, totals with `calcCartTotals`, empty state.
3. Day 5–7: Checkout in three steps with validation (Egyptian mobile 11 digits starting 01; cash on delivery under 50,000), `useCreateOrderMutation`, Order success.

### 5. Account and orders

1. Day 1–2: `authSlice` (demo accounts in localStorage, sign in, sign out, create account), `wishlistSlice` (add with `savedPrice`, remove, price alert).
2. Day 3–4: Sign in and Create account, My account (details, addresses, notifications).
3. Day 5–7: My orders (status chips, search), Order details (tracker, cancel while placed with `useUpdateOrderStatusMutation`), Wishlist.

### 6. Smart tools and home

1. Day 1–2: `compareSlice` (max `MAX_COMPARE_ITEMS`), Finder scoring as pure functions with tests in `features/finder/model/`.
2. Day 3–5: Compare page (stronger value per row, differences only, sticky product row), compare bar on Products (export it from `@features/compare` for role 3), Finder questions and results.
3. Day 5–7: Home: hero, categories, featured with a filter, Finder promo, deals band, brands, newsletter.

## Rules that keep everyone moving

1. **Stay in your folders.** Need something in `app/`, `shared/` or `services/`? Ask the lead in the group, keep working with a `// TODO(lead): …` meanwhile.
2. **Use what exists.** No second button, no own price formatting, no `axios` in components, no hard-coded colors or text. If a component is missing, use the closest one and leave a TODO.
3. **One branch per task**, named `feature/<role-area>-<what>` (for example `feature/cart-promo-code`), from `develop`. Small pull requests, at least one a day.
4. **Every morning:** `git checkout develop && git pull`, then `git merge develop` into your branch.
5. **Before every push** the hook runs lint, format check, tests and build. Fix, never skip.
6. **Shared props are a contract.** Changing a prop of `ProductCard`, a UI kit component or a slice selector needs a message in the group first.

## Definition of done for a page

- Matches the Design System at 1440, 834 and 390 px.
- Works in English and Arabic (RTL), no text outside the locale files.
- Loading, empty, error and success states through `DataState`.
- Keyboard works, focus is visible, images have `alt`, buttons have names.
- Logic has tests; `npm run lint`, `npm run test:run` and `npm run build` pass.
