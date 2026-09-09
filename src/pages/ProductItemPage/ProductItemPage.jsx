import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { getItemProducts } from "../../data/productItems";
import { getProductTrail, findProductCategoryForSlug } from "../../data/productsMenu";
import "./ProductItemPage.css";

// ===== Default banner =====
import heroBanner from "../../assets/hero-banner.webp";

/*
  InverterBrandPage ka equivalent — :itemSlug route param par chalta hai.

  `categorySlug` route se aata hai (/products/installation-accessories/cables).
  Uski wajah se breadcrumb poora banta hai. Flat URL (/products/cables) par
  categorySlug nahi hota — us case mein pehli matching category dhoond lete hain.

  Jis item ke neeche sub-items hon (Cables -> Nafees Cables -> DC/AC Cables) un
  ke chips upar dikha dete hain, taake user menu kholne ke baghair andar ja sake.
*/
function ProductItemPage({ categorySlug }) {
  // URL se itemSlug nikalo, e.g. /products/packages/huawei -> "huawei"
  const { itemSlug } = useParams();

  // Breadcrumb + item ka data ek hi trail se aata hai. Route ki category mein
  // item na mile (galat URL) tou jahan bhi mile, wahan se utha lete hain.
  const activeCategory =
    categorySlug && getProductTrail(categorySlug, itemSlug)
      ? categorySlug
      : findProductCategoryForSlug(itemSlug);

  const trail = activeCategory ? getProductTrail(activeCategory, itemSlug) : null;

  // Agar item na mile (galat slug), simple message dikhao
  if (!trail) {
    return (
      <div>
        <Navbar />
        <div className="product-item-not-found">
          <p>Product not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryPath = `/products/${trail.category.slug}`;
  const currentName = trail.item.name;

  // Sirf isi item ke (aur isi category ke) products
  const itemProducts = getItemProducts(trail.category.slug, trail.item.slug);

  // Breadcrumb: Madni Solar / Products / <Category> / [<Parents> /] <Item>
  const crumbs = [
    { name: "Products", to: "/products" },
    { name: trail.category.name, to: categoryPath },
    // Item ke upar ke saare parents (Cables / Nafees Cables ...)
    ...trail.ancestors.map((ancestor) => ({
      name: ancestor.name,
      to: `${categoryPath}/${ancestor.slug}`,
    })),
  ];

  return (
    <div>
      <Navbar />

      <PageBanner
        image={heroBanner}
        title={currentName}
        trail={crumbs}
        currentPage={currentName}
      />

      <section className="product-item-content">
        <div className="container">
          {/* Is item ke andar ke sub-items (agar hon) */}
          {trail.item.children.length > 0 && (
            <div className="product-item-subs">
              <h2 className="product-item-subs-title">In {currentName}</h2>
              <div className="product-item-subs-list">
                {trail.item.children.map((child) => (
                  <Link
                    key={child.slug}
                    to={`${categoryPath}/${child.slug}`}
                    className="product-item-sub-chip"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {itemProducts.length > 0 ? (
            <>
              <p className="product-item-results-text">
                Showing{" "}
                {itemProducts.length === 1
                  ? "the single result"
                  : `all ${itemProducts.length} results`}
              </p>

              <div className="product-item-product-grid grid">
                {itemProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`${categoryPath}/${product.brandSlug}/${product.slug}`}
                    className="product-item-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="product-item-product-card-image"
                    />
                    <h3 className="product-item-product-card-title">
                      {product.name}
                    </h3>
                    <p className="product-item-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="product-item-no-products-text">
              No products found for {currentName} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductItemPage;
