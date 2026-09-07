import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { useCart } from "../../context/CartContext";
import heroBanner from "../../assets/hero-banner.webp";
import "./CartPage.css";

function CartPage() {
  const { cartItems, cartCount, subtotal, removeFromBasket } = useCart();

  return (
    <div>
      <Navbar />
      <PageBanner image={heroBanner} title="Shopping Cart" currentPage="Cart" />

      <section className="cart-content">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <h2 className="cart-empty-title">Your basket is empty</h2>
              <p className="cart-empty-text">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link to="/our-products" className="cart-empty-btn">
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-count-line">
                {cartCount} item{cartCount === 1 ? "" : "s"} in your basket
              </div>

              <div className="cart-table">
                <div className="cart-row cart-row-head">
                  <span className="cart-col-product">Product</span>
                  <span className="cart-col-price">Price</span>
                  <span className="cart-col-qty">Qty</span>
                  <span className="cart-col-total">Total</span>
                  <span className="cart-col-remove"></span>
                </div>

                {cartItems.map((item) => (
                  <div className="cart-row" key={item.slug}>
                    <div className="cart-col-product">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <span className="cart-item-name">{item.name}</span>
                    </div>
                    <div className="cart-col-price">
                      Rs{item.price.toLocaleString()}
                    </div>
                    <div className="cart-col-qty">{item.quantity}</div>
                    <div className="cart-col-total">
                      Rs{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="cart-col-remove">
                      <button
                        className="cart-remove-btn"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeFromBasket(item.slug)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-bottom">
                <div className="cart-summary">
                  <div className="cart-subtotal-row">
                    <span>Subtotal</span>
                    <span>Rs{subtotal.toLocaleString()}</span>
                  </div>
                  <p className="cart-summary-note">
                    Shipping and taxes will be calculated at checkout.
                  </p>
                  <Link to="/checkout" className="cart-checkout-btn">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CartPage;