import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./RequestQuote.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import QuoteBanner from "../../assets/hero-banner.webp";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { parseQuoteItems } from "../../data/findProduct";


// Simple "Send the request" quote form component
function SendRequest() {
  // Quote ke items URL query se aate hain — ya to product detail page ka
  // single product (?product=&brand=&qty=), ya checkout ka poora basket
  // (?items=<slug>:<qty>,...).
  const [searchParams] = useSearchParams();
  const quoteItems = parseQuoteItems(searchParams);
  const quoteTotal = quoteItems.reduce((sum, item) => sum + item.lineTotal, 0);

  // State for each form field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [createAccount, setCreateAccount] = useState(false);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Request submitted:", {
      firstName,
      lastName,
      phone,
      email,
      message,
      createAccount,
      // Jo product(s) quote ke liye chune gaye
      items: quoteItems.map(({ product, quantity, lineTotal }) => ({
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity,
        lineTotal,
      })),
      quoteTotal,
    });
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

        <form className="request-form" onSubmit={handleSubmit}>
          {/* First Name field */}
          <div className="form-group">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name field */}
          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Phone field */}
          <div className="form-group">
            <label htmlFor="phone">
              Phone <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Email field (optional) */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Message field (optional) */}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

    

          {/* Submit button */}
          <button type="submit" className="btn-primary">
            SEND YOUR REQUEST
          </button>
        </form>
      </div>
    </div>

    <Footer/>
    </div>
  );
}

export default SendRequest;