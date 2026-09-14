import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import { getInverterProducts } from "../../api/inverters";
import "./InvertersPage.css";

// Same pattern as the Solar Panels page — Navbar + PageBanner + a grid of
// clickable product cards + Footer. Products ab backend se aate hain
// (src/api/inverters.js).
function InvertersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getInverterProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Navbar />

      <PageBanner image={heroBanner} title="Inverters" currentPage="Inverters" />

      <section className="inverters-content">
        <div className="container">
          {loading ? (
            <p className="inverters-no-products-text">Loading inverters...</p>
          ) : products.length > 0 ? (
            <>
              <p className="inverters-results-text">
                Showing{" "}
                {products.length === 1
                  ? "the single result"
                  : `all ${products.length} results`}
              </p>

              <div className="inverters-product-grid grid">
                {products.map((product) => (
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
