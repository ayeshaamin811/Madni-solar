import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import inverterBrands from "../../data/inverterBrands";
import inverterProducts from "../../data/inverterProducts";
import { getInverterTrail, findCategoryForSlug } from "../../data/inverterMenu";
import "./InverterBrandPage.css";

// ===== Default banner (used when a brand has no image below) =====
import heroBanner from "../../assets/hero-banner.webp";

// Mirrors SolarPanelBrandPage, driven by the :brandSlug route param and the
// inverter data files.
//
// `categorySlug` route se aata hai (/inverters/ongrid-inverters/canadian). Uski
// wajah se breadcrumb poora banta hai aur product cards bhi category ke andar
// hi rehte hain. Purane flat URL (/inverters/canadian) par categorySlug nahi
// hota — us case mein pehli matching category dhoond lete hain.
function InverterBrandPage({ categorySlug }) {
  // URL se brandSlug nikalo, e.g. /inverters/ongrid-inverters/goodwe -> "goodwe"
  const { brandSlug } = useParams();

  // Data file mein matching brand dhoondo
  const brand = inverterBrands.find((b) => b.slug === brandSlug);

  // Agar brand na mile (galat slug), simple message dikhao
  if (!brand) {
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

  // Sirf isi brand ke products nikalo
  const brandProducts = inverterProducts.filter(
    (product) => product.brandSlug === brand.slug
  );

  // Breadcrumb: Madni Solar / Inverters / <Category> / [<Parent brand> /] <Item>
  const activeCategory = categorySlug || findCategoryForSlug(brand.slug);
  const trail = getInverterTrail(activeCategory, brand.slug);

  const crumbs = [{ name: "Inverters", to: "/inverters" }];
  if (trail) {
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
  }

  // Page ka title/current crumb: sub-variant ka chhota naam ("Single Phase")
  // dikhta hai, poora "Inverex Single Phase" nahi — kyunke parent upar hi hai.
  const currentName = trail ? trail.item.name : brand.name;
  const basePath = trail ? `/inverters/${trail.category.slug}` : "/inverters";

  return (
    <div>
      <Navbar />

      <PageBanner
        image={heroBanner}
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
                    to={`${basePath}/${brand.slug}/${product.slug}`}
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
              No products found for {brand.name} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InverterBrandPage;