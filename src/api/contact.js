
import client from "./client";

export const sendContactMessage = (payload) =>
  client.post("/contact/", payload).then((res) => res.data);

export const parseContactError = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 400 && data && typeof data === "object") {
    const fieldErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
    });

    const formError =
      fieldErrors.non_field_errors ||
      fieldErrors.detail ||
      "Please check the highlighted fields and try again.";
    delete fieldErrors.non_field_errors;
    delete fieldErrors.detail;

    return { fieldErrors, formError };
  }

  if (status === 429) {
    return {
      fieldErrors: {},
      formError:
        "You have sent too many messages. Please try again later, or call us at +923 111 666 677.",
    };
  }

  // Network down, timeout, ya server 500 — number kabhi na kabhi kaam aata hai.
  return {
    fieldErrors: {},
    formError:
      "Your message could not be sent. Please check your connection or call us at +923 111 666 677.",
  };
};
