import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import { getProductCategories, getProducts } from "../../api/products";
import "./ProductCategoryPage.css";

/*
  ============================================================================
  PRODUCT CATEGORY PAGE
  (Installation Accessories / Packages / Product Accessories / VFDs)
  ----------------------------------------------------------------------------
  InverterCategoryPage ka hu-ba-hu equivalent — ek hi component saari category
  pages chalata hai, `categorySlug` prop App.js mein route ke saath diya jata
  hai:

    /products/installation-accessories -> categorySlug="installation-accessories"
    /products/vfds                     -> categorySlug="vfds"

  Category (name/description) aur products dono ab backend se aate hain
  (src/api/products.js).
  ============================================================================
*/
function ProductCategoryPage({ categorySlug }) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getProductCategories(), getProducts({ category: categorySlug })])
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
        <div className="product-category-not-found">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Galat/unknown slug — same fallback jaisa InverterCategoryPage mein hai.
  if (!category) {
    return (
      <div>
        <Navbar />
        <div className="product-category-not-found">
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
        parent={{ name: "Products", to: "/products" }}
        currentPage={category.name}
      />

      <section className="product-category-content">
        <div className="container">
          {category.description && (
            <p className="product-category-intro">{category.description}</p>
          )}

          {products.length > 0 ? (
            <>
              <p className="product-category-results-text">
                Showing{" "}
                {products.length === 1
                  ? "the single result"
                  : `all ${products.length} results`}
              </p>

              <div className="product-category-product-grid grid">
                {products.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/products/${category.slug}/${product.brandSlug}/${product.slug}`}
                    className="product-category-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="product-category-product-card-image"
                    />
                    <h3 className="product-category-product-card-title">
                      {product.name}
                    </h3>
                    <p className="product-category-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="product-category-no-products-text">
              No products found for {category.name} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductCategoryPage;
