import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import { getInverterCategories, getInverterProducts } from "../../api/inverters";
import "./InverterCategoryPage.css";

/*
  ============================================================================
  INVERTER CATEGORY PAGE  (Ongrid Inverters / Hybrid Inverters)
  ----------------------------------------------------------------------------
  Ek hi component dono/teenon category pages ko chalata hai — bilkul waise
  jaise InverterBrandPage saare brands ko chalata hai. Farq sirf `categorySlug`
  prop ka hai, jo App.js mein route ke saath diya jata hai:

    /inverters/ongrid-inverters  -> categorySlug="ongrid-inverters"
    /inverters/hybrid-inverters  -> categorySlug="hybrid-inverters"

  Category (name/description) aur products dono ab backend se aate hain
  (src/api/inverters.js) — is liye Django admin mein naya product add karte hi
  ye page bhi turant update ho jata hai, koi frontend deploy ki zaroorat nahi.
  ============================================================================
*/
function InverterCategoryPage({ categorySlug }) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      getInverterCategories(),
      getInverterProducts({ category: categorySlug }),
    ])
      .then(([categories, categoryProducts]) => {
        if (cancelled) return;
        setCategory(categories.find((c) => c.slug === categorySlug) || null);
        setProducts(categoryProducts);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="inverter-category-not-found">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Galat/unknown slug — same fallback jaisa InverterBrandPage mein hai.
  if (!category) {
    return (
      <div>
        <Navbar />
        <div className="inverter-category-not-found">
          <p>Category not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <PageBanner
        priceNotice
        image={heroBanner}
        title={category.name}
        parent={{ name: "Inverters", to: "/inverters" }}
        currentPage={category.name}
      />

      <section className="inverter-category-content">
        <div className="container">
          {category.description && (
            <p className="inverter-category-intro">{category.description}</p>
          )}

          {products.length > 0 ? (
            <>
              <p className="inverter-category-results-text">
                Showing{" "}
                {products.length === 1
                  ? "the single result"
                  : `all ${products.length} results`}
              </p>

              <div className="inverter-category-product-grid grid">
                {products.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/inverters/${category.slug}/${product.brandSlug}/${product.slug}`}
                    className="inverter-category-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="inverter-category-product-card-image"
                    />
                    <h3 className="inverter-category-product-card-title">
                      {product.name}
                    </h3>
                    <p className="inverter-category-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="inverter-category-no-products-text">
              No products found for {category.name} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InverterCategoryPage;
