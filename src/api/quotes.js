import client from "./client";

export const sendQuoteRequest = (payload) =>
  client.post("/quotes/", payload).then((res) => res.data);

export const parseQuoteError = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 400 && data && typeof data === "object") {
    const fieldErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      // `items` errors are a list of per-item objects (e.g. [{"name": [...]}])
      // — there's no per-field input to attach those to (the items list is
      // read-only, built from the URL), so they become a form-level message.
      if (key === "items") return;
      fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
    });

    const formError =
      fieldErrors.non_field_errors ||
      fieldErrors.detail ||
      (data.items
        ? "There was a problem with the selected product(s). Please try again."
        : null) ||
      "Please check the highlighted fields and try again.";
    delete fieldErrors.non_field_errors;
    delete fieldErrors.detail;

    return { fieldErrors, formError };
  }

  if (status === 429) {
    return {
      fieldErrors: {},
      formError:
        "You have sent too many requests. Please try again later, or call us at +923 111 666 677.",
    };
  }

  // Network down, timeout, ya server 500 — number kabhi na kabhi kaam aata hai.
  return {
    fieldErrors: {},
    formError:
      "Your request could not be sent. Please check your connection or call us at +923 111 666 677.",
  };
};
