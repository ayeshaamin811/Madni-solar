import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import batteryProducts from "../../data/batteryProducts";
import "./BatteriesPage.css";

/*
  ============================================================================
  BATTERIES PAGE  (/batteries)
  ----------------------------------------------------------------------------
  InvertersPage jaisa hi — Navbar + PageBanner + saare products ka grid +
  Footer. Farq sirf data source (batteryProducts) aur route prefix
  (/batteries) ka hai.

  Batteries mein sirf ek category hai, is liye ye page do kaam karta hai:
  poori listing bhi aur "Batteries" category page bhi (Navbar ka heading isi
  par aata hai). Product data src/data/batteryMenu.js ki tree se derive hota
  hai, hath se nahi likha jata.
  ============================================================================
*/
function BatteriesPage() {
  return (
    <div>
      <Navbar />

      <PageBanner image={heroBanner} title="Batteries" currentPage="Batteries" />

      <section className="batteries-content">
        <div className="container">
          {batteryProducts.length > 0 ? (
            <>
              <p className="batteries-results-text">
                Showing{" "}
                {batteryProducts.length === 1
                  ? "the single result"
                  : `all ${batteryProducts.length} results`}
              </p>

              <div className="batteries-product-grid grid">
                {batteryProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/batteries/${product.brandSlug}/${product.slug}`}
                    className="batteries-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="batteries-product-card-image"
                    />
                    <h3 className="batteries-product-card-title">{product.name}</h3>
                    <p className="batteries-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="batteries-no-products-text">No products found yet.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BatteriesPage;
