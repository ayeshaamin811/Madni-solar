# Checkout / Orders API

Backend for the "Place Order" button on `/checkout` (`src/pages/CheckoutPage/CheckoutPage.jsx`). The frontend currently does nothing on submit — `handleSubmit` just sets `submitted = true` and shows a "this is a demo checkout, no payment has been processed" message. No API call is wired up yet.

This is a **form-submission API, not a payment API**. There is no payment gateway in this project and none is being asked for here — an order is a *request to buy* that the sales team then confirms by phone, exactly like `/api/quotes/`. Follow the same Django REST Framework pattern as `src/api/contact.js` and `src/api/quotes.js`: one `POST` endpoint, field-level 400 errors, 429 throttle, team notification + customer confirmation emails.

## Endpoint

```
POST /api/orders/
```

`application/json` (no file upload).

## Request fields

Billing fields map 1:1 to the `form` state in `CheckoutPage.jsx`, so keep these exact camelCase names.

| Field | Type | Required | Notes |
|---|---|---|---|
| `firstName` | string | yes | min 2 chars |
| `lastName` | string | yes | min 2 chars |
| `address` | string | yes | house number + street, min 5 chars |
| `apartment` | string | no | apartment / suite / unit |
| `city` | string | yes | min 2 chars |
| `state` | string | no | one of the 7 values in the dropdown (see below) |
| `postCode` | string | yes | string, **not** a number — leading zeros matter |
| `phone` | string | yes | min 7 chars |
| `email` | string | yes | valid email (required here, unlike `/api/quotes/`) |
| `businessName` | string | no | optional |
| `orderNotes` | string | no | free text, delivery instructions etc. |
| `agreedToTerms` | boolean | yes | must be `true` — reject `false` with a field error |
| `items` | array | yes | must be non-empty; the checkout page is unreachable with an empty basket |
| `subtotal` | number | yes | sum of all `lineTotal`s, sent as a cross-check |
| `shipping` | number | yes | currently always `2000` (flat rate, hardcoded in the UI) |
| `total` | number | yes | `subtotal + shipping`, sent as a cross-check |

Country is **not** a field — the UI shows "Pakistan" as static text, so store it as a constant server-side.

`state` allowed values: `Punjab`, `Sindh`, `Khyber Pakhtunkhwa`, `Balochistan`, `Azad Kashmir`, `Gilgit-Baltistan`, `Islamabad Capital Territory`.

Each entry in `items` (this is exactly what `CartContext` stores per line, plus the computed `lineTotal`):

```json
{
  "name": "Huawei SUN2000 5KTL Inverter",
  "slug": "huawei-sun2000-5ktl-inverter",
  "price": 185000,
  "quantity": 2,
  "lineTotal": 370000
}
```

The cart also holds an `image` per line, but that's a bundled frontend asset URL — don't require it, and don't store it as the product image. Resolve the real image from the catalogue via `slug` if the confirmation email needs one.

## Resolving `slug` server-side

`slug` is **globally unique across all four catalogues**, by design — that's why `productItems.js` prefixes with the category (`packages-huawei`) and `batteryProducts.js` prefixes with `battery-` (`battery-huawei`). Without the prefixes a Huawei package, a Huawei battery and a Huawei inverter would collide. So the backend can resolve a line by trying each catalogue in turn:

| Catalogue | Existing detail endpoint | Slug shape |
|---|---|---|
| Solar Panels | `GET /api/solar-panels/products/<slug>/` | plain (`yingli-solar-550w-mono-panel`) |
| Inverters | `GET /api/inverters/products/<slug>/` | plain (`inverex-nitrox-6kw`) |
| Batteries | `GET /api/batteries/products/<slug>/` | `battery-` prefixed |
| Products (Accessories) | `GET /api/products/products/<slug>/` | category-prefixed |

Internally this should be a direct model query per app, not four HTTP round-trips.

### Price verification

**Recommended: verify, don't trust.** `price` and the three totals come from the browser, where they can be edited. On each line:

