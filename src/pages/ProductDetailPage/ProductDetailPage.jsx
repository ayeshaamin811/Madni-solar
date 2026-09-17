import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { useCart } from "../../context/CartContext";
import { getSolarPanelProduct } from "../../api/solarPanels";
import { buildQuoteLink } from "../../data/findProduct";
import "./ProductDetailPage.css";

// Default fallback image used when a product has no image of its own.
import heroBanner from "../../assets/hero-banner.webp";

// Har product detail page ka banner ek hi rehta hai.
import productsBanner from "../../assets/products-banner.webp";

// WhatsApp contact number used for the enquiry button.
const WHATSAPP_NUMBER = "923111666677";

function ProductDetailPage() {
  // URL se brandSlug + productSlug nikalo,
  // e.g. /solar-panels/ja-solar/ja-solar-585w-mono-panel
  const { brandSlug, productSlug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product quantity (default 1)
  const [quantity, setQuantity] = useState(1);

  // Global cart helper for adding the current product to the basket
  const { addToBasket } = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getSolarPanelProduct(productSlug)
      .then((data) => {
        if (cancelled) return;
        // Brand bhi match honi chahiye — warna galat brand ke saath sahi
        // productSlug hit karne par mismatched product dikh jayega.
        setProduct(data && data.brandSlug === brandSlug ? data : null);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [brandSlug, productSlug]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="product-not-found">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Agar product na mile (galat slug), simple message dikhao
  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="product-not-found">
          <p>Product not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Description ek hi block hai — bullets ki jagah paragraph(s) mein dikhti hai.
  // Backend se aage ek single string aayegi, is liye string aur paragraphs ki
  // array — dono chal jati hain.
  const descriptionParagraphs = Array.isArray(product.description)
    ? product.description
    : product.description
    ? [product.description]
    : [];

  return (
    <div>
      <Navbar />

      <PageBanner
        image={productsBanner}
        title={product.name}
        currentPage={product.name}
      />

      <section className="product-detail-content">
        <div className="container">
          {/* ===== Product info: image left, details right ===== */}
          <div className="product-info grid md:grid-cols-2">
            <div className="product-image-wrap">
              <img
                src={product.image || heroBanner}
                alt={product.name}
                className="product-image"
              />
            </div>

            <div className="product-details">
              <h1 className="product-name">{product.name}</h1>

              <p className="product-price">
                Rs{product.price.toLocaleString()}
              </p>

              <p className="product-short-description">
                {product.shortDescription}
              </p>

              <div className="product-quantity-row">
                <label htmlFor="product-quantity" className="product-quantity-label">
                  Quantity
                </label>
                <input
                  id="product-quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="product-quantity-input"
                />
              </div>

              <div className="product-actions">
                <button
                  type="button"
                  className="product-btn btn-basket"
                  onClick={() => addToBasket(product, quantity)}
                >
                  Add to Basket
                </button>
                <Link
                  to={buildQuoteLink(product, quantity)}
                  className="product-btn btn-quote"
                >
                  Add to Quote
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Madni Solar, I'd like to enquire about the ${product.name}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-btn btn-whatsapp"
                >
                  <FaWhatsapp className="btn-whatsapp-icon" /> WhatsApp
                </a>
              </div>

              {product.categories && product.categories.length > 0 && (
                <div className="product-categories">
                  <span className="product-categories-label">Categories:</span>
                  {product.categories.map((category) => (
                    <span key={category} className="product-badge">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ===== Description section ===== */}
          {descriptionParagraphs.length > 0 && (
            <section className="description-section">
              <hr className="section-divider" />
              <h2 className="description-title">Description</h2>
              <div className="description-text">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index} className="description-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductDetailPage;