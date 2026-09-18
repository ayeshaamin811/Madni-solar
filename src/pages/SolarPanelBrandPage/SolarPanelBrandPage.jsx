import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { getSolarPanelBrands, getSolarPanelProducts } from "../../api/solarPanels";
import "./SolarPanelBrandPage.css";

// Default banner — brand ki apni image na ho (ya abhi load ho rahi ho) tou yehi dikhta hai.
import heroBanner from "../../assets/hero-banner.webp";

function SolarPanelBrandPage() {
  // URL se brandSlug nikalo, e.g. /solar-panels/ja-solar -> "ja-solar"
  const { brandSlug } = useParams();

  const [brand, setBrand] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getSolarPanelBrands(), getSolarPanelProducts(brandSlug)])
      .then(([brands, products]) => {
        if (cancelled) return;
        setBrand(brands.find((b) => b.slug === brandSlug) || null);
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

  const bannerImage = brand.image || heroBanner;

  return (
    <div>
      <Navbar />

      <PageBanner
        priceNotice
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
