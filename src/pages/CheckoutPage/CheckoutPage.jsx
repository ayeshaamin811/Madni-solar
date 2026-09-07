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
    name: "",
    email: "",
    address: "",
    phone: "",
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
              <h2 className="checkout-success-title">Thank you, {form.name || "customer"}!</h2>
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
              <form className="checkout-form" onSubmit={handleSubmit}>
                <h3 className="checkout-form-title">Billing Details</h3>

                <label className="checkout-label" htmlFor="checkout-name">
                  Full Name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  className="checkout-input"
                  placeholder="e.g. Ali Khan"
                  value={form.name}
                  onChange={updateField("name")}
                  required
                />

                <label className="checkout-label" htmlFor="checkout-email">
                  Email *
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

                <label className="checkout-label" htmlFor="checkout-address">
                  Address *
                </label>
                <textarea
                  id="checkout-address"
                  className="checkout-input checkout-textarea"
                  placeholder="Street, city, province..."
                  value={form.address}
                  onChange={updateField("address")}
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

                <button type="submit" className="checkout-submit-btn">
                  Place Order
                </button>
              </form>

              {/* ===== Order summary ===== */}
              <aside className="checkout-summary">
                <h3 className="checkout-summary-title">
                  Order Summary ({cartCount})
                </h3>

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

                <div className="checkout-summary-total">
                  <span>Subtotal</span>
                  <span>Rs{subtotal.toLocaleString()}</span>
                </div>
                <p className="checkout-summary-note">
                  Payment gateway and shipping will be added here soon.
                </p>
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