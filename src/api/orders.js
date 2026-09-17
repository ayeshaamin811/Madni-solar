import client from "./client";

export const placeOrder = (payload) =>
  client.post("/orders/", payload).then((res) => res.data);

// Flat shipping + currency backend settings se aate hain, taake number ek hi
// jagah rahe. Endpoint na chale tou CheckoutPage apne fallback par chalta hai.
export const getOrderSettings = () =>
  client.get("/orders/settings/").then((res) => res.data);

export const parseOrderError = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 400 && data && typeof data === "object") {
    const fieldErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      // `items` errors basket ke baare mein hote hain (stale slug, hat chuka
      // product) — un ke liye form par koi input nahi, is liye ye form-level
      // message ban jata hai, neeche.
      if (key === "items") return;
      fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
    });

    const itemsError = Array.isArray(data.items) ? data.items[0] : data.items;

    const formError =
      fieldErrors.non_field_errors ||
      fieldErrors.detail ||
      (itemsError ? String(itemsError) : null) ||
      "Please check the highlighted fields and try again.";
    delete fieldErrors.non_field_errors;
    delete fieldErrors.detail;

    return { fieldErrors, formError };
  }

  if (status === 429) {
    return {
      fieldErrors: {},
      formError:
        "Too many orders from this device. Please try again later, or call us at +923 111 666 677.",
    };
  }

  // Network down, timeout, ya server 500 — number kabhi na kabhi kaam aata hai.
  return {
    fieldErrors: {},
    formError:
      "Your order could not be placed. Please check your connection or call us at +923 111 666 677.",
  };
};
