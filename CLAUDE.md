# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Madni Solar — a marketing + catalogue website for a Pakistani solar company (solar
panels, inverters, batteries, services, projects). Static, front-end only: **there is
no backend wired up**. All product/brand data lives in `src/data/*.js` as placeholder
content that will later be replaced by an admin/API. Prices are in PKR (Rs).

## Stack

- React 18 + Create React App (`react-scripts` 5)
- `react-router-dom` v6 for routing
- Plain CSS per component/page (primary), Tailwind available and used sparingly for
  utility classes (`flex`, spacing) alongside the hand-written CSS
- `react-icons` (mostly `react-icons/fa`) for icons
- `axios` and `@react-oauth/google` are installed but **not used anywhere yet**

## Commands

```bash
npm start    # dev server (CRA, http://localhost:3000)
npm run build
```

There are no tests, no linter script, and no typecheck. Verify changes by running the
dev server and viewing the page.

`node verify-inverters.js` — one-off consistency check: parses the Navbar inverters
mega menu and compares its generated slugs against `src/data/inverterBrands.js`,
reporting menu entries with no data and data entries not reachable from the menu. Run
it after editing either file.

## Layout

```
src/
  index.js            real entry (renders <CartProvider><App/></CartProvider>)
  main.jsx            unused Vite-style entry left over; ignore, don't edit
  App.js              all routes
  index.css           Tailwind directives, CSS reset, :root theme variables
  context/CartContext.jsx
  data/               static product + brand data
  components/<Name>/<Name>.jsx + <Name>.css
  pages/<Name>/<Name>.jsx + <Name>.css
  assets/
```

Page and component folders are PascalCase-ish but inconsistently cased (`Herobanner`,
`Aboutcompany`, `Solarservices`) — match the existing folder name exactly when
importing; don't rename folders as a drive-by.

Two pages sit directly in `pages/` rather than a folder: `home.jsx`, `FaqPage.jsx`.

## Page composition

Every page renders its own chrome — there is no shared layout component:

```jsx
<div>
  <Navbar />
  <PageBanner image={...} title={...} currentPage={...} />
  {/* page sections */}
  <Footer />
</div>
```

`<ScrollToTop />` sits inside `<Router>` in `App.js` and resets scroll on navigation.

## Catalogue data model

Two parallel catalogues share an identical shape and page flow — **solar panels** and
**inverters**. When changing one, check whether the other needs the same change.

| | Solar panels | Inverters |
|---|---|---|
| brands | `data/solarPanelBrands.js` | `data/inverterBrands.js` |
| products | `data/solarProducts.js` | `data/inverterProducts.js` |
| listing | `/solar-panels/:brandSlug` → `SolarPanelBrandPage` | `/inverters/:brandSlug` → `InverterBrandPage` |
| detail | `/solar-panels/:brandSlug/:productSlug` → `ProductDetailPage` | `/inverters/:brandSlug/:productSlug` → `InverterDetailPage` |

Brand shape: `{ name, slug, description, image }` — leave `image: ""` to fall back to
the page's default banner (`assets/hero-banner.webp`), which is imported per page and
mapped via a local `brandImageMap`.

Product shape: `{ name, slug, brandSlug, price, image, shortDescription,
description: string[], whyChoose: string[], categories: string[] }`. The cart only
consumes `name, slug, price, image`.

Brand/detail pages look items up with `.find()` on the slug and render a plain
"Brand not found." / "Product not found." block (still wrapped in Navbar/Footer) when
the slug is bad. Keep that pattern.

### Slugs and the mega menu

`Navbar.jsx` builds the Solar Panels and Inverters mega menus from local arrays
(`solarPanelsMenu`, `invertersMenu`). Menu entries are plain strings, or objects
`{ name, sub: [...] }` for a nested list, or `{ name, to }` for an explicit
destination. Slugs are **derived** from the label via
`slugify = name => name.toLowerCase().trim().replace(/\s+/g, "-")`, and nested items
get `parentSlug-childSlug` (e.g. "Goodwe" → "Three Phase HV" becomes
`goodwe-three-phase-hv`).

Consequence: adding a menu label silently creates a route that 404s in-page unless a
matching `slug` is added to the brands data file (and usually a product too). Add the
label, add the brand, add the product, then run `node verify-inverters.js`.

## Cart

`context/CartContext.jsx` — in-memory only (`useState`, no localStorage, no API), so
the cart resets on reload. Items keyed by `slug`. `useCart()` exposes `cartItems`,
`cartCount`, `subtotal`, `addToBasket(product, qty)`, `removeFromBasket(slug)`.
There is no quantity-update or clear-cart helper; add one if a page needs it rather
than mutating `cartItems` directly.

`CheckoutPage`, `ContactPage` and `RequestQuote` are local-state forms whose submit
handlers just flip a `submitted` flag — nothing is sent anywhere.

## Styling conventions

- One `.css` file per component/page, imported at the top of its `.jsx`; class names
  are kebab-case and scoped by a page/component prefix (`brand-content`,
  `hero-banner`, `product-not-found`). No CSS modules.
- Theme colors come from `:root` variables in `src/index.css` — `--theme-color`
  (`#01164F` navy), `--orange-dark`, `--navy`, `--text-dark`, `--gray-light`,
  `--shadow`. Use these rather than new hex literals.
- Responsive work uses `@media (max-width: …)` with the existing breakpoints:
  1200 / 992 / 768 / 576 / 480 px are the common ones.
- Tailwind is configured over `src/**/*.{js,jsx,ts,tsx}` with no theme extensions;
  utility classes are mixed into `className` strings alongside the custom classes.

## Conventions to follow

- Comments in this codebase are frequently written in Roman-Urdu ("Data file mein
  matching brand dhoondo"). Match the surrounding style of the file you edit; don't
  translate or strip existing comments.
- New pages: create `src/pages/<Name>/<Name>.jsx` + `.css`, then register the route in
  `App.js` (and a Navbar link if user-reachable).
- Assets go under `src/assets/` (`solar-products/`, `solar-services/`,
  `projects-assets/`, `teams/`) and are imported, not referenced by URL string.
- WhatsApp enquiry buttons use the number `923111666677`, declared as a module-level
  constant on the detail pages.
