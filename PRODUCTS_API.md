# Products (Accessories) API

Note on naming: the navbar label is **"Accessories"**, but everywhere in the codebase — data files, routes, components — this section is called **"Products"** (`/products`, `data/productsMenu.js`, `ProductsCatalogPage`). This doc follows the codebase name. Don't confuse it with the per-catalogue `products/` endpoints on the other apps (`inverters/products/`, `batteries/products/`) — this is a separate Django app, conventionally named `products`, whose own endpoints happen to also be called `.../products/` for the actual sellable items. Follow the naming below exactly.

Goal: replace the static Products data files in `src/data/` (`productsMenu.js`, `productCategories.js`, `productItems.js`) with real backend data. Read-only, public, no auth — same GET-only, Django REST Framework style as `solar-panels`/`inverters`/`batteries`.

Products combines both quirks the other catalogues have separately:
- **Multiple categories**, like Inverters (4 of them, fixed).
- **Arbitrary tree depth**, like Batteries — this one actually goes 3 levels deep today (`Cables → Nafees Cables → DC Cables` / `AC Cables`), not just 2.
- **Every node has its own product**, same rule as Batteries (not the Inverters "parent-only" rule).

## What becomes dynamic

| Currently static (frontend) | Becomes |
|---|---|
| `productsMenu` tree (category → item → sub-item, recursive) in `data/productsMenu.js` | `GET /api/products/categories/` |
| category intro text in `data/productCategories.js` | `description` field on each category in the `categories/` response |
| `productItems` array in `data/productItems.js` | `GET /api/products/products/` (all, or filtered) and `GET /api/products/products/<slug>/` (detail) |

Routes, pages, cart, quote flow all stay exactly as they are — only where the data comes from changes.

## The 4 categories and their trees

- **Installation Accessories** — Cables (→ Nafees Cables (→ DC Cables, AC Cables)), Structure, Installation Labor, Civil Works, D.B Box with Breakers, Supporting Items
- **Packages** — Huawei, Solis, Goodwe
- **Product Accessories** — Sungrow, BYD, Pylontech, Luminey, Fox, Solis, Huawei
- **VFDs** — Invent, INVT (Original)

**Same names appear in different categories on purpose, and this is fine — do not try to dedupe or share them.** "Huawei" under Packages and "Huawei" under Product Accessories are two genuinely different real-world items (a complete Huawei package vs. a Huawei-specific accessory), modeled as two independent rows, each with its own `category`. Same for "Solis" (Packages vs. Product Accessories). This is different from the Inverters app's cross-category collision, which needed disambiguated slugs on the *same* conceptual brand — here there's no shared entity at all, so no join table is needed; a plain `category` FK on the item is enough.

Slugs use the **product slugify rule** (collapse every run of non-alphanumeric characters into a dash), because names have punctuation: `D.B Box with Breakers`, `INVT (Original)`. Nesting prefixes with the parent, same convention as the other apps:
- `cables`, `cables-nafees-cables`, `cables-nafees-cables-dc-cables`, `cables-nafees-cables-ac-cables`
- `d-b-box-with-breakers`, `invt-original`

Because the same item name can exist in two categories, **item slugs are only unique within a category, not globally** — `huawei` exists once under `packages` and once under `product-accessories`. The product-level slug (see below) is what's globally unique.

## Endpoints

### `GET /api/products/categories/`

Returns all 4 categories, each with its full item tree.

```json
[
  {
    "name": "Installation Accessories",
    "slug": "installation-accessories",
    "description": "Everything that goes around the panels and the inverter...",
    "items": [
      {
        "name": "Cables",
        "slug": "cables",
        "description": "", "image": "",
        "sub": [
          {
            "name": "Nafees Cables",
            "slug": "cables-nafees-cables",
            "description": "", "image": "",
            "sub": [
              { "name": "DC Cables", "slug": "cables-nafees-cables-dc-cables", "description": "", "image": "", "sub": [] },
              { "name": "AC Cables", "slug": "cables-nafees-cables-ac-cables", "description": "", "image": "", "sub": [] }
            ]
          }
        ]
      },
      { "name": "Structure", "slug": "structure", "description": "", "image": "", "sub": [] }
    ]
  },
  { "name": "Packages", "slug": "packages", "description": "...", "items": [
    { "name": "Huawei", "slug": "huawei", "description": "", "image": "", "sub": [] },
    { "name": "Solis", "slug": "solis", "description": "", "image": "", "sub": [] },
    { "name": "Goodwe", "slug": "goodwe", "description": "", "image": "", "sub": [] }
  ]},
  { "name": "Product Accessories", "slug": "product-accessories", "description": "...", "items": [
    { "name": "Huawei", "slug": "huawei", "description": "", "image": "", "sub": [] }
  ]},
  { "name": "VFDs", "slug": "vfds", "description": "...", "items": [ "..." ] }
]
```

- `items` key (not `brands`) — matches this app's own terminology (`productItems.js`, `getItemProducts`).
- `slug` — unique **within** the category's tree, at every depth, but (as noted above) **not** globally unique across categories.
- `sub` — always an array, `[]` for leaves, present at every depth.
- Order = display order (menu columns, listing grid).
- `description` / `image` — empty string is fine.

### `GET /api/products/products/`

Returns products. Optional query params, combinable:
- `?category=<categorySlug>`
- `?item=<itemSlug>` — **be aware this alone can match more than one product**, since item slugs repeat across categories (e.g. `?item=huawei` with no `category` matches both the Packages Huawei and the Product Accessories Huawei). Combine with `?category=` to get exactly one.

