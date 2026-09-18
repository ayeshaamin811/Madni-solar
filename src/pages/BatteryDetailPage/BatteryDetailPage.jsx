import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { useCart } from "../../context/CartContext";
import { getBatteryTrail, BATTERY_CATEGORY } from "../../data/batteryMenu";
import { getBatteryBrands, getBatteryProduct } from "../../api/batteries";
import { buildQuoteLink } from "../../data/findProduct";
import "./BatteryDetailPage.css";

// Default fallback image used when a product has no image of its own.
import heroBanner from "../../assets/hero-banner.webp";

// Har product detail page ka banner ek hi rehta hai.
import productsBanner from "../../assets/products-banner.webp";

// WhatsApp contact number used for the enquiry button.
const WHATSAPP_NUMBER = "923111666677";

// InverterDetailPage ka hu-ba-hu equivalent, sirf data (backend, src/api/batteries.js)
// aur route prefix (/batteries) ka farq hai, e.g.
// /batteries/huawei-hv/battery-huawei-hv
function BatteryDetailPage() {
  // URL se brandSlug + productSlug nikalo
  const { brandSlug, productSlug } = useParams();

  const [brands, setBrands] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product quantity (default 1)
  const [quantity, setQuantity] = useState(1);

  // Global cart helper for adding the current product to the basket
  const { addToBasket } = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getBatteryBrands(), getBatteryProduct(productSlug)])
      .then(([brandsData, data]) => {
        if (cancelled) return;
        setBrands(brandsData);
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

  // Breadcrumb: Madni Solar / Batteries / [<Parents> /] <Item> / <Product>
  // Batteries ki ek hi category hai aur uski page /batteries hi hai, is liye
  // Inverters waala alag category crumb yahan nahi aata.
  const trail = getBatteryTrail(brands, brandSlug);

  const crumbs = [{ name: BATTERY_CATEGORY.name, to: "/batteries" }];
  if (trail) {
    trail.ancestors.forEach((ancestor) => {
      crumbs.push({ name: ancestor.name, to: `/batteries/${ancestor.slug}` });
    });
    crumbs.push({ name: trail.item.name, to: `/batteries/${trail.item.slug}` });
  }

  // Description ek hi block hai — bullets ki jagah paragraph(s) mein dikhti hai.
  const descriptionParagraphs = Array.isArray(product.description)
    ? product.description
    : product.description
    ? [product.description]
    : [];

  return (
    <div>
      <Navbar />

      <PageBanner
        priceNotice
        image={productsBanner}
        title={product.name}
        trail={crumbs}
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

          {/* ===== Why Choose checklist ===== */}
          {product.whyChoose && product.whyChoose.length > 0 && (
            <section className="why-choose-section">
              <>
                <hr className="section-divider" />
                <h2 className="why-choose-title">Why Choose This Product?</h2>
                <ul className="why-choose-list">
                  {product.whyChoose.map((reason, index) => (
                    <li key={index} className="why-choose-item">
                      {reason}
                    </li>
                  ))}
                </ul>
              </>
            </section>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BatteryDetailPage;
