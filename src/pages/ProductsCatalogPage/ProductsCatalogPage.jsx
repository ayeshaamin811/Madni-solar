import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import { getProductCategories, getProducts } from "../../api/products";
import "./ProductsCatalogPage.css";

// InvertersPage ka bilkul same pattern — Navbar + PageBanner + cards ka grid +
// Footer. Data (categories + products) ab backend se aata hai
// (src/api/products.js). Upar categories ke chips bhi hain, taake user
// seedha /products/<category> par ja sake.
function ProductsCatalogPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getProductCategories(), getProducts()])
      .then(([categoriesData, productsData]) => {
        if (cancelled) return;
        setCategories(categoriesData);
        setProducts(productsData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // categorySlug -> category name, taake har card apni category bhi dikha
  // sake (Huawei jaisa naam ek se zyada category mein aata hai).
  const categoryNameBySlug = Object.fromEntries(
    categories.map((category) => [category.slug, category.name])
  );

  return (
    <div>
      <Navbar />

      <PageBanner image={heroBanner} title="Products" currentPage="Products" />

      <section className="products-catalog-content">
        <div className="container">
          {/* Category shortcuts — mega menu ke headings ki tarah */}
          <div className="products-catalog-categories">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products/${category.slug}`}
                className="products-catalog-category-chip"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {loading ? (
            <p className="products-catalog-no-products-text">Loading products...</p>
          ) : products.length > 0 ? (
            <>
              <p className="products-catalog-results-text">
                Showing{" "}
                {products.length === 1
                  ? "the single result"
                  : `all ${products.length} results`}
              </p>

              <div className="products-catalog-product-grid grid">
                {products.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/products/${product.categorySlug}/${product.brandSlug}/${product.slug}`}
                    className="products-catalog-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="products-catalog-product-card-image"
                    />
                    <h3 className="products-catalog-product-card-title">
                      {product.name}
                    </h3>
                    {/* Ek hi naam do category mein aata hai (Huawei = Packages
                        + Product Accessories), is liye category bhi likhte hain. */}
                    <p className="products-catalog-product-card-category">
                      {categoryNameBySlug[product.categorySlug]}
                    </p>
                    <p className="products-catalog-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="products-catalog-no-products-text">
              No products found yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductsCatalogPage;
