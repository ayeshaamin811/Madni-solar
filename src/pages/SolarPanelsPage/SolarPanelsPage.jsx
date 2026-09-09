import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import solarPanelProducts from "../../data/solarProducts";
import "./SolarPanelsPage.css";

// Inverters page ka exact same pattern — Navbar + PageBanner + product cards ka
// grid + Footer. Sirf data source (solarProducts) aur route prefix
// (/solar-panels/<brandSlug>/<productSlug>) mukhtalif hain.
function SolarPanelsPage() {
  return (
    <div>
      <Navbar />

      <PageBanner
        image={heroBanner}
        title="Solar Panels"
        currentPage="Solar Panels"
      />

      <section className="solar-panels-content">
        <div className="container">
          {solarPanelProducts.length > 0 ? (
            <>
              <p className="solar-panels-results-text">
                Showing{" "}
                {solarPanelProducts.length === 1
                  ? "the single result"
                  : `all ${solarPanelProducts.length} results`}
              </p>

              <div className="solar-panels-product-grid grid">
                {solarPanelProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/solar-panels/${product.brandSlug}/${product.slug}`}
                    className="solar-panels-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="solar-panels-product-card-image"
                    />
                    <h3 className="solar-panels-product-card-title">
                      {product.name}
                    </h3>
                    <p className="solar-panels-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="solar-panels-no-products-text">
              No products found yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default SolarPanelsPage;
