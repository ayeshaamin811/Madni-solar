import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import { getBatteryProducts } from "../../api/batteries";
import "./BatteriesPage.css";

/*
  ============================================================================
  BATTERIES PAGE  (/batteries)
  ----------------------------------------------------------------------------
  InvertersPage jaisa hi — Navbar + PageBanner + saare products ka grid +
  Footer. Batteries mein sirf ek category hai, is liye ye page do kaam karta
  hai: poori listing bhi aur "Batteries" category page bhi (Navbar ka heading
  isi par aata hai). Products ab backend se aate hain (src/api/batteries.js).
  ============================================================================
*/
function BatteriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getBatteryProducts()
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

      <PageBanner image={heroBanner} title="Batteries" currentPage="Batteries" />

      <section className="batteries-content">
        <div className="container">
          {loading ? (
            <p className="batteries-no-products-text">Loading batteries...</p>
          ) : products.length > 0 ? (
            <>
              <p className="batteries-results-text">
                Showing{" "}
                {products.length === 1
                  ? "the single result"
                  : `all ${products.length} results`}
              </p>

              <div className="batteries-product-grid grid">
                {products.map((product) => (
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
