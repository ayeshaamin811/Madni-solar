# Request a Quote API

Backend for the "Send the request" form on `/request-quote` (`src/pages/RequestQuote/RequestQuote.jsx`). Frontend currently only `console.log`s the payload on submit — no API call is wired up yet. Same pattern as `src/api/contact.js`: Django REST Framework, one `POST` endpoint, field-level 400 errors, 429 throttle, team notification + customer confirmation emails.

This is a **simple form-submission API, not a catalog API**. The selected product(s) are sent as plain data (name, price, qty) exactly as the customer sees them on the page — the backend does not look them up in a product database, because three of the four catalogue types (Inverters, Batteries, Products) aren't backed by Django models yet, only Solar Panels is. Same reasoning as the Calculator app's `loads` field.

## Endpoint

```
POST /api/quotes/
```

`application/json` (no file upload here, so no multipart needed).

## Request fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `firstName` | string | yes | min 2 chars |
| `lastName` | string | yes | min 2 chars |
| `phone` | string | yes | min 7 chars |
| `email` | string | no | valid email if present |
| `message` | string | no | free text |
| `items` | array | no | can be empty — a visitor can submit a general enquiry with no product picked |
| `quoteTotal` | number | no | sum of all `lineTotal`s, sent as a cross-check |

Each entry in `items`:

```json
{ "name": "Yingli Solar 550W Mono Panel", "slug": "yingli-solar-550w-mono-panel", "price": 18500, "quantity": 1, "lineTotal": 18500 }
```

## Success response

`201 Created`:

```json
{ "id": 7, "message": "Thank you! Your quote request has been received. We will contact you soon." }
```

## Error response

Same shape as `/api/contact/` and `/api/calculator/`:

- `400` — field errors: `{"fieldName": ["message"], ...}`
- `429` — throttled (suggest 5/hour per IP, same as contact/calculator)
- `5xx` / network — generic failure

## Emails

Same as the `calculator` app: a team notification (to `QUOTE_NOTIFY_EMAILS`, defaulting like the others) and a customer auto-reply (to `email`, only if the customer provided one) — both listing the submitted items and the quote total.

## Frontend wiring (once the endpoint exists)

Add `src/api/quotes.js` mirroring `src/api/contact.js`:

```js
import client from "./client";

export const sendQuoteRequest = (payload) =>
  client.post("/quotes/", payload).then((res) => res.data);

export const parseQuoteError = (error) => { /* same shape as parseContactError */ };
```

Then in `RequestQuote.jsx`'s `handleSubmit`, replace the `console.log(...)` with a call to `sendQuoteRequest({ firstName, lastName, phone, email, message, items: quoteItems.map(...), quoteTotal })`, and add `status`/`errors`/`formError` state the same way `ContactPage.jsx` does (idle → sending → success/error), showing a success message in place of the form once it's sent.