```json
[
  {
    "name": "Huawei",
    "slug": "packages-huawei",
    "brandSlug": "huawei",
    "categorySlug": "packages",
    "price": 45000,
    "image": "https://.../huawei-package.webp",
    "shortDescription": "Huawei is a placeholder..."
  }
]
```

Note `slug` is prefixed with the **category's** slug (`packages-huawei`), not a fixed string like Batteries' `battery-` — because that's what actually disambiguates two same-named items in different categories. `brandSlug` stays the clean, category-scoped item slug (`huawei`), used for the `/products/:category/:itemSlug/:productSlug` route. `categorySlug` is included here too (unlike Inverters/Batteries) because the frontend needs it to build the URL and because `brandSlug` alone is ambiguous.

Light fields only here (no `description`/`whyChoose`/`categories`).

### `GET /api/products/products/<slug>/`

Single product, full detail — `slug` is the product's own category-prefixed slug (`packages-huawei`).

```json
{
  "name": "Huawei",
  "slug": "packages-huawei",
  "brandSlug": "huawei",
  "categorySlug": "packages",
  "price": 45000,
  "image": "https://.../huawei-package.webp",
  "shortDescription": "Huawei is a placeholder...",
  "description": [
    "The Huawei package bundles panels, inverter, structure and cabling into a single ready-to-install solution...",
    "Placeholder specifications are shown here until real technical details are added."
  ],
  "whyChoose": [
    "Single-brand consistency across the whole system",
    "Simplified installation and warranty support",
    "Straightforward pricing with everything bundled",
    "Placeholder pricing - contact us for a current quote"
  ],
  "categories": ["Madni Solar", "Products", "Packages", "Huawei"]
}
```

- `image` — full absolute URL, not a relative path
- `description` — array of paragraphs (never a single block, never bullets)
- `whyChoose` — array of short checklist strings
- `categories` — breadcrumb-flavored: `["Madni Solar", "Products", category name, ...ancestor item names, item name]`
- 404 with `{"detail": "Not found."}` if the slug doesn't exist

## Notes for backend

- `Category`: plain model, 4 fixed rows (name, slug, description, order) — no join table needed, since items aren't shared between categories here (unlike Inverters' Fox/Goodwe/Knox).
- `Item` (tree node): self-referential `parent` FK for arbitrary depth (same pattern as `batteries.Brand`), **plus** a direct `category` FK on every node — including children, not just roots — so querying "everything in category X" doesn't require walking the tree. A child's `category` must match its parent's; enforce it in `clean()`/`save()` if convenient, but it doesn't need to be airtight for v1.
- `Product`: `OneToOneField` to `Item`, same as Batteries — **every** item gets one, including non-leaf nodes like "Cables". Auto-fill `slug` as `f"{item.category.slug}-{item.slug}"` in `save()` if left blank, mirroring `batteries.Product`'s `battery-` auto-fill.
- No separate breadcrumb endpoint — frontend walks the `categories/` tree client-side, same approach as the other two apps.

## Frontend wiring (once these endpoints exist)

Add `src/api/products.js` (same `client` used elsewhere — note this is a new file, separate from the existing `src/data/productsMenu.js`/`productItems.js` it replaces):

```js
import client from "./client";

export const getProductCategories = () =>
  client.get("/products/categories/").then((res) => res.data);

export const getProducts = ({ category, item } = {}) =>
  client
    .get("/products/products/", {
      params: {
        ...(category ? { category } : {}),
        ...(item ? { item } : {}),
      },
    })
    .then((res) => res.data);

export const getProduct = (slug) =>
  client.get(`/products/products/${slug}/`).then((res) => res.data);
```

Then swap the static imports for these calls in:
- `src/components/Navbar/Navbar.jsx` — fetch `getProductCategories()` once on mount (same pattern as `getInverterCategories()`/`getBatteryBrands()`), instead of importing the hardcoded `productsMenu` tree. Column layout stays a frontend-side concern.
- `src/data/productsMenu.js` — `slugifyProduct` becomes unnecessary; `getProductTrail`/`findProductCategoryForSlug` keep their signatures/output shape but walk the fetched categories tree instead of the static array.
- `src/pages/ProductsCatalogPage/ProductsCatalogPage.jsx` — swap for `getProducts()`.
- `src/pages/ProductCategoryPage/ProductCategoryPage.jsx` — swap `getProductCategory` + `getCategoryProducts` for `getProductCategories()` (find by slug) + `getProducts({ category: categorySlug })`.
- `src/pages/ProductItemPage/ProductItemPage.jsx` — swap `getProductTrail`/`findProductCategoryForSlug` (static) + `getItemProducts` for the fetched categories tree + `getProducts({ category, item: itemSlug })`.
- `src/pages/ProductItemDetailPage/ProductItemDetailPage.jsx` — swap for `getProduct(productSlug)` + fetched categories tree for the breadcrumb.
- `src/data/findProduct.js` — add a products fetch-and-cache the same way `loadInverterProducts()`/`loadBatteryProducts()` already work.
- `src/App.js` — like Inverters, the 4 category slugs (`installation-accessories`, `packages`, `product-accessories`, `vfds`) need to become a hardcoded frontend constant instead of the current `productCategories.map(...)` at import time, for the same reason: the category segment must stay a **static** route segment, not a `:param`, or it collides with the flat `/products/:itemSlug/:productSlug` fallback.
- `src/data/productsMenu.js`, `productCategories.js`, `productItems.js` — the static tree/array parts can be deleted once every consumer above is wired to the API.
