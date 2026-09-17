import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { useCart } from "../../context/CartContext";
import { buildCartQuoteLink } from "../../data/findProduct";
import { placeOrder, getOrderSettings, parseOrderError } from "../../api/orders";
import heroBanner from "../../assets/hero-banner.webp";
import "./CheckoutPage.css";

// Backend `ORDER_FLAT_SHIPPING` bhejta hai; jab tak wo load na ho (ya endpoint
// na chale) tab tak yehi default chalta hai. Backend apne constant se total
// dobara ginta hai, is liye dono ka same hona zaroori hai.
const DEFAULT_SHIPPING = 2000;

function CheckoutPage() {
  const { cartItems, subtotal, cartCount, clearBasket } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postCode: "",
    phone: "",
    email: "",
    businessName: "",
    orderNotes: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [shipping, setShipping] = useState(DEFAULT_SHIPPING);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [orderNumber, setOrderNumber] = useState("");

  const total = subtotal + shipping;

  // Shipping rate backend se — fail ho jaye tou chup chaap default par raho.
  useEffect(() => {
    let cancelled = false;
    getOrderSettings()
      .then((data) => {
        if (!cancelled && typeof data?.flatShipping === "number") {
          setShipping(data.flatShipping);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field) => (e) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [field]: value }));

    // User dobara type kare tou us field ka purana error hata do.
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "sending") return;

    if (!agreedToTerms) {
      setErrors({
        agreedToTerms:
          "Please accept the terms and conditions to place your order.",
      });
      setFormError("Please fix the highlighted fields and try again.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrors({});
    setFormError("");

    try {
      const data = await placeOrder({
        ...form,
        agreedToTerms,
        // Sirf wo fields jo backend maangta hai — cart ka `image` (bundled
        // frontend asset) jaan bujh kar chhora ja raha hai.
        items: cartItems.map(({ name, slug, price, quantity }) => ({
          name,
          slug,
          price,
          quantity,
          lineTotal: price * quantity,
        })),
        subtotal,
        shipping,
        total,
      });

      setOrderNumber(data?.orderNumber || "");
      clearBasket();
      setStatus("success");
    } catch (error) {
      const { fieldErrors, formError: message } = parseOrderError(error);
      setErrors(fieldErrors);
      setFormError(message);
      setStatus("error");
    }
  };

  const sending = status === "sending";

  return (
    <div>
      <Navbar />
      <PageBanner image={heroBanner} title="Checkout" currentPage="Checkout" />

      <section className="checkout-content">
        <div className="container">
          {status === "success" ? (
            <div className="checkout-success">
              <h2 className="checkout-success-title">
                Thank you,{" "}
                {[form.firstName, form.lastName].filter(Boolean).join(" ") ||
                  "customer"}
                !
              </h2>
              {orderNumber && (
                <p className="checkout-order-number">
                  Order number: <strong>{orderNumber}</strong>
                </p>
              )}
              <p className="checkout-success-text">
                Your order request has been received. No payment has been taken
                — our team will contact you at{" "}
                <strong>{form.phone || form.email}</strong> to confirm your
                order and arrange delivery. A confirmation email is on its way
                to <strong>{form.email}</strong>.
              </p>
              <Link to="/our-products" className="checkout-success-btn">
                Continue Shopping
              </Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="checkout-empty">
              <h2 className="checkout-empty-title">Your basket is empty</h2>
              <p className="checkout-empty-text">
                Add some products before proceeding to checkout.
              </p>
              <Link to="/our-products" className="checkout-empty-btn">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="checkout-grid">
              {/* ===== Billing form ===== */}
              <form
                className="checkout-form"
                id="checkout-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <h3 className="checkout-form-title">Billing Details</h3>

                {formError && (
                  <p className="checkout-form-error" role="alert">
                    {formError}
                  </p>
                )}

                <label className="checkout-label" htmlFor="checkout-first-name">
                  First Name *
                </label>
                <input
                  id="checkout-first-name"
                  type="text"
                  className="checkout-input"
                  placeholder="e.g. Ali"
                  value={form.firstName}
                  onChange={updateField("firstName")}
                  aria-invalid={Boolean(errors.firstName)}
                  required
                />
                {errors.firstName && (
                  <span className="checkout-field-error">
                    {errors.firstName}
                  </span>
                )}

                <label className="checkout-label" htmlFor="checkout-last-name">
                  Last Name *
                </label>
                <input
                  id="checkout-last-name"
                  type="text"
                  className="checkout-input"
                  placeholder="e.g. Khan"
                  value={form.lastName}
                  onChange={updateField("lastName")}
                  aria-invalid={Boolean(errors.lastName)}
                  required
                />
                {errors.lastName && (
                  <span className="checkout-field-error">
                    {errors.lastName}
                  </span>
                )}

                <label className="checkout-label" htmlFor="checkout-country">
                  Country/Region
                </label>
                <div className="checkout-country" id="checkout-country">
                  Pakistan
                </div>

                <label className="checkout-label" htmlFor="checkout-address">
                  House number and street name *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  className="checkout-input"
                  placeholder="House number and street name"
                  value={form.address}
                  onChange={updateField("address")}
                  aria-invalid={Boolean(errors.address)}
                  required
                />
                {errors.address && (
                  <span className="checkout-field-error">{errors.address}</span>
                )}

                <label className="checkout-label" htmlFor="checkout-apartment">
                  Apartment, suite, unit, etc. (optional)
                </label>
                <input
                  id="checkout-apartment"
                  type="text"
                  className="checkout-input"
                  placeholder="Apartment, suite, unit, etc."
                  value={form.apartment}
                  onChange={updateField("apartment")}
                  aria-invalid={Boolean(errors.apartment)}
                />
                {errors.apartment && (
                  <span className="checkout-field-error">
                    {errors.apartment}
                  </span>
                )}

                <label className="checkout-label" htmlFor="checkout-city">
                  City *
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  className="checkout-input"
                  placeholder="e.g. Lahore"
                  value={form.city}
                  onChange={updateField("city")}
                  aria-invalid={Boolean(errors.city)}
                  required
                />
                {errors.city && (
                  <span className="checkout-field-error">{errors.city}</span>
                )}

                <label className="checkout-label" htmlFor="checkout-state">
                  State/Province
                </label>
                <select
                  id="checkout-state"
                  className="checkout-input checkout-select"
                  value={form.state}
                  onChange={updateField("state")}
                  aria-invalid={Boolean(errors.state)}
                >
                  <option value="">Select state/province</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Islamabad Capital Territory">
                    Islamabad Capital Territory
                  </option>
                </select>
                {errors.state && (
                  <span className="checkout-field-error">{errors.state}</span>
                )}

                <label className="checkout-label" htmlFor="checkout-post-code">
                  Post Code *
                </label>
                <input
                  id="checkout-post-code"
                  type="text"
                  className="checkout-input"
                  placeholder="e.g. 54000"
                  value={form.postCode}
                  onChange={updateField("postCode")}
                  aria-invalid={Boolean(errors.postCode)}
                  required
                />
                {errors.postCode && (
                  <span className="checkout-field-error">
                    {errors.postCode}
                  </span>
                )}

                <label className="checkout-label" htmlFor="checkout-phone">
                  Phone *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  className="checkout-input"
                  placeholder="03XX-XXXXXXX"
                  value={form.phone}
                  onChange={updateField("phone")}
                  aria-invalid={Boolean(errors.phone)}
                  required
                />
                {errors.phone && (
                  <span className="checkout-field-error">{errors.phone}</span>
                )}

                <label className="checkout-label" htmlFor="checkout-email">
                  Email Address *
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  className="checkout-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField("email")}
                  aria-invalid={Boolean(errors.email)}
                  required
                />
                {errors.email && (
                  <span className="checkout-field-error">{errors.email}</span>
                )}

                <label className="checkout-label" htmlFor="checkout-business">
                  Business Name (optional)
                </label>
                <input
                  id="checkout-business"
                  type="text"
                  className="checkout-input"
                  placeholder="Business name (optional)"
                  value={form.businessName}
                  onChange={updateField("businessName")}
                  aria-invalid={Boolean(errors.businessName)}
                />
                {errors.businessName && (
                  <span className="checkout-field-error">
                    {errors.businessName}
                  </span>
                )}

                <label className="checkout-label" htmlFor="checkout-notes">
                  Order Notes
                </label>
                <textarea
                  id="checkout-notes"
                  className="checkout-input checkout-textarea"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  value={form.orderNotes}
                  onChange={updateField("orderNotes")}
                  aria-invalid={Boolean(errors.orderNotes)}
                />
                {errors.orderNotes && (
                  <span className="checkout-field-error">
                    {errors.orderNotes}
                  </span>
                )}
              </form>

              {/* ===== Order summary ===== */}
              <aside className="checkout-summary">
                <h3 className="checkout-summary-title">
                  Order Summary ({cartCount})
                </h3>

                <div className="checkout-summary-head">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>

                <ul className="checkout-summary-items">
                  {cartItems.map((item) => (
                    <li className="checkout-summary-item" key={item.slug}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="checkout-summary-img"
                      />
                      <span className="checkout-summary-name">{item.name}</span>
                      <span className="checkout-summary-qty">
                        × {item.quantity}
                      </span>
                      <span className="checkout-summary-price">
                        Rs{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="checkout-summary-row checkout-summary-subtotal">
                  <span>Subtotal</span>
                  <span>Rs{subtotal.toLocaleString()}</span>
                </div>

                <div className="checkout-summary-row checkout-summary-shipment">
                  <span>Shipment</span>
                  <span className="checkout-shipment-label">Flat rate:</span>
                  <span>Rs{shipping.toLocaleString()}</span>
                </div>

                <div className="checkout-summary-row checkout-summary-total-row">
                  <span>Total</span>
                  <span>Rs{total.toLocaleString()}</span>
                </div>

                <label className="checkout-agree">
                  <input
                    type="checkbox"
                    className="checkout-agree-checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      setErrors((prev) => {
                        if (!prev.agreedToTerms) return prev;
                        const next = { ...prev };
                        delete next.agreedToTerms;
                        return next;
                      });
                    }}
                  />
                  <span>
                    I have read and agree to the website{" "}
                    <Link
                      to="/terms-and-conditions"
                      className="checkout-agree-link"
                    >
                      terms and conditions
                    </Link>{" "}
                    *
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <span className="checkout-field-error">
                    {errors.agreedToTerms}
                  </span>
                )}

                <div className="checkout-actions">
                  <Link
                    to={buildCartQuoteLink(cartItems)}
                    className="checkout-quote-btn"
                  >
                    OR ASK FOR A QUOTE
                  </Link>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="checkout-order-btn"
                    disabled={sending}
                  >
                    {sending ? "PLACING ORDER..." : "PLACE ORDER"}
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
