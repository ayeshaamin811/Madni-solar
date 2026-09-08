import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import solarPanelBrands from "../../data/solarPanelBrands";
import solarPanelProducts from "../../data/solarProducts";
import "./SolarPanelBrandPage.css";

// ===== Default banner (used when a brand has no image below) =====
import heroBanner from "../../assets/hero-banner.webp";

// ===== Per-brand banner images =====
// Jab kisi brand ki image mil jaye, bas 2 kaam karo:
// 1. Yahan ek naya import add karo
// 2. Neeche brandImageMap mein us brand ka slug: importedImage add karo
// import jaSolarImg from "../../assets/brands/ja-solar.webp";

const brandImageMap = {
  // "ja-solar": jaSolarImg,
};

// Product ki apni image na ho tou (product.image khaali ho) heroBanner fallback use hoga.

function SolarPanelBrandPage() {
  // URL se brandSlug nikalo, e.g. /solar-panels/ja-solar -> "ja-solar"
  const { brandSlug } = useParams();

  // Data file mein matching brand dhoondo
  const brand = solarPanelBrands.find((b) => b.slug === brandSlug);

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

  // Is brand ki image map mein mile tou wahi use karo, warna default heroBanner
  const bannerImage = brandImageMap[brand.slug] || heroBanner;

  // Sirf isi brand ke products nikalo
  const brandProducts = solarPanelProducts.filter(
    (product) => product.brandSlug === brand.slug
  );

  return (
    <div>
      <Navbar />

      <PageBanner
        image={bannerImage}
        title={brand.name}
        parent={{ name: "Solar Panels", to: "/solar-panels" }}
        currentPage={brand.name}
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
                    to={`/solar-panels/${brand.slug}/${product.slug}`}
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

export default SolarPanelBrandPage;