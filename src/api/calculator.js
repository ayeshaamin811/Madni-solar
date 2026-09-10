import client from "./client";

export const sendCalculatorRequest = (formData) =>
  client
    .post("/calculator/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const parseCalculatorError = (error) => {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 400 && data && typeof data === "object") {
    const fieldErrors = {};
    Object.entries(data).forEach(([key, value]) => {
      fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
    });

    const formError =
      fieldErrors.non_field_errors ||
      fieldErrors.loads ||
      fieldErrors.detail ||
      "Please check the highlighted fields and try again.";
    delete fieldErrors.non_field_errors;
    delete fieldErrors.loads;
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
