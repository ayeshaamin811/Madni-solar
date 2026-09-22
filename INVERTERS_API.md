# Inverters API

Goal: replace the static Inverters data files in `src/data/` (`inverterMenu.js`, `inverterCategories.js`, `inverterBrands.js`, `inverterProducts.js`) with real backend data. Read-only, public, no auth — same GET-only, Django REST Framework style as `solar-panels`/`contact`/`calculator`.

Inverters is more layered than Solar Panels: there are 3 categories, and inside a category some brands have their own phase/model sub-variants (e.g. under Ongrid Inverters, **Inverex** splits into **Single Phase** / **Three Phase**). The API has to carry that tree, not just a flat brand list.

## What becomes dynamic

| Currently static (frontend) | Becomes |
|---|---|
| `inverterMenu` tree (category → brand → sub-variant) in `data/inverterMenu.js` | `GET /api/inverters/categories/` |
| `inverterBrands` flat list (name/description/image per brand *and* per sub-variant) in `data/inverterBrands.js` | merged into the same `categories/` response — every brand and every sub-variant node carries its own `description`/`image` |
| category intro text in `data/inverterCategories.js` | `description` field on each category in the `categories/` response |
| `inverterProducts` array in `data/inverterProducts.js` | `GET /api/inverters/products/` (all, or filtered) and `GET /api/inverters/products/<slug>/` (detail) |

Routes, pages, cart, quote flow all stay exactly as they are — only where the data comes from changes.

## The tree: category → brand → sub-variant

What's currently in the mega menu (`src/data/inverterMenu.js`):

- **Ongrid Inverters** — Canadian, Fox, SolarMax, Sofar, Goodwe, Sineng, Growatt, Huawei, **Inverex** (→ Single Phase, Three Phase), Knox, SMA, Chint, MaxPower, Livoltek, Luminey, Solis, Sungrow, ZIEWNIC, Crown
- **Batteryless PV Inverters** — Fronus, Ziewnic
- **Hybrid Inverters** — Chint, Sineng, Sofar, **Hoymiles** (→ Single Phase, Three Phase), Auxsol, Fox, **Goodwe** (→ Single Phase, Three Phase LV, Three Phase HV), Growatt, Inverex, Anicsun, MaxPower, Pilot, Luminey, Crown, Solar Max, **Solis** (→ Single Phase, Three Phase), Itel, Huawei, ZIEWNIC, **Knox** (→ Krypton, XENON, Zapher, Zynex), **SAJ** (→ Single Phase, Three Phase)

Most brands have no sub-variants (`sub` is just empty). A brand that *does* have sub-variants is a parent-only node — it has no product of its own, the product lives on each sub-variant instead (e.g. the product is "Inverex Single Phase", not "Inverex"). This already matches `inverterProducts.js` today.

"All Brands with Capacity (kW)" under Hybrid Inverters is now a real brand in the backend and comes through `brands[]` like every other one (first in the list). It used to be a hardcoded nav-only link in `Navbar.jsx` — that has been removed, so the API response is the only source for it. Sub-variants, if any are added in the admin later, render automatically.

Slugs are parent-prefixed, same rule as `slugifyInverter` in `inverterMenu.js` (lowercase, collapse whitespace — inverter names have no punctuation to worry about):
- `inverex`, `inverex-single-phase`, `inverex-three-phase`
- `goodwe`, `goodwe-single-phase`, `goodwe-three-phase-lv`, `goodwe-three-phase-hv`
- `knox`, `knox-krypton`, `knox-xenon`, `knox-zapher`, `knox-zynex`

## Endpoints

### `GET /api/inverters/categories/`

Returns all 3 categories, each with its full brand tree.

```json
[
  {
    "name": "Ongrid Inverters",
    "slug": "ongrid-inverters",
    "description": "Ongrid (grid-tie) inverters convert the DC power from your solar panels into AC and sync it directly with the WAPDA grid...",
    "brands": [
      { "name": "Canadian", "slug": "canadian", "description": "", "image": "", "sub": [] },
      {
        "name": "Inverex",
        "slug": "inverex",
        "description": "",
        "image": "",
        "sub": [
          { "name": "Single Phase", "slug": "inverex-single-phase", "description": "", "image": "" },
          { "name": "Three Phase", "slug": "inverex-three-phase", "description": "", "image": "" }
        ]
      }
    ]
  },
  { "name": "Batteryless PV Inverters", "slug": "batteryless-pv-inverters", "description": "...", "brands": [ "..." ] },
  { "name": "Hybrid Inverters", "slug": "hybrid-inverters", "description": "...", "brands": [ "..." ] }
]
```

- `slug` — unique across the **whole** response, brand and sub-variant slugs included. Used as the flat `:brandSlug` route param and as `Product.brandSlug` below.
- `sub` — always an array, `[]` when the brand has no variants. Never omit the key — the frontend always maps over it.
- Order matters: category order, brand order within a category, and sub-variant order within a brand are all display order (mega menu, category page grid, and breadcrumb depend on it).
- `description` / `image` on a brand or sub-variant — empty string is fine, frontend falls back to a default banner/text same as Solar Panels.

### `GET /api/inverters/products/`

