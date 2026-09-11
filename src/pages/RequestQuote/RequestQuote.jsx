import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./RequestQuote.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import QuoteBanner from "../../assets/hero-banner.webp";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { parseQuoteItems } from "../../data/findProduct";
import { sendQuoteRequest, parseQuoteError } from "../../api/quotes";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  message: "",
};

// Simple "Send the request" quote form component
function SendRequest() {
  // Quote ke items URL query se aate hain — ya to product detail page ka
  // single product (?product=&brand=&qty=), ya checkout ka poora basket
  // (?items=<slug>:<qty>,...). Solar panel products API se aate hain, is liye
  // parseQuoteItems async hai.
  const [searchParams] = useSearchParams();
  const [quoteItems, setQuoteItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    parseQuoteItems(searchParams).then((items) => {
      if (!cancelled) setQuoteItems(items);
    });
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const quoteTotal = quoteItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // User dobara type kare tou us field ka purana error hata do.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validate = (data) => {
    const found = {};
    if (data.firstName.trim().length < 2) {
      found.firstName = "Please enter your first name.";
    }
    if (data.lastName.trim().length < 2) {
      found.lastName = "Please enter your last name.";
    }
    if (data.phone.trim().length < 7) {
      found.phone = "Please enter a valid phone number.";
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      found.email = "Enter a valid email address.";
    }
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "sending") return;

    const clientErrors = validate(formData);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setFormError("Please fix the highlighted fields and try again.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrors({});
    setFormError("");

    try {
      await sendQuoteRequest({
        ...formData,
        items: quoteItems.map(({ product, quantity, lineTotal }) => ({
          name: product.name,
          slug: product.slug,
          price: product.price,
          quantity,
          lineTotal,
        })),
        quoteTotal,
      });
      setStatus("success");
      setFormData(EMPTY_FORM);
    } catch (error) {
      const { fieldErrors, formError: message } = parseQuoteError(error);
      setErrors(fieldErrors);
      setFormError(message);
      setStatus("error");
    }
  };

  return (
    <div>
    <Navbar/>
        <PageBanner
        image={QuoteBanner}
        title="Request a Quote"
        currentPage="Request a Quote"
      />

    <div className="request-container flex justify-start">
      <div className="request-column">
        <h1 className="request-title">Send the request</h1>

        {/* Quote ke items — product detail page ya checkout basket se aate hain */}
        {quoteItems.length > 0 && (
          <div className="quote-items">
            <h2 className="quote-items-title">
              Products in this quote ({quoteItems.length})
            </h2>

            <ul className="quote-items-list">
              {quoteItems.map(({ product, quantity, lineTotal }) => (
                <li className="quote-product-card" key={product.slug}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="quote-product-image"
                  />
                  <div className="quote-product-info">
                    <h3 className="quote-product-name">{product.name}</h3>
                    <p className="quote-product-price">
                      Rs{product.price.toLocaleString()}
                      <span className="quote-product-qty">
                        {" "}
                        &times; {quantity}
                      </span>
                    </p>
                    <p className="quote-product-total">
                      Total: Rs{lineTotal.toLocaleString()}
                    </p>
                    {product.categories && product.categories.length > 0 && (
                      <div className="quote-product-categories">
                        {product.categories.map((category) => (
                          <span key={category} className="quote-product-badge">
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {quoteItems.length > 1 && (
              <div className="quote-items-total">
                <span>Quote total</span>
                <span>Rs{quoteTotal.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {status === "success" ? (
          <div className="request-success">
            <h3>Thank you!</h3>
            <p>Your quote request has been received. We will contact you soon.</p>
          </div>
        ) : (
          <form className="request-form" onSubmit={handleSubmit} noValidate>
            {formError && (
              <p className="request-form-error" role="alert">
                {formError}
              </p>
            )}

            {/* First Name field */}
            <div className="form-group">
              <label htmlFor="firstName">
                First Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && (
                <span className="request-field-error">{errors.firstName}</span>
              )}
            </div>

            {/* Last Name field */}
            <div className="form-group">
              <label htmlFor="lastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName && (
                <span className="request-field-error">{errors.lastName}</span>
              )}
            </div>

            {/* Phone field */}
            <div className="form-group">
              <label htmlFor="phone">
                Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <span className="request-field-error">{errors.phone}</span>
              )}
            </div>

            {/* Email field (optional) */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <span className="request-field-error">{errors.email}</span>
              )}
            </div>

            {/* Message field (optional) */}
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* Submit button */}
            <button type="submit" className="btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "SENDING..." : "SEND YOUR REQUEST"}
            </button>
          </form>
        )}
      </div>
    </div>

    <Footer/>
    </div>
  );
}

export default SendRequest;
