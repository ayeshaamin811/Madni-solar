import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import inverterBrands from "../../data/inverterBrands";
import inverterProducts from "../../data/inverterProducts";
import "./InverterBrandPage.css";

// ===== Default banner (used when a brand has no image below) =====
import heroBanner from "../../assets/hero-banner.webp";

// Mirrors SolarPanelBrandPage exactly, driven by the :brandSlug route param and
// the inverter data files. Product cards link to /inverters/:brandSlug/:slug.
function InverterBrandPage() {
  // URL se brandSlug nikalo, e.g. /inverters/goodwe -> "goodwe"
  const { brandSlug } = useParams();

  // Data file mein matching brand dhoondo
  const brand = inverterBrands.find((b) => b.slug === brandSlug);

  // Agar brand na mile (galat slug), simple message dikhao
  if (!brand) {
    return (
      <div>
        <Navbar />
        <div className="brand-not-found">
          <p>Brand not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Sirf isi brand ke products nikalo
  const brandProducts = inverterProducts.filter(
    (product) => product.brandSlug === brand.slug
  );

  return (
    <div>
      <Navbar />

      <PageBanner image={heroBanner} title={brand.name} currentPage={brand.name} />

      <section className="brand-content">
        <div className="container">
          {brandProducts.length > 0 ? (
            <>
              <p className="results-text">
                Showing {brandProducts.length === 1 ? "the single result" : `all ${brandProducts.length} results`}
              </p>

              <div className="product-grid grid">
                {brandProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/inverters/${brand.slug}/${product.slug}`}
                    className="product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="product-card-image"
                    />
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="no-products-text">
              No products found for {brand.name} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InverterBrandPage;