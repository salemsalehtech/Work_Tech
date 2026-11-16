# CLAUDE.md: WorkTech project context

> This file is read by Claude Code at the start of every session. It explains the project, the plan, the rules and how to work with the team leader. Keep it up to date: when a task is finished or a decision changes, update the relevant section in the same pull request.

---

## 1. How to work with me (read first)

I am **Salem Saleh**, the team leader. I am learning professional React development while leading a team of six, so you are both my engineer and my mentor.

- **Talk to me in Egyptian Arabic.** Keep code, file names, commit messages, comments and documentation in English.
- **Explain before you act.** For every task, first give a short plan: what you will do, which files you will touch and why. Wait for my "go" on anything that creates more than a few files, installs packages, or changes configuration.
- **Teach as you go.** When you introduce a concept (a hook, a Redux slice, a Git command), explain in one or two simple sentences what it is and why we need it here. Do not lecture; keep it short and practical.
- **One task at a time.** Finish, verify and summarize the current task before suggesting the next one.
- **Stay in scope.** Do only what the task asks. If you notice something else that needs doing, list it at the end instead of doing it.
- **Never guess silently.** If something is ambiguous, ask me one clear question. If it is a small, conventional choice, make it and tell me what you chose.
- **Verify your work.** Run the build, lint and tests (when they exist) before saying a task is done, and show me the result.
- **Git safety.** Never `git push`, never use `--force` or `--no-verify`, never commit directly to `main` or `develop`. Work on a feature branch and tell me when it is ready for a pull request.
- **End every task with:** what was done, how to check it, what is left, and the suggested next task.

---

## 2. Project overview

|                |                                                                       |
| -------------- | --------------------------------------------------------------------- |
| **Name**       | WorkTech                                                              |
| **What**       | A laptop e-commerce storefront built with React                       |
| **Tagline**    | Better Tech. Brighter Future.                                         |
| **Program**    | Digital Egypt Pioneers Initiative (DEPI), Round 5, graduation project |
| **Track**      | React Front-End Web Developer                                         |
| **Group**      | ALX5_SWD2_S1                                                          |
| **Instructor** | Eng. Abdelwahab                                                       |
| **Company**    | Skills Dynamix                                                        |
| **Repository** | https://github.com/salemsalehtech/Work_Tech                           |

The old repository `nhahub/NHA-5-046` is no longer used. All work happens in `salemsalehtech/Work_Tech`.

**Goal:** a responsive store where users browse laptops, filter by real specifications, view details, use a cart and complete a simulated checkout. It goes beyond a standard store with tools that help buyers choose: a **Laptop Finder**, **side-by-side Compare**, a **Value Score** and **monthly installments**. It supports **English and Arabic (RTL)** and three screen sizes.

### Scope

**In scope:** the 17 pages in section 6, a mock REST API, cart and wishlist persisted in the browser, demo accounts stored in the browser, English and Arabic, deployment to Vercel.

**Out of scope:** a real backend or database, real payments, real authentication or security, an admin dashboard. Admin and JWT authentication were designed and tested in design v1.1 and are deferred (design doc §13.4).

**Build exactly what is in Figma.** Do not add pages or features that are not in the design.

**Design reference:** `docs/system-analysis-design.pdf` (English) and `docs/system-analysis-design-ar.pdf` (Arabic), version 1.2. Business rules (BR-xx), use cases (UC-xx) and requirements (FR-xx) are defined there.

---

## 3. Team

| #   | Member                         | Role                                        | Branch        |
| --- | ------------------------------ | ------------------------------------------- | ------------- |
| 1   | Salem Saleh                    | Team lead and integration                   | `salem`       |
| 2   | Asmaa Nehad Farouk             | UI kit and content pages                    | `asmaa`       |
| 3   | Wassim Gomaa El-Sakka          | Catalog and product details                 | `wasim`       |
| 4   | Zein El-Din Amr El-Sayed Ahmed | Cart and checkout, Finder scoring           | `zein`        |
| 5   | Abdelrahman Hany Mohamed       | Account, orders and wishlist                | `abdelrahman` |
| 6   | Fares Ahmed Mostafa Slim       | Compare and Home (Salem and Zein on Finder) | `fares`       |

