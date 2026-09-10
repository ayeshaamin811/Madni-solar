# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps
npm start            # dev server (react-scripts, http://localhost:3000)
npm run build        # production build — use `CI=true npx react-scripts build` for a non-interactive check
```

There is no test suite, no linter config, and no `test` script in `package.json`. The only mechanical verification available is the production build, so run it after non-trivial changes. `react-scripts` ships ESLint via webpack, so build output surfaces unused-variable / hook warnings.

To verify data-layer changes (menu trees, slugs, breadcrumb trails) without a browser, copy the pure-ESM data file to a scratch `.mjs` and run it under `node` — the `src/data/*Menu.js` files have no asset imports, so they run standalone. Files that import images (`*Products.js`, `productItems.js`) cannot.

## Stack

Create React App (`react-scripts` 5) + React 18 + `react-router-dom` v6. Tailwind is installed and `@tailwind` directives are in `src/index.css`, but the codebase is **95% hand-written CSS** — Tailwind is used only for a few utilities (`grid`, `flex`, `items-center`, `md:grid-cols-2`). Follow the surrounding file: write plain CSS, not Tailwind classes.

## Architecture

### Catalogue trees are generated from a single source of truth

The four catalogue sections (Solar Panels, Inverters, Batteries, Products) all render as navbar mega menus. For **Inverters**, **Batteries** and **Products**, the menu tree in `src/data/` is the single source of truth — the navbar, the category pages, and the breadcrumb trails are all derived from it, so the menu can never drift from the pages:

| Section | Menu tree | Categories | Products | Route prefix |
|---|---|---|---|---|
| Inverters | `data/inverterMenu.js` | `data/inverterCategories.js` | `data/inverterProducts.js` | `/inverters` |
| Products | `data/productsMenu.js` | `data/productCategories.js` | `data/productItems.js` | `/products` |
| Solar Panels | `solarPanelsMenu` in `Navbar.jsx` | — (flat brand list in `data/solarPanelBrands.js`) | `data/solarProducts.js` | `/solar-panels` |
| Batteries | `data/batteryMenu.js` | — (single category, `/batteries` is it) | `data/batteryProducts.js` | `/batteries` |

Menu tree shape (both Inverters and Products use it, and `Navbar.jsx` lays out any menu written this way):

```js
[{ span: 1,                       // how many mega-grid tracks this block takes
   sections: [{ heading, categorySlug, columns: [[items], [items]] }] }]
```

An item is a plain string, or `{ name, sub: [...] }` for nesting (recursive), or `{ name, to }` for a nav-only link that is excluded from generated pages and breadcrumbs.

Each tree file exports its own `slugify*`, `*MenuSections`, `get*Trail()` (breadcrumbs) and `findCategoryForSlug()` / `findProductCategoryForSlug()` (for flat URLs). **Slugs are derived from display names, never hand-written**, and nested items are prefixed by their parent (`inverex-single-phase`, `cables-nafees-cables-dc-cables`). Note the two slugify rules differ: `slugifyInverter` only collapses whitespace; `slugifyProduct` collapses every non-alphanumeric run, because product names contain punctuation (`D.B Box with Breakers`, `INVT (Original)`).

### Four-tier route pattern

Both Inverters and Products follow the same tiering, with the static category routes generated from the categories data file in `App.js` (React Router v6 ranks static segments above dynamic, so the flat fallback routes below them still work for legacy/bare links):

```
/inverters                                   listing of everything
/inverters/:category                         category page
/inverters/:category/:brandSlug              brand/item page
/inverters/:category/:brandSlug/:productSlug detail page (Add to Basket / Quote / WhatsApp)
/inverters/:brandSlug[/:productSlug]         flat fallback — category inferred from the tree
```

The category segment is what makes a full breadcrumb possible for items that appear in more than one category (Goodwe, Knox, Huawei) — the page knows which category the user came from. Route components take `categorySlug` as a **prop** from `App.js`, and read the rest with `useParams()`.

### Batteries is the same pattern one level shorter

Batteries has a single category, so `/batteries` *is* the category page and no category segment repeats in the URL:

```
/batteries                              listing of everything
/batteries/:brandSlug                   brand / capacity page (also serves sub-variants)
/batteries/:brandSlug/:productSlug      detail page
```

Brands and their sub-variants share the one `:brandSlug` route because sub-variant slugs are parent-prefixed (`huawei-hv`, `byd-lv`, `ziewnic-li-wall-2-0`) — `getBatteryTrail()` finds the parent for the breadcrumb, so there is no `findCategoryForSlug` equivalent and no `categorySlug` prop. `slugifyBattery` uses the *product* rule (collapses every non-alphanumeric run), because battery names contain punctuation (`14.33/16kwh LV Batteries`, `LI-WALL 2.0`). In `Navbar.jsx` the batteries menu passes an empty `basePath`, so the section's `categorySlug` alone forms `/batteries` and `/batteries/<item>`.

### Products slugs are category-prefixed

`productItems.js` builds one product per (category, item) pair with `slug = ${categorySlug}-${itemSlug}` (`packages-huawei`), while `brandSlug` stays the clean item slug. This is deliberate: cart identity and quote lookup are **keyed by product slug alone** (`CartContext.addToBasket`, `findProduct`), and bare names like Huawei / Solis / Fox exist in several products categories *and* in the inverter data. Without the prefix a Huawei package and a Huawei inverter would merge in the basket. `batteryProducts.js` does the same with a flat `battery-` prefix (`battery-huawei`), for the same reason. Keep this in mind before adding any further catalogue section.

### Cross-cutting pieces

- **`src/context/CartContext.jsx`** — global basket, mounted in `src/index.js` above `<App/>`. Persists to `localStorage` under `madniSolarCart`, and stores only `{name, slug, price, image, quantity}`, keyed by slug.
- **`src/data/findProduct.js`** — the Request-a-Quote page resolves products from URL params through here. **Every new product data file must be registered in its `allProducts` array**, or `Add to Quote` silently resolves to nothing.
- **`src/components/Pagebanner/Pagebanner.jsx`** — every non-home page's hero + breadcrumb. Pass `trail={[{name, to}, ...]}` for deep hierarchies or `parent={{name, to}}` for a single level; `Madni Solar` and the trailing `currentPage` are added automatically.
- **Page composition** — pages are flat: `<Navbar/>` + `<PageBanner/>` + one `<section>` + `<Footer/>`. There is no shared layout component; every page imports Navbar and Footer itself.
- Product data is all static placeholder data awaiting a backend. New entries follow the existing shape (`name, slug, brandSlug, price, image, shortDescription, description, whyChoose[], categories[]`) so the shared detail-page and cart flow keep working. `description` is a single block rendered as paragraphs (never bullets) — the detail pages accept either one string or an array of paragraphs, because the backend will eventually send one rich text value. `whyChoose` stays a checklist array.

## Conventions

- **All CSS is global.** CRA `import "./X.css"` has no scoping, so class names collide across the app. Listing/detail pages deliberately reuse generic names (`.product-card`, `.product-detail-content`, `.container`) and several component CSS files each redefine `.container`. When adding a page, prefix its classes (`.products-catalog-*`, `.product-category-*`) unless you intend to reuse an existing look. Theme colors live as CSS variables in `src/index.css` (`--theme-color`, `--orange-dark`).
- **Comments are written in Roman Urdu/Hinglish** mixed with English, explaining *why* a structure exists. Match that voice in files that already use it.
- Responsive breakpoints in `Navbar.css`: mega menus collapse to one column at 1250px, the desktop nav switches to the hamburger drawer at 1100px. Every mega menu must be added to both the desktop `nav-menu` list and the `mobile-menu` list.
- Mega-menu rendering helpers in `Navbar.jsx` are shared: `renderMegaGroups` / `renderMobileGroups` take a `basePath`, and `makeLinkedItemRenderer(basePath, slugifyFn)` produces the per-section item renderer. Menus without real pages use `renderItems`, which emits `href="#"`.

## Stale files (do not treat as live)

- `src/main.jsx` — a Vite-style entry point. CRA uses `src/index.js`; `main.jsx` is dead code.
- `verify-inverters.js` — a one-off script that `eval`s `const invertersMenu = [` out of `Navbar.jsx`. That array moved to `src/data/inverterMenu.js`, so the script no longer works.
