import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import inverterProducts from "../../data/inverterProducts";
import "./InvertersPage.css";

// Same pattern as the Solar Panels brand page — Navbar + PageBanner + a grid of
// clickable product cards + Footer. Only the data source (inverterProducts) and
// route prefix (/inverters) differ.
function InvertersPage() {
  return (
    <div>
      <Navbar />

      <PageBanner image={heroBanner} title="Inverters" currentPage="Inverters" />

      <section className="inverters-content">
        <div className="container">
          {inverterProducts.length > 0 ? (
            <>
              <p className="inverters-results-text">
                Showing{" "}
                {inverterProducts.length === 1
                  ? "the single result"
                  : `all ${inverterProducts.length} results`}
              </p>

              <div className="inverters-product-grid grid">
                {inverterProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/inverters/${product.brandSlug}/${product.slug}`}
                    className="inverters-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="inverters-product-card-image"
                    />
                    <h3 className="inverters-product-card-title">{product.name}</h3>
                    <p className="inverters-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="inverters-no-products-text">No products found yet.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InvertersPage;