Page owners are in section 6. Each member has a personal guide in `docs/team/`.

---

## 4. Deadlines

| Milestone                               | Deadline        | Status                                          |
| --------------------------------------- | --------------- | ----------------------------------------------- |
| Project Planning & Management           | 16 Oct 2026     | Documentation written                           |
| Requirements Gathering                  | 16 Oct 2026     | Documentation written                           |
| System Analysis & Design                | 6 Nov 2026      | Done (v1.2): `docs/system-analysis-design*.pdf` |
| Implementation (source code)            | **30 Nov 2026** | In progress, team deadline **24 Nov 2026**      |
| Final presentation, testing and reports | **4 Dec 2026**  | Not started                                     |

The schedule is compressed. Protect the core flow first (browse → product → cart → checkout), then the smart tools, then polish.

---

## 5. Tech stack

| Concern         | Choice                                      | Notes                                                                                        |
| --------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Language        | JavaScript                                  | No TypeScript                                                                                |
| Build           | Vite + React 18                             |                                                                                              |
| Routing         | React Router (`createBrowserRouter`)        | 17 routes, lazy-loaded pages                                                                 |
| Shared state    | Redux Toolkit + react-redux                 | Only cart, wishlist, compare, auth                                                           |
| Server data     | RTK Query (part of Redux Toolkit)           | Fetching and caching; no extra package                                                       |
| HTTP            | Axios                                       | One shared client                                                                            |
| Mock API        | JSON Server                                 | Serves `db.json` on port 3001                                                                |
| i18n            | i18next + react-i18next                     | `en` and `ar`, RTL for Arabic                                                                |
| Styling         | CSS Modules + CSS variables (design tokens) | No CSS frameworks, no UI libraries                                                           |
| Lint and format | ESLint (flat config) + Prettier             |                                                                                              |
| Tests           | Vitest + React Testing Library              |                                                                                              |
| Git hooks       | Husky + lint-staged + commitlint            | Conventional Commits                                                                         |
| Checks          | Husky pre-push + Vercel build               | lint, format check, test, build before every push; GitHub Actions not used (account billing) |
| Deploy          | Vercel                                      | Rewrite all routes to `index.html`                                                           |

Do not add a library that is not in this table without asking me first.

---

## 6. Pages (17 + 2 detail screens)

| #   | Page             | Route            | Owner                 |
| --- | ---------------- | ---------------- | --------------------- |
| 01  | Home             | `/`              | Fares                 |
| 02  | Products         | `/products`      | Wassim                |
| 02b | Search results   | `/search?q=`     | Wassim                |
| 03  | Product Details  | `/products/:id`  | Wassim                |
| 04  | Cart             | `/cart`          | Zein                  |
| 05  | Checkout         | `/checkout`      | Zein                  |
| 06  | Order Success    | `/order-success` | Zein                  |
| 07  | Login / Register | `/auth`          | Abdelrahman           |
| 08  | My Account       | `/account`       | Abdelrahman           |
| 09  | My Orders        | `/orders`        | Abdelrahman           |
| 09b | Order details    | `/orders/:id`    | Abdelrahman           |
| 10  | Wishlist         | `/wishlist`      | Abdelrahman           |
| 11  | Laptop Finder    | `/finder`        | Salem (scoring: Zein) |
| 12  | Compare          | `/compare`       | Fares                 |
| 13  | About            | `/about`         | Asmaa                 |
| 14  | Contact          | `/contact`       | Asmaa                 |
| 15  | FAQ              | `/faq`           | Asmaa                 |
| 16  | Policies         | `/policies`      | Asmaa                 |
| 17  | Not Found        | `*`              | Asmaa                 |

