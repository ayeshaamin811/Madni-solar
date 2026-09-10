# Calculator API

Backend for the Solar Calculator page (`/calculator`, `src/pages/CalculatorPage/CalculatorPage.jsx`). Frontend currently only `console.log`s the payload on submit — no API call is wired up yet. Follow the same pattern as `src/api/contact.js` (Django REST Framework, one `POST` endpoint, field-level 400 errors, 429 throttle).

## Endpoint

```
POST /api/calculator/
```

Request must be `multipart/form-data` (there's a file upload).

## Request fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `meterType` | string | yes | `"single"` or `"three"` |
| `billAmount` | number | yes | Rs., average monthly bill, > 0 |
| `billUnits` | number | yes | average monthly units, > 0 |
| `billFile` | file | no | electricity bill image/PDF, max 5 MB |
| `fullName` | string | yes | min 2 chars |
| `phone` | string | yes | min 7 chars |
| `email` | string | yes | valid email |
| `houseArea` | number | yes | Marla, > 0 |
| `address` | string | yes | min 5 chars |
| `loads` | JSON object | yes | qty per appliance, see keys below |
| `loadCalculated` | number | yes | total load in kW, computed client-side (qty × watt / 1000), send as a cross-check |

`loads` keys (all integers, 0–10): `ledBulbs`, `tubeLights`, `fans`, `refrigerators`, `ac1Ton`, `ac1_5Ton`, `ac2Ton`, `ups1kw`, `motor1hp`.

Since this is `multipart/form-data`, `loads` should be sent as a JSON string field (parse with `json.loads` server-side), same as how `billFile` rides alongside the other plain fields.

## Success response

`201 Created`, body echoing the saved submission (or just `{"success": true}` — match whatever `contact.js`'s success path expects, i.e. `res.data`).

## Error response

Same shape as the contact endpoint, so `parseContactError`-style parsing on the frontend keeps working:

- `400` — field errors: `{"fieldName": ["message"], ...}` (or `non_field_errors` / `detail` for a form-level message)
- `429` — throttled, generic message
- `5xx` / network — generic "please try again" message

## Frontend wiring (once the endpoint exists)

Add `src/api/calculator.js` mirroring `src/api/contact.js`:

```js
import client from "./client";

export const sendCalculatorRequest = (formData) =>
  client.post("/calculator/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);

export const parseCalculatorError = (error) => { /* same as parseContactError */ };
```

Then in `CalculatorPage.jsx`, replace the `console.log(...)` in `handleSubmit` with a call to `sendCalculatorRequest`, and use `setStatus("success")` / `setFormError(...)` the same way `ContactPage.jsx` does.