Returns products (used on the `/inverters` listing page). Optional query params, combinable:
- `?category=<categorySlug>` — one category's products (used on `/inverters/:category`)
- `?brand=<brandSlug>` — one brand/sub-variant's products (used on `/inverters/:category/:brandSlug` and the flat `/inverters/:brandSlug` fallback)

```json
[
  {
    "name": "Inverex Single Phase Solar Inverter",
    "slug": "inverex-single-phase",
    "brandSlug": "inverex-single-phase",
    "price": 185000,
    "image": "https://.../inverex-single-phase.webp",
    "shortDescription": "The Inverex Single Phase Solar Inverter is a placeholder..."
  }
]
```

Light fields only (no `description`/`whyChoose`/`categories`) — same rule as Solar Panels' listing endpoint, those extra fields are only needed on the detail page below.

### `GET /api/inverters/products/<slug>/`

Single product, full detail.

```json
{
  "name": "Inverex Single Phase Solar Inverter",
  "slug": "inverex-single-phase",
  "brandSlug": "inverex-single-phase",
  "price": 185000,
  "image": "https://.../inverex-single-phase.webp",
  "shortDescription": "The Inverex Single Phase Solar Inverter is a placeholder...",
  "description": [
    "The Inverex Single Phase Solar Inverter is engineered to deliver reliable single-phase output for residential loads...",
    "It syncs with the grid for net metering while remaining simple to install and maintain..."
  ],
  "whyChoose": [
    "Reliable single-phase performance for home use",
    "Simple installation and low maintenance",
    "Backed by Inverex's local support network",
    "Competitive pricing for residential-scale systems"
  ],
  "categories": ["Madni Solar", "Inverters", "Ongrid Inverters", "Inverex", "Single Phase"]
}
```

- `image` — full absolute URL (Django `MEDIA_URL`), not a relative path
- `description` — array of paragraph strings (never a single block, never bullets)
- `whyChoose` — array of short checklist strings
- `categories` — breadcrumb-flavored list, same idea as Solar Panels but one level deeper when the product is a sub-variant (category → parent brand → sub-variant name)
- 404 with a plain error body if the slug doesn't exist: `{"detail": "Not found."}`

## Notes for backend

- Every leaf slug (brand or sub-variant) is unique to exactly one category today, but don't hardcode that assumption — keep category membership as a relationship on the category side, not something derived by string-matching the brand/product slug, in case a brand ever needs to appear under two categories.
- One product per brand/sub-variant for now (`slug === brandSlug`), same placeholder shape as the rest of the catalogue. Keep that 1:1 until there's a real reason for multiple SKUs per brand.
- No separate breadcrumb endpoint needed — `Madni Solar / Inverters / <Category> / [<Parent brand> /] <Item>` is built entirely client-side from the `categories/` tree, as long as the nesting in that response is correct.

## Frontend wiring (once these endpoints exist)

Add `src/api/inverters.js` (same `client` used by `src/api/solarPanels.js` / `contact.js` / `calculator.js`):

```js
import client from "./client";

export const getInverterCategories = () =>
  client.get("/inverters/categories/").then((res) => res.data);

export const getInverterProducts = ({ category, brand } = {}) =>
  client
    .get("/inverters/products/", {
      params: {
        ...(category ? { category } : {}),
        ...(brand ? { brand } : {}),
      },
    })
    .then((res) => res.data);

export const getInverterProduct = (slug) =>
  client.get(`/inverters/products/${slug}/`).then((res) => res.data);
```

Then swap the static imports for these calls in:
- `src/components/Navbar/Navbar.jsx` — fetch `getInverterCategories()` once on mount (same `useEffect`/`useState` pattern already used there for `getSolarPanelBrands()`), instead of importing the hardcoded `inverterMenu` tree. Column layout (which brands sit in which mega-menu column) can stay a frontend-side chunking of the fetched brand list — the API only needs to return correct order, not column placement.
- `src/data/inverterMenu.js` — `slugifyInverter`, `getInverterTrail`, `findCategoryForSlug` keep the same signatures/output shape, but read from the fetched categories tree instead of the static array.
- `src/pages/InvertersPage/InvertersPage.jsx` — swap `inverterProducts` import for `getInverterProducts()`.
- `src/pages/InverterCategoryPage/InverterCategoryPage.jsx` — swap `getInverterCategory` (from `inverterCategories.js`) + `inverterProducts` for `getInverterCategories()` + `getInverterProducts({ category: categorySlug })`.
- `src/pages/InverterBrandPage/InverterBrandPage.jsx` — swap `inverterBrands` + `inverterProducts` for `getInverterCategories()` (brand/sub-variant lookup) + `getInverterProducts({ brand: brandSlug })`.
- `src/pages/InverterDetailPage/InverterDetailPage.jsx` — swap `inverterProducts` for `getInverterProduct(productSlug)`.
- `src/data/findProduct.js` — currently merges `inverterProducts` into `staticProducts` synchronously; add an inverter fetch-and-cache the same way `loadSolarPanelProducts()` already works for solar panels, so `Add to Quote` keeps resolving inverter products correctly.
- `src/data/inverterMenu.js`, `inverterCategories.js`, `inverterBrands.js`, `inverterProducts.js` — the static array/const parts can be deleted once every consumer above is wired to the API; keep only the pure helper functions that get rebuilt to work off fetched data.
