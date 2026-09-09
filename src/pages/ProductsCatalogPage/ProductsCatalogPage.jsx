import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import productCategories from "../../data/productCategories";
import productItems from "../../data/productItems";
import "./ProductsCatalogPage.css";

// InvertersPage ka bilkul same pattern — Navbar + PageBanner + cards ka grid +
// Footer. Farq sirf data source (productItems) aur route prefix (/products) ka
// hai. Upar categories ke chips bhi hain, taake user seedha
// /products/<category> par ja sake.
function ProductsCatalogPage() {
  return (
    <div>
      <Navbar />

      <PageBanner image={heroBanner} title="Products" currentPage="Products" />

      <section className="products-catalog-content">
        <div className="container">
          {/* Category shortcuts — mega menu ke headings ki tarah */}
          <div className="products-catalog-categories">
            {productCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/products/${category.slug}`}
                className="products-catalog-category-chip"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {productItems.length > 0 ? (
            <>
              <p className="products-catalog-results-text">
                Showing{" "}
                {productItems.length === 1
                  ? "the single result"
                  : `all ${productItems.length} results`}
              </p>

              <div className="products-catalog-product-grid grid">
                {productItems.map((product) => (
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
                      {product.categoryName}
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
