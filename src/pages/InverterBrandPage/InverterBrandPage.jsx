import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { getInverterCategories, getInverterProducts } from "../../api/inverters";
import { getInverterTrail, findCategoryForSlug } from "../../data/inverterMenu";
import "./InverterBrandPage.css";

// ===== Default banner (used when a brand has no image below) =====
import heroBanner from "../../assets/hero-banner.webp";

// Mirrors SolarPanelBrandPage, driven by the :brandSlug route param and the
// inverters API (categories tree for the breadcrumb/name, products filtered
// by brand).
//
// `categorySlug` route se aata hai (/inverters/ongrid-inverters/canadian). Uski
// wajah se breadcrumb poora banta hai aur product cards bhi category ke andar
// hi rehte hain. Purane flat URL (/inverters/canadian) par categorySlug nahi
// hota — us case mein fetched categories mein pehli matching category dhoond
// lete hain.
function InverterBrandPage({ categorySlug }) {
  // URL se brandSlug nikalo, e.g. /inverters/ongrid-inverters/goodwe -> "goodwe"
  const { brandSlug } = useParams();

  const [categories, setCategories] = useState([]);
  const [brandProducts, setBrandProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getInverterCategories(), getInverterProducts({ brand: brandSlug })])
      .then(([categoriesData, products]) => {
        if (cancelled) return;
        setCategories(categoriesData);
        setBrandProducts(products);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [brandSlug]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="brand-not-found">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Breadcrumb: Madni Solar / Inverters / <Category> / [<Parent brand> /] <Item>
  const activeCategory = categorySlug || findCategoryForSlug(categories, brandSlug);
  const trail = activeCategory ? getInverterTrail(categories, activeCategory, brandSlug) : null;

  // Agar brand na mile (galat slug), simple message dikhao
  if (!trail) {
    return (
      <div>
        <Navbar />
        <div className="brand-not-found">
          <p>Brand not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const crumbs = [{ name: "Inverters", to: "/inverters" }];
  crumbs.push({
    name: trail.category.name,
    to: `/inverters/${trail.category.slug}`,
  });
  // Sub-variant (Single Phase, Krypton...) ho tou uska parent brand bhi dikhao
  if (trail.parent) {
    crumbs.push({
      name: trail.parent.name,
      to: `/inverters/${trail.category.slug}/${trail.parent.slug}`,
    });
  }

  // Page ka title/current crumb: sub-variant ka chhota naam ("Single Phase")
  // dikhta hai, poora "Inverex Single Phase" nahi — kyunke parent upar hi hai.
  const currentName = trail.item.name;
  const basePath = `/inverters/${trail.category.slug}`;

  return (
    <div>
      <Navbar />

      <PageBanner
        image={trail.item.image || heroBanner}
        title={currentName}
        trail={crumbs}
        currentPage={currentName}
      />

      <section className="brand-content">
        <div className="container">
          {brandProducts.length > 0 ? (
            <>
              <p className="results-text">
                Showing {brandProducts.length === 1 ? "the single result" : `all ${brandProducts.length} results`}
              </p>

              <div className="product-grid grid">
                {brandProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`${basePath}/${trail.item.slug}/${product.slug}`}
                    className="product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="product-card-image"
                    />
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="no-products-text">
              No products found for {currentName} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InverterBrandPage;