**Design reference:** Figma files for all 19 screens at desktop (1440 px), tablet (834 px) and mobile (390 px). The Figma design is the source of truth for layout and spacing. The **WorkTech Design System** artifact (https://claude.ai/artifact/Eu4My81oEnprokYGMEwnMv) holds the measured tokens, every component with its rules, a **Pages** section (what each screen holds, top to bottom) and the screens Figma does not have (loading, empty, error, mobile menu, filter drawer, checkout steps 2–3, Finder results, Create account). Build from it.

**Key features per page:**

- **Products:** filters (brand, price, RAM, processor, graphics, screen, customer rating, in stock only), sort, search, result count, "Load more" with progress, compare tray, star ratings and low-stock labels on cards. Filters and search live in the URL.
- **Product Details:** gallery, spec table, options (memory, storage, warranty) that change the price, installment calculator, rating summary and distribution, reviews with "helpful", Add to cart, Buy now, wishlist, compare.
- **Cart:** quantities, remove, promo code, warranty add-ons, totals, header badge.
- **Checkout:** 3 steps (shipping, payment, review) with validation.
- **My Orders:** list, plus an order detail view with status steps and items.
- **Wishlist:** saved laptops and price-drop alerts.
- **Finder:** 4-question wizard, ranked results with a reason for each.
- **Compare:** up to 3 laptops, best value highlighted, "differences only" toggle.

---

## 7. Architecture

### Folder structure (feature-first)

```
src/
  app/
    App.jsx       # providers
    layout/       # AppLayout, SiteHeader, SiteFooter, RouteError (they read cart and user state)
    router/       # lazyPages.js, routes.jsx
    store/        # store + persistence.js (cart, wishlist, compare, auth in localStorage)
  features/       # one folder per business domain
    catalog/      # catalogApi (products, reviews), ProductCard, filters, product details
    cart/         # cartSlice, accessoriesApi, model/cartTotals.js (shipping, promo, totals)
    checkout/
    orders/       # ordersApi (list, one order, create, cancel)
    auth/         # authSlice (demo accounts)
    wishlist/     # wishlistSlice
    compare/      # compareSlice
    finder/
  pages/          # one folder per page; thin, composes feature components
  services/
    api/          # apiClient (axios), axiosBaseQuery, baseApi (RTK Query)
    i18n/         # i18next setup; locales/<en|ar>/<namespace>.json
  shared/
    assets/brand/ # logo
    components/ui # the UI kit (list below)
    config/       # env.js
    constants/    # routes (PATHS, productPath…), commerce rules, order status
    hooks/
    styles/       # tokens.css (from the Design System), global.css
    utils/        # formatPrice, monthlyInstallment, discountPercent, priceWithOptions, storage
  test/           # setup.js, renderWithProviders.jsx
  main.jsx
public/images/    # product and accessory photos (see public/images/README.md)
```

Each feature folder may contain `api/`, `components/`, `hooks/`, `model/` (pure logic with tests), an optional `<name>Slice.js`, and an `index.js` that is its **public API**.

### Dependency rule (enforced by ESLint)

```
app  ->  pages  ->  features  ->  shared / services
```

- `shared` and `services` never import from `features`, `pages` or `app`.
- A feature imports another feature **only** through that feature's `index.js` (`@features/cart`, never `@features/cart/model/...`).
- Pages import features only through their `index.js`, and never import `app`.
- `npm run lint` fails on any of these, so a broken boundary cannot be committed.

### Building blocks every page uses

| Need                            | Use                                                                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server data                     | A feature API built with `baseApi.injectEndpoints()` (example: `features/catalog/api/catalogApi.js`). Never `axios` in a component.                  |
| The four states of a view       | `<DataState result={query} loading={…} empty={…}>{(data) => …}</DataState>`                                                                          |
| Text                            | `useTranslation('<namespace>')` with keys in `locales/en/<namespace>.json` and `locales/ar/<namespace>.json`. A new file is picked up automatically. |
| Links                           | `PATHS`, `productPath(id)`, `orderPath(id)`, `searchPath(q)` from `@shared/constants`                                                                |
| Prices                          | `<Price>` or `formatPrice(value, i18n.language)`; never format by hand                                                                               |
| Business numbers                | `FREE_SHIPPING_THRESHOLD`, `SHIPPING_FEE`, `MAX_COMPARE_ITEMS`… from `@shared/constants`                                                             |
| Cart, checkout and order totals | `calcCartTotals(items, { promoCode, express })` from `@features/cart`                                                                                |
| Page width                      | `<Container>` (`width="narrow"` for checkout and Finder, `"slim"` for order success)                                                                 |
| Component tests                 | `renderWithProviders(ui, { reducer, route })` from `src/test/renderWithProviders.jsx`                                                                |

**UI kit** (`@shared/components/ui`): Badge, Button, Checkbox, Container, DataState, Drawer, EmptyState, ErrorState, Icon, IconButton, Input, Price, ProductImage, QuantityStepper, Rating, Select, Skeleton, ValueScore. Still to build from the Design System: Tabs, Toggle, SegmentedControl, ChoiceList, OptionCards, InstallmentPicker, Breadcrumbs, SectionHeader, Accordion, Toast, CheckoutStepper, OrderTracker, AccountNav, CompareBar, FilterGroup.

### Where state lives

| Kind of state                     | Where                                 | Example                                          |
| --------------------------------- | ------------------------------------- | ------------------------------------------------ |
| Server data                       | RTK Query endpoints (cache in memory) | Product list, product details, reviews, orders   |
| Shared client state               | Redux Toolkit slice                   | Cart, wishlist, compare, current user            |
| Local UI state                    | `useState` in the component           | Open dropdown, active tab, form fields           |
| Filters, sort, search, pagination | URL search params                     | `/products?brand=asus&ram=16&sort=price`         |
| Persistence                       | localStorage                          | Cart, wishlist, compare, language, demo accounts |

Server data is **never** copied into Redux slices; it lives only in the RTK Query cache (products and reviews kept 5 minutes; orders refetch on open). Cookies are not used.

### Every data-driven view handles four states

**loading**, **success**, **empty** and **error** (with a retry action).

---

## 8. Data and mock API

JSON Server serves `db.json` at `VITE_API_URL` (default `http://localhost:3001`).

| Method | Endpoint                 | Purpose                                                     |
| ------ | ------------------------ | ----------------------------------------------------------- |
| GET    | `/products`              | List, with query params for filter, sort, search and paging |
| GET    | `/products/:id`          | One product                                                 |
| GET    | `/reviews?productId=:id` | Reviews of a product                                        |
| GET    | `/orders?userId=:id`     | Orders of a user                                            |
| GET    | `/orders/:id`            | One order (Order details)                                   |
| POST   | `/orders`                | Create an order                                             |
| GET    | `/accessories`           | Accessories (Cart "Complete the setup"), `?category=`       |

**Product shape (agree before building the catalog):**

```json
{
  "id": "asus-zenbook-14",
  "brand": "ASUS",
  "name": "Zenbook 14 OLED",
  "price": 42999,
  "oldPrice": 46999,
  "currency": "EGP",
  "images": ["/images/products/asus-zenbook-14-1.jpg"],
  "rating": 4.6,
  "reviewsCount": 128,
  "stock": 7,
  "valueScore": 86,
  "specs": {
    "cpu": "Intel Core Ultra 7 155H",
    "ram": 16,
    "storage": 1024,
    "gpu": "Intel Arc",
    "screen": 14,
    "resolution": "2880x1800 OLED",
    "battery": "75 Wh",
    "weight": 1.2,
    "os": "Windows 11",
    "cores": 16,
    "threads": 16,
    "gpuVram": null,
    "gpuTgp": null,
    "refreshRate": 120,
    "panel": "OLED",
    "thickness": 14.9,
    "thunderbolt": "Thunderbolt 4",
    "videoOut": "HDMI 2.0",
    "wifi": "Wi-Fi 7",
    "bluetooth": "5.4",
    "ports": ["2× Thunderbolt 4 (USB-C)", "2× USB-A 3.2", "HDMI 2.0", "3.5 mm jack"],
    "webcam": "1080p FHD",
    "keyboard": "Backlit"
  },
  "options": {
    "memory": [
      { "label": "16 GB", "delta": 0 },
      { "label": "32 GB", "delta": 6000 }
    ],
    "storage": [
      { "label": "1 TB", "delta": 0 },
      { "label": "2 TB", "delta": 5000 }
    ],
    "warranty": [
      { "label": "1 year", "delta": 0 },
      { "label": "3 years", "delta": 2500 }
    ]
  },
  "inTheBox": ["Zenbook 14 OLED", "65 W power adapter", "Quick start guide"],
  "tags": ["ultrabook", "oled"],
  "createdAt": "2026-06-15"
}
```

`gpuVram` and `gpuTgp` are `null` for integrated graphics. `valueScore` is stored 0–100 and shown ÷ 10 ("8.6"). The spec extras (`cores` … `keyboard`, `inTheBox`) are demo values derived from the CPU and GPU family: check them before the final demo.

**Accessory shape** (`/accessories`, ids start with `acc-`):

```json
{
  "id": "acc-logitech-g305",
  "kind": "accessory",
  "category": "mouse",
  "brand": "Logitech",
  "name": "G305 Lightspeed wireless mouse",
  "price": 1290,
  "oldPrice": null,
  "currency": "EGP",
  "images": ["/images/accessories/acc-logitech-g305-1.jpg"],
  "stock": 30,
  "specsLine": "HERO 12K sensor · 99 g · 1× AA",
  "fitsScreen": null,
  "createdAt": "2026-03-10"
}
```

Categories: `mouse`, `sleeve`, `backpack`, `cooling`, `audio`, `hub`, `charger`. `fitsScreen` is the largest screen in inches a sleeve, backpack or cooling pad fits (`null` = any).

**Review shape:** `{ id, productId, userName, city, config, rating, title, body, date, helpful, verified }`. `config` is the configuration the buyer has ("16GB · 512GB").

**Order shape:** `{ id, userId, createdAt, status, items, shipping, payment, totals }`. Each item is `{ productId, kind, name, price, quantity, options }`: `kind` is `"laptop"` (with `options` `{memory, storage, warranty}`, `price` = base + deltas) or `"accessory"` (`options: null`). `totals` is `{ subtotal, shipping, discount, total }`.

**Order status** values and how they show (Figma labels):

| `status`     | Shown as     | Tracker step                       |
| ------------ | ------------ | ---------------------------------- |
| `placed`     | Placed       | 1 of 4 (can be cancelled)          |
| `processing` | Packed       | 2 of 4                             |
| `shipped`    | With courier | 3 of 4                             |
| `delivered`  | Delivered    | 4 of 4                             |
| `cancelled`  | Cancelled    | no tracker (Figma's "Returned" UI) |

Constants live in `src/shared/constants` (`ORDER_STATUS`, `ORDER_STEP_INDEX`, `FREE_SHIPPING_THRESHOLD` …).

**Shipping:** free when the subtotal is **20,000 EGP or more**, else **150 EGP**, in every governorate. Express (next day, Cairo and Giza only) adds 150 EGP on top. Every "free delivery" text in the UI says 20,000. Cash on delivery only for totals under 50,000 EGP.

**Data rule (verified):** every `orders.userId` must match a demo account id and every `reviews.productId` must exist in `products`. JSON Server silently deletes orphan records on any DELETE request. The store never sends DELETE.

If a field needs to change, change it here first, then in `db.json` and the code.

---

## 9. Design system

| Token          | Value                                                                       |
| -------------- | --------------------------------------------------------------------------- |
| `--color-red`  | `#D1040B` (brand, "work" in the wordmark only)                              |
| `--color-sale` | `#C1030A` (sale price, discount badge, Deals, Cancel, Sign out)             |
| `--color-blue` | `#0264CF` (brand, "TECH", primary actions)                                  |
| `--color-gold` | `#F7A909` (stars, Laptop Finder mark, gold buttons with ink text)           |
| `--color-sky`  | `#32B5FD` (illustration accents)                                            |
| `--color-ink`  | `#0B1526` (text, rules, dark surfaces)                                      |
| Text greys     | `#3D4757` body copy, `#556070` muted labels                                 |
| Font           | IBM Plex Sans (text), IBM Plex Mono (labels, numbers), IBM Plex Sans Arabic |
| Radius         | 3 badges, 4 chips, 6 controls, 8 cards. No drop shadows                     |
| Breakpoints    | mobile-first: `>= 834px` tablet, `>= 1200px` desktop (Figma frames at 1440) |

The full token list (37 colors, type scale, spacing, sizes) is `tokens.json` in the Design System artifact; copy it into `src/shared/styles/tokens.css`.

CSS rules:

- Use tokens (`var(--color-blue)`), never hard-coded colors or font sizes.
- Use **logical properties** (`margin-inline-start`, `padding-inline`, `inset-inline-end`) so Arabic RTL works without extra CSS.
- One `Component.module.css` per component.

---

## 10. Conventions

| Thing                      | Convention                                                      | Example                                          |
| -------------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| Component and page folders | PascalCase, with `index.jsx`                                    | `ProductCard/index.jsx`                          |
| Styles                     | `Name.module.css` next to the component                         | `ProductCard.module.css`                         |
| Hooks                      | `useThing.js`                                                   | `useProducts.js`                                 |
| Slices                     | `thingSlice.js`                                                 | `cartSlice.js`                                   |
| Utilities                  | camelCase                                                       | `formatPrice.js`                                 |
| Constants                  | SCREAMING_SNAKE_CASE                                            | `MAX_COMPARE_ITEMS`                              |
| Imports                    | Aliases (`@app`, `@features`, `@pages`, `@services`, `@shared`) | `import { Button } from '@shared/components/ui'` |
| Text                       | No user-facing strings in JSX; use `t('key')`                   | `t('cart.empty')`                                |

- Default exports only for React components and pages. Named exports for everything else.
- Keep components small. If a file passes about 150 lines, suggest splitting it.
- Accessibility: semantic HTML, labels on inputs, alt text on images, visible focus, buttons for actions and links for navigation.

---

## 11. Git workflow

- Repository: `https://github.com/salemsalehtech/Work_Tech.git`
- `main`: deployable, protected. Only updated from `develop` at milestones.
- `develop`: integration, protected, the default branch.
- One personal branch per member, named after them (`salem`, `asmaa`, `wasim`, `zein`, `abdelrahman`, `fares`), created from `develop`. Members push only to their own branch and merge `develop` into it every morning.
- When the lead asks, a member opens a pull request from their branch into `develop`. Only the lead merges, after review (daily, 9 to 11 pm), with passing pre-push checks and a green Vercel build.
- **Conventional Commits** with a scope and a body that explains what changed and why (body lines under 100 characters): `feat(catalog): add product filters`, `fix: correct cart total rounding`, `docs: update readme`, `chore: ...`, `refactor: ...`, `test: ...`, `ci: ...`.
- Small, focused commits and pull requests.
- Step-by-step commands for the team: [`docs/git-guide.pdf`](docs/git-guide.pdf) (Arabic).

### Definition of Done

A task is done when:

- [ ] It matches the design at 1440, 834 and 390 px.
- [ ] It handles loading, empty and error states (if it shows data).
- [ ] It works in English and Arabic (RTL).
- [ ] There are no console errors or warnings.
- [ ] Lint, format check, tests and build pass.
- [ ] It has been reviewed and merged through a pull request.

---

## 12. Roadmap

Build order. Each phase depends on the one before it.

| #   | Phase                           | What it produces                                                                                                           |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Environment setup**           | Vite + React project, dependencies, ESLint, Prettier, Vitest, Husky, commitlint, CI, editor settings, README               |
| 2   | **Architecture skeleton**       | Folder structure, aliases, router with 17 lazy page stubs, Layout, empty Redux store with 4 slices, i18n setup, API client |
| 3   | **Design tokens and shared UI** | `tokens.css`, global styles, fonts, Button, Input, Badge, Rating, Header, Footer, ProductCard                              |
| 4   | **Mock API and data**           | `db.json` with about 40 laptops, reviews, and orders; JSON Server script                                                   |
| 5   | **Static pages**                | All 17 pages built from the design with static content, at 3 sizes                                                         |
| 6   | **Real data**                   | Catalog and details connected to the API with loading, empty and error states; filters in the URL                          |
| 7   | **Redux features**              | Cart, wishlist, compare, auth, persisted to localStorage                                                                   |
| 8   | **Flows and tools**             | Checkout, orders, Laptop Finder, Compare, Value Score, installments                                                        |
| 9   | **Arabic and RTL**              | Translations for all pages, direction switching                                                                            |
| 10  | **Polish and accessibility**    | Hover, focus, transitions, contrast, keyboard use                                                                          |
| 11  | **Testing**                     | Unit tests for logic, component tests for key components, manual test cases                                                |
| 12  | **Deploy and documentation**    | Production deploy on Vercel, final README, testing report                                                                  |

Phases 3 and 4 can run in parallel. Phase 5 starts once phase 3's shared components exist.

### Proposed calendar (to be confirmed)

| Dates       | Phases                                     |
| ----------- | ------------------------------------------ |
| 8 – 14 Nov  | 1, 2, 3, 4, and start 5                    |
| 15 – 21 Nov | 5, 6, 7                                    |
| 22 – 28 Nov | 8, 9, 10, 11                               |
| 29 – 30 Nov | 12, final fixes, implementation deadline   |
| 1 – 4 Dec   | Testing report, final report, presentation |

---

## 13. Current status

Update this list as tasks finish.

- [x] Project idea, proposal and planning documentation
- [x] Requirements documentation
- [x] Figma designs: 17 pages at 3 sizes
- [x] GitHub repository (`salemsalehtech/Work_Tech`) with `develop` as default and branch protection on `main` and `develop`
- [x] Phase 1 setup commits on `main` and `develop`
- [x] GitHub Actions dropped (account billing); replaced by Husky pre-push + Vercel build check
- [x] `.husky/pre-push` runs lint, format check, tests and build
- [ ] Connect the repository to Vercel
- [x] Phase 2: architecture skeleton (merged)
- [x] System Analysis & Design v1.2 (EN + AR)
- [x] Phase 4: mock data (`db.json`) and json-server, fixed to the data contract
- [x] Design System v2 measured from the Figma exports (31 components, Pages, missing screens)
- [x] Data for the design: full spec fields, review city/config, `accessories`, order item `kind`
- [x] Routes for Search results (`/search`) and Order details (`/orders/:id`); shared constants
- [x] Foundation for parallel work: tokens, UI kit, ProductCard, data layer, store persistence, i18n namespaces, layout, architecture lint rules, tests
- [ ] Product images in `public/images/products/` and `public/images/accessories/`
- [ ] Page ownership decided and recorded in section 6

---

## 14. Current task: Phase 5, implementation (17 to 24 Nov 2026)

Six people build in parallel on the foundation. Roles, folders, the dated task list and the team rules are in **docs/team-plan.md**; each member has a personal guide (Arabic PDF) in **docs/team/**. Each person works only in the folders of their role; changes to `app/`, `shared/` or `services/` go through the team lead.

**Done when:** all 19 screens match the Design System at 1440, 834 and 390 px in English and Arabic, every data view shows its four states, `npm run lint`, `npm run test:run` and `npm run build` pass, and the store works on Vercel against the hosted API.