1. Look the slug up in the catalogues above.
2. If found, use the **server's** price for the stored `lineTotal` and recompute `subtotal` / `total` server-side. Store the client-sent values too, so a mismatch is visible in the admin.
3. If the recomputed total differs from the submitted `total`, return `400` with a `non_field_errors` message like *"Prices have changed since you added these items. Please refresh your basket."*
4. If the slug isn't found in any catalogue (stale `localStorage` — the cart persists under `madniSolarCart` indefinitely, so this will happen after a catalogue edit), return `400` with an `items` error naming the offending slug.

If step 1–3 is more than you want in the first pass, storing the client values as-is is acceptable — the sales team confirms every order by phone anyway — but then say so explicitly in the admin so nobody treats the stored total as authoritative.

### Shipping

`2000` flat is hardcoded in `CheckoutPage.jsx` today. Put it in Django settings (`ORDER_FLAT_SHIPPING = 2000`) and ideally expose it, so the number lives in one place:

```
GET /api/orders/settings/   ->   { "flatShipping": 2000, "currency": "PKR" }
```

Optional — if you skip it, the frontend keeps its hardcoded `2000` and the backend must use the same constant.

## Success response

`201 Created`:

```json
{
  "id": 12,
  "orderNumber": "MS-2026-0012",
  "total": 372000,
  "message": "Thank you! Your order has been received. Our team will contact you shortly to confirm."
}
```

`orderNumber` is a human-readable reference the customer can quote on the phone — generate it server-side, don't ask the frontend for one. The success screen will show it.

## Error response

Same shape as `/api/contact/`, `/api/calculator/` and `/api/quotes/`, so a `parseQuoteError`-style parser keeps working:

- `400` — field errors: `{"fieldName": ["message"], ...}`; basket-level problems under `items`, cross-field problems under `non_field_errors`
- `429` — throttled (suggest 5/hour per IP, same as the other form endpoints)
- `5xx` / network — generic failure

## Model sketch

Two models, mirroring how the quote app stores its lines:

- **`Order`** — all billing fields above, plus `country` (constant `"Pakistan"`), `orderNumber` (unique), `subtotal`, `shipping`, `total`, `agreedToTerms`, `status`, `createdAt`.
- **`OrderItem`** — FK to `Order`, plus `name`, `slug`, `price`, `quantity`, `lineTotal`. Store the name/price **as a snapshot on the row**, not as an FK to the catalogue — the price the customer saw must survive a later catalogue edit. There is no single FK target anyway, since lines come from four different apps.

`status` choices: `pending` → `confirmed` → `completed`, plus `cancelled`. Default `pending`. Editable in the Django admin; the frontend never sets or reads it.

Register both in the admin with `OrderItem` as an inline, list display on order number / customer name / phone / total / status / date, and search on order number, phone and email — the sales team will work out of this screen.

## Emails

Same as the `quotes` app:

- **Team notification** to `ORDER_NOTIFY_EMAILS` (default like the others) — full billing block, item table, subtotal / shipping / total, order notes.
- **Customer confirmation** to `email` (always present, since it's required here) — order number, item table, totals, and a line that this is an order request and the team will call to confirm; no payment has been taken.

## Frontend wiring (once the endpoint exists)

**1.** Add `src/api/orders.js`, mirroring `src/api/quotes.js`:

```js
import client from "./client";

export const placeOrder = (payload) =>
  client.post("/orders/", payload).then((res) => res.data);

export const parseOrderError = (error) => { /* same shape as parseQuoteError */ };
```

**2.** `CartContext.jsx` currently exposes only `addToBasket` / `removeFromBasket` — **it has no way to empty the basket**, so a `clearBasket` has to be added to the provider value and called after a successful order, or the customer's items sit in `localStorage` forever:

```js
const clearBasket = () => setCartItems([]);
```

**3.** In `CheckoutPage.jsx`:
- The terms checkbox is currently uncontrolled and unvalidated — give it state and send it as `agreedToTerms`.
- Replace the `setSubmitted(true)` placeholder with `placeOrder({...form, agreedToTerms, items: cartItems.map(...), subtotal, shipping: 2000, total: subtotal + 2000 })`.
- Add `status` / `errors` / `formError` state the same way `ContactPage.jsx` does (idle → sending → success/error), disable the Place Order button while sending, and show the returned `orderNumber` on the success screen in place of the "demo checkout" wording.
