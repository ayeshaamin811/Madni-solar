# Batteries API

Goal: replace the static Batteries data files in `src/data/` (`batteryMenu.js`, `batteryProducts.js`) with real backend data. Read-only, public, no auth — same GET-only, Django REST Framework style as `solar-panels`/`inverters`.

Batteries is simpler than Inverters in one way (only one category — there's no `/batteries/<category>` segment, `/batteries` itself is the whole catalogue) but the brand tree needs to support **arbitrary nesting depth**, not just one level.

## What becomes dynamic

| Currently static (frontend) | Becomes |
|---|---|
| `batteryMenu` tree (brand → sub-variant, recursive) in `data/batteryMenu.js` | `GET /api/batteries/brands/` |
| `batteryProducts` array in `data/batteryProducts.js` | `GET /api/batteries/products/` (all, or filtered) and `GET /api/batteries/products/<slug>/` (detail) |

Routes, pages, cart, quote flow all stay exactly as they are — only where the data comes from changes.

## The tree: one flat category, brand → sub-variant (recursive)

There is exactly one category, "Batteries" — it's a frontend constant (`BATTERY_CATEGORY` in `batteryMenu.js`), not something that needs its own model/endpoint. What's currently in the mega menu:

- **Flat brands (no sub-variants)**: 12V Batteries, HV Batteries, 2.5kwh Batteries, 5kwh LV Batteries, 10kwh Batteries, 14.33/16kwh LV Batteries, Lithium Valley, Mesol, SAJ, Crown, Fronus, Pilot, Sofar, Chint, LvtopSun, VestWoods, Inverex, Hithium, Knox, Nimbess, Itel, EVE, Sunwoda, Livoltek, Narada, Vaults, SunFlx, Growatt, Soluna, ESS, Max Power, Hoymiles, Auxsol
- **Brands with sub-variants**: Huawei (→ HV), BYD (→ HV, LV), EY Power (→ HV, LV), Dyness (→ HV, LV), Fox (→ HV, LV), Goodwe (→ HV, LV), PylonTech (→ HV, LV), ZIEWNIC (→ LI-WALL 2.0, Z Box European)

**Important difference from Inverters**: in Inverters, a brand with sub-variants is parent-only and has no product of its own — only its sub-variants do. In Batteries, **every node has its own product, including parents that also have sub-variants**. Huawei has a product AND Huawei → HV has a separate product. Don't carry over the Inverters "parent-only" rule here — it doesn't apply.

Only one level of nesting exists in the current data, but model it as **arbitrary depth** (self-referential, same idea as Inverters' `Brand.parent` FK) rather than hardcoding two levels — nothing today needs a grandchild, but the frontend's breadcrumb code (`getBatteryTrail`) already walks an `ancestors` array of any length, so the backend shouldn't assume a max depth of 1.

Slugs are parent-prefixed and use the **product slugify rule** (collapse every run of non-alphanumeric characters into a single dash), because battery names contain punctuation that plain whitespace-collapsing can't handle: `14.33/16kwh LV Batteries`, `LI-WALL 2.0`, `2.5kwh Batteries`. Examples:
- `12v-batteries`, `14-33-16kwh-lv-batteries`, `li-wall-2-0`
- `huawei`, `huawei-hv`
- `byd`, `byd-hv`, `byd-lv`
- `ziewnic`, `ziewnic-li-wall-2-0`, `ziewnic-z-box-european`

## Endpoints

### `GET /api/batteries/brands/`

Returns the full tree as a flat top-level list; each brand recursively carries its own `sub`.

```json
[
  { "name": "12V Batteries", "slug": "12v-batteries", "description": "", "image": "", "sub": [] },
  {
    "name": "Huawei",
    "slug": "huawei",
    "description": "",
    "image": "",
    "sub": [
      { "name": "HV", "slug": "huawei-hv", "description": "", "image": "", "sub": [] }
    ]
  },
  {
    "name": "ZIEWNIC",
    "slug": "ziewnic",
    "description": "",
    "image": "",
    "sub": [
      { "name": "LI-WALL 2.0", "slug": "ziewnic-li-wall-2-0", "description": "", "image": "", "sub": [] },
      { "name": "Z Box European", "slug": "ziewnic-z-box-european", "description": "", "image": "", "sub": [] }
    ]
  }
]
```

- `slug` — unique across the whole response, at every depth.
- `sub` — always an array, `[]` when there are no children, and present (even if empty) at every depth so the frontend can recurse without special-casing leaves.
- Order = display order (menu columns, listing grid).
- `description` / `image` — empty string is fine, same fallback behavior as the other catalogues.

### `GET /api/batteries/products/`

Returns products. Optional `?brand=<slug>` filters to one node's product (brand **or** sub-variant slug — remember every node has exactly one product here).

```json
[
  {
    "name": "Huawei HV Battery",
    "slug": "battery-huawei-hv",
    "brandSlug": "huawei-hv",
    "price": 165000,
    "image": "https://.../huawei-hv.webp",
    "shortDescription": "Huawei HV Battery is a placeholder..."
  }
]
```

Note the `battery-` prefix on `slug` — it is **not** the same as `brandSlug` (unlike Inverters, where they're equal). This mirrors `productItems.js`'s category-prefixing: cart/quote lookup is keyed by `slug` alone, and brand names here (Huawei, Fox, Goodwe, Knox, SAJ...) also exist in the Inverters catalogue, so the prefix keeps a "Huawei battery" and a "Huawei inverter" from colliding in the basket. `brandSlug` stays the clean node slug (`huawei-hv`), used for the `/batteries/:brandSlug/:productSlug` route.

Light fields only here (no `description`/`whyChoose`/`categories`).

### `GET /api/batteries/products/<slug>/`

Single product, full detail — `slug` here is the product's own prefixed slug (`battery-huawei-hv`), not the brand slug.

```json
{
  "name": "Huawei HV Battery",
  "slug": "battery-huawei-hv",
  "brandSlug": "huawei-hv",
  "price": 165000,
  "image": "https://.../huawei-hv.webp",
  "shortDescription": "Huawei HV Battery is a placeholder...",
  "description": [
    "The Huawei HV Battery is engineered to deliver dependable high-voltage storage for hybrid and off-grid systems...",
    "Placeholder specifications are shown here until real technical details are added."
  ],
  "whyChoose": [
    "Reliable performance backed by Huawei",
    "High-voltage design for hybrid inverter pairing",
    "Straightforward installation and maintenance",
    "Placeholder pricing - contact us for a current quote"
  ],
  "categories": ["Madni Solar", "Batteries", "Huawei", "HV"]
}
```

- `image` — full absolute URL, not a relative path
- `description` — array of paragraph strings (never a single block, never bullets)
- `whyChoose` — array of short checklist strings
- `categories` — breadcrumb-flavored list: `["Madni Solar", "Batteries", ...ancestor names, node name]` — as many ancestor entries as the node is deep (just 1 for a top-level brand, more if nesting ever grows)
- 404 with a plain error body if the slug doesn't exist: `{"detail": "Not found."}`

## Notes for backend

- No `Category` model needed — Batteries has exactly one, and it's a frontend-only constant. Don't build the `CategoryBrand` join-table machinery from the Inverters app here; it doesn't apply.
- Every `Brand` node (leaf or not) gets exactly one `Product` — a plain `OneToOneField` from `Product` to `Brand`, same as Inverters, but **without** the "parent nodes have no product" exception.
- Self-referential `Brand.parent` FK (same pattern as the Inverters app) naturally supports whatever depth shows up later — don't hardcode two levels.
- No separate breadcrumb endpoint needed — the frontend walks the `brands/` tree itself to build the ancestor chain, same approach as Inverters' `categories/` tree.

## Frontend wiring (once these endpoints exist)

Add `src/api/batteries.js` (same `client` used elsewhere):

```js
import client from "./client";

export const getBatteryBrands = () =>
  client.get("/batteries/brands/").then((res) => res.data);

export const getBatteryProducts = ({ brand } = {}) =>
  client
    .get("/batteries/products/", { params: brand ? { brand } : {} })
    .then((res) => res.data);

export const getBatteryProduct = (slug) =>
  client.get(`/batteries/products/${slug}/`).then((res) => res.data);
```

Then swap the static imports for these calls in:
- `src/components/Navbar/Navbar.jsx` — fetch `getBatteryBrands()` once on mount (same pattern already used for `getInverterCategories()`/`getSolarPanelBrands()`), instead of importing the hardcoded `batteryMenu` tree. Column layout stays a frontend-side chunking of the fetched list, same call as was made for Inverters.
- `src/data/batteryMenu.js` — `slugifyBattery` becomes unnecessary (backend provides slugs directly); `getBatteryTrail` keeps its signature/output shape (`{ ancestors, item }`) but walks the fetched tree instead of the static array.
- `src/pages/BatteriesPage/BatteriesPage.jsx` — swap `batteryProducts` import for `getBatteryProducts()`.
- `src/pages/BatteryBrandPage/BatteryBrandPage.jsx` — swap `getBatteryTrail` (static) + `getBatteryItemProducts` for `getBatteryBrands()` (trail lookup) + `getBatteryProducts({ brand: brandSlug })`.
- `src/pages/BatteryDetailPage/BatteryDetailPage.jsx` — swap `batteryProducts` for `getBatteryProduct(productSlug)`.
- `src/data/findProduct.js` — add a battery fetch-and-cache the same way `loadSolarPanelProducts()`/`loadInverterProducts()` already work, so `Add to Quote` keeps resolving battery products.
- `src/data/batteryMenu.js`, `batteryProducts.js` — the static tree/array parts can be deleted once every consumer above is wired to the API; keep only the pure helper functions rebuilt to work off fetched data.
