# Solar Panels API

Goal: replace `src/data/solarPanelBrands.js` and `src/data/solarProducts.js` (static JS files) with real backend data. Read-only, public, no auth — same as `contact`/`calculator` apps, but GET instead of POST. Follow the same Django REST Framework style as those apps.

## What becomes dynamic

| Currently static (frontend) | Becomes |
|---|---|
| `solarPanelBrands` array (18 brands) | `GET /api/solar-panels/brands/` |
| `solarPanelProducts` array (1 product per brand) | `GET /api/solar-panels/products/` (all) and `GET /api/solar-panels/products/?brand=<slug>` (one brand's products, used on the brand page) |
| single product lookup by slug | `GET /api/solar-panels/products/<slug>/` |

Everything else (routes, pages, cart, quote flow) stays exactly as it is — only where the data comes from changes.

## Endpoints

### `GET /api/solar-panels/brands/`

Returns all brands.

```json
[
  { "name": "Yingli", "slug": "yingli", "description": "", "image": "" },
  { "name": "Astronergy", "slug": "astronergy", "description": "", "image": "" }
]
```

- `slug` — must be unique, used in the URL (`/solar-panels/:brandSlug`)
- `description` / `image` — can be empty string, frontend already falls back to a default banner when `image` is empty

### `GET /api/solar-panels/products/`

Returns all products (used on the `/solar-panels` listing page). Optional query param `?brand=<brandSlug>` filters to one brand's products (used on `/solar-panels/:brandSlug`).

```json
[
  {
    "name": "Yingli Solar 550W Mono Panel",
    "slug": "yingli-solar-550w-mono-panel",
    "brandSlug": "yingli",
    "price": 18500,
    "image": "https://.../yingli-550w.webp",
    "shortDescription": "The Yingli Solar 550W Mono Panel is a high-efficiency..."
  }
]
```

This listing response can be the "light" fields only (no `description`/`whyChoose`/`categories`) — those are only needed on the detail page below.

### `GET /api/solar-panels/products/<slug>/`

Single product, full detail.

```json
{
  "name": "Yingli Solar 550W Mono Panel",
  "slug": "yingli-solar-550w-mono-panel",
  "brandSlug": "yingli",
  "price": 18500,
  "image": "https://.../yingli-550w.webp",
  "shortDescription": "The Yingli Solar 550W Mono Panel is a high-efficiency...",
  "description": [
    "The Yingli Solar 550W Panel is engineered to deliver strong and consistent power output...",
    "It uses high-purity monocrystalline cells to maximize energy conversion efficiency...",
    "Its rugged frame and tempered glass ensure long-term durability..."
  ],
  "whyChoose": [
    "High power output for residential and commercial use",
    "Monocrystalline cells for maximum efficiency",
    "Low degradation & long lifespan",
    "Strong durability with tempered glass"
  ],
  "categories": ["Madni Solar", "Solar Panels", "Yingli"]
}
```

- `image` — full absolute URL (Django `MEDIA_URL`), not a relative path
- `description` — array of paragraph strings (never a single block of text, never bullet points)
- `whyChoose` — array of short checklist strings
- 404 with a plain error body if the slug doesn't exist: `{"detail": "Not found."}`

## Frontend wiring (once these endpoints exist)

Add `src/api/solarPanels.js` (same `client` used by `src/api/contact.js` / `src/api/calculator.js`):

```js
import client from "./client";

export const getSolarPanelBrands = () =>
  client.get("/solar-panels/brands/").then((res) => res.data);

export const getSolarPanelProducts = (brandSlug) =>
  client
    .get("/solar-panels/products/", { params: brandSlug ? { brand: brandSlug } : {} })
    .then((res) => res.data);

export const getSolarPanelProduct = (slug) =>
  client.get(`/solar-panels/products/${slug}/`).then((res) => res.data);
```

Then swap the static imports for these calls in:
- `src/pages/SolarPanelsPage/SolarPanelsPage.jsx` (imports `solarProducts` today)
- `src/pages/SolarPanelBrandPage/SolarPanelBrandPage.jsx` (imports `solarPanelBrands` + `solarProducts` today)
- `src/pages/ProductDetailPage/ProductDetailPage.jsx` (solar panel's detail page)
- `src/data/findProduct.js` — its `allProducts` array currently includes the static `solarPanelProducts`; this needs the same data so `Add to Quote` keeps working.
