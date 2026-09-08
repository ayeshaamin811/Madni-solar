import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { useCart } from "../../context/CartContext";
import heroBanner from "../../assets/hero-banner.webp";
import "./CheckoutPage.css";

function CheckoutPage() {
  const { cartItems, subtotal, cartCount } = useCart();

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

  const [submitted, setSubmitted] = useState(false);

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // No real payment/backend yet — just a UI placeholder.
    setSubmitted(true);
  };

  return (
    <div>
      <Navbar />
      <PageBanner image={heroBanner} title="Checkout" currentPage="Checkout" />

      <section className="checkout-content">
        <div className="container">
          {cartItems.length === 0 && !submitted ? (
            <div className="checkout-empty">
              <h2 className="checkout-empty-title">Your basket is empty</h2>
              <p className="checkout-empty-text">
                Add some products before proceeding to checkout.
              </p>
              <Link to="/our-products" className="checkout-empty-btn">
                Browse Products
              </Link>
            </div>
          ) : submitted ? (
            <div className="checkout-success">
              <h2 className="checkout-success-title">
                Thank you,{" "}
                {[form.firstName, form.lastName].filter(Boolean).join(" ") ||
                  "customer"}
                !
              </h2>
              <p className="checkout-success-text">
                Your order request has been received. This is a demo checkout,
                so no payment has been processed yet. Our team will contact you
                at{" "}
                <strong>{form.phone || form.email || "your contact details"}</strong>{" "}
                to confirm your order.
              </p>
              <Link to="/our-products" className="checkout-success-btn">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="checkout-grid">
              {/* ===== Billing form ===== */}
              <form
                className="checkout-form"
                id="checkout-form"
                onSubmit={handleSubmit}
              >
                <h3 className="checkout-form-title">Billing Details</h3>

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
                  required
                />

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
                  required
                />

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
                  required
                />

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
                />

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
                  required
                />

                <label className="checkout-label" htmlFor="checkout-state">
                  State/Province
                </label>
                <select
                  id="checkout-state"
                  className="checkout-input checkout-select"
                  value={form.state}
                  onChange={updateField("state")}
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
                  required
                />

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
                  required
                />

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
                  required
                />

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
                />

                <label className="checkout-label" htmlFor="checkout-notes">
                  Order Notes
                </label>
                <textarea
                  id="checkout-notes"
                  className="checkout-input checkout-textarea"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  value={form.orderNotes}
                  onChange={updateField("orderNotes")}
                />
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
                  <span>Rs2,000</span>
                </div>

                <div className="checkout-summary-row checkout-summary-total-row">
                  <span>Total</span>
                  <span>Rs{(subtotal + 2000).toLocaleString()}</span>
                </div>

                <label className="checkout-agree">
                  <input type="checkbox" className="checkout-agree-checkbox" />
                  <span>
                    I have read and agree to the website{" "}
                    <span className="checkout-agree-link">
                      terms and conditions
                    </span>{" "}
                    *
                  </span>
                </label>

                <div className="checkout-actions">
                  <Link to="/request-quote" className="checkout-quote-btn">
                    OR ASK FOR A QUOTE
                  </Link>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="checkout-order-btn"
                  >
                    PLACE ORDER
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