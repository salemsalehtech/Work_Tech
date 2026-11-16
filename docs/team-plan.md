# Team plan: 17 to 24 November 2026

Six people, each owning their own folders, so nobody waits for anybody. Everything shared (tokens, UI kit, data layer, store, translations, layout) is already in the repository: build on it from day one.

Each member has a personal guide in Arabic, with the architecture, the Git rules and every task step by step: `docs/team/worktech-guide-<name>.pdf`. This file is the short version for the whole team.

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

| Role                        | Owner           | Branch        | Folders                                                                                                                              |
| --------------------------- | --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Team lead and integration   | Salem Saleh     | `salem`       | `src/app`, `src/services`, `src/shared/hooks`, `src/pages/Finder`, `src/features/finder/components`, deployment                      |
| UI kit and content pages    | Asmaa Nehad     | `asmaa`       | `src/shared/components/ui`, `src/shared/styles`, `src/shared/utils/validators.js`, `src/pages/{About,Contact,Faq,Policies,NotFound}` |
| Catalog and product details | Wassim Gomaa    | `wasim`       | `src/features/catalog`, `src/pages/{Products,SearchResults,ProductDetails}`                                                          |
| Cart and checkout           | Zein El-Din Amr | `zein`        | `src/features/{cart,checkout}`, `src/features/finder/model`, `src/pages/{Cart,Checkout,OrderSuccess}`                                |
| Account and orders          | Abdelrahman     | `abdelrahman` | `src/features/{auth,orders,wishlist}`, `src/pages/{Auth,Account,Orders,OrderDetails,Wishlist}`                                       |
| Compare and Home            | Fares Ahmed     | `fares`       | `src/features/compare`, `src/pages/{Compare,Home}`                                                                                   |

Laptop Finder: Zein writes the scoring (`scoreLaptops`), Salem builds the pages.

## Calendar

| Days              | Goal                                                                |
| ----------------- | ------------------------------------------------------------------- |
| Tue 17 and Wed 18 | Slices, models and their tests; a first simple version of each page |
| Thu 19 to Sat 21  | Every page complete at 1440 px                                      |
| Sun 22            | 834 and 390 px, Arabic and RTL, the four states                     |
| Mon 23            | Tests and fixes; last pull request by 6 pm                          |
| Tue 24            | Code freeze at noon, `develop` into `main`, deployment, delivery    |

## Handoffs

Things one person builds and others use. These deadlines come first.

| From        | Delivers                                               | To                         | By            |
| ----------- | ------------------------------------------------------ | -------------------------- | ------------- |
| Salem       | The foundation on `develop`                            | Everyone                   | Tue 17, 10 am |
| Zein        | `addItem`, `toCartItem` from `@features/cart`          | Wassim, Fares, Abdelrahman | Tue 17, 9 pm  |
| Fares       | `toggleCompare` from `@features/compare`               | Wassim                     | Tue 17, 9 pm  |
| Asmaa       | Tabs, Toggle, Breadcrumbs, SectionHeader               | Wassim, Fares              | Tue 17, 9 pm  |
| Asmaa       | `isEgyptianMobile`, `isEmail` from `@shared/utils`     | Zein, Abdelrahman          | Wed 18, noon  |
| Abdelrahman | `toggleWishlist` from `@features/wishlist`             | Wassim                     | Wed 18, noon  |
| Asmaa       | Accordion, ChoiceList, OptionCards, SegmentedControl   | Wassim, Zein, Salem        | Wed 18, 9 pm  |
| Wassim      | `useProductCardActions` from `@features/catalog`       | Fares, Abdelrahman, Asmaa  | Thu 19, noon  |
| Abdelrahman | `RequireAuth` from `@features/auth`                    | Salem                      | Thu 19, 3 pm  |
| Asmaa       | CheckoutStepper, OrderTracker, AccountNav, FilterGroup | Zein, Abdelrahman, Wassim  | Thu 19, 9 pm  |
| Zein        | `scoreLaptops` from `@features/finder`                 | Salem                      | Thu 19, 9 pm  |
| Fares       | `CompareBar` from `@features/compare`                  | Wassim                     | Fri 20, noon  |
| Asmaa       | InstallmentPicker, Toast                               | Wassim, Salem              | Fri 20, 3 pm  |

Waiting for something? Put a placeholder with `// TODO(name): …` and keep going.

## Rules that keep everyone moving

1. **Stay in your folders.** Need something in `app/`, `shared/` or `services/`? Ask Salem in the group.
2. **Use what exists.** No second button, no own price formatting, no `axios` in components, no hard-coded colors or text.
3. **One personal branch.** Push only to your own branch. Every morning merge `develop` into it.
4. **Commits explain the work.** `type(scope): what you did`, then one to three lines on what and why. One topic per commit, at least three commits a day.
5. **Pull requests on request.** When Salem asks (or the task says so), open a pull request from your branch into `develop`. Only Salem merges, after review, every day from 9 to 11 pm.
6. **Hooks are not optional.** Lint, format check, tests and build run before every push. Fix, never skip.
7. **Shared props are a contract.** Changing a prop of `ProductCard`, a UI kit component or a slice selector needs a message in the group first.

## Definition of done for a page

- Matches the Design System at 1440, 834 and 390 px.
- Works in English and Arabic (RTL), no text outside the locale files.
- Loading, empty, error and success states through `DataState`.
- Keyboard works, focus is visible, images have `alt`, buttons have names.
- Logic has tests; `npm run lint`, `npm run test:run` and `npm run build` pass.
