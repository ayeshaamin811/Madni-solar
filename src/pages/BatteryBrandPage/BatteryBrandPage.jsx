import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import { getBatteryTrail, BATTERY_CATEGORY } from "../../data/batteryMenu";
import { getBatteryBrands, getBatteryProducts } from "../../api/batteries";
import "./BatteryBrandPage.css";

// ===== Default banner =====
import heroBanner from "../../assets/hero-banner.webp";

/*
  InverterBrandPage ka equivalent — :brandSlug route param par chalta hai:

    /batteries/huawei      -> brand page
    /batteries/huawei-hv   -> uske andar ka sub-variant (HV)

  Brand ka naam, uske parents aur uske sub-items sab backend ki tree se aate
  hain (src/api/batteries.js -> getBatteryBrands()), is liye menu aur page
  kabhi alag nahi ho sakte.

  Jis item ke neeche sub-items hon (Huawei -> HV, BYD -> HV/LV) un ke chips
  upar dikha dete hain, taake user menu kholne ke baghair andar ja sake.
*/
function BatteryBrandPage() {
  // URL se brandSlug nikalo, e.g. /batteries/byd-lv -> "byd-lv"
  const { brandSlug } = useParams();

  const [brands, setBrands] = useState([]);
  const [brandProducts, setBrandProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([getBatteryBrands(), getBatteryProducts({ brand: brandSlug })])
      .then(([brandsData, products]) => {
        if (cancelled) return;
        setBrands(brandsData);
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
        <div className="battery-brand-not-found">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Breadcrumb + item ka data ek hi trail se aata hai.
  const trail = getBatteryTrail(brands, brandSlug);

  // Agar item na mile (galat slug), simple message dikhao
  if (!trail) {
    return (
      <div>
        <Navbar />
        <div className="battery-brand-not-found">
          <p>Battery not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Page ka title/current crumb: sub-variant ka chhota naam ("HV") dikhta hai,
  // poora "Huawei HV" nahi — kyunke parent breadcrumb mein upar hi hai.
  const currentName = trail.item.name;

  // Breadcrumb: Madni Solar / Batteries / [<Parents> /] <Item>
  // Batteries ki ek hi category hai aur uski page /batteries hi hai, is liye
  // Inverters waala alag category crumb yahan nahi aata.
  const crumbs = [
    { name: BATTERY_CATEGORY.name, to: "/batteries" },
    ...trail.ancestors.map((ancestor) => ({
      name: ancestor.name,
      to: `/batteries/${ancestor.slug}`,
    })),
  ];

  return (
    <div>
      <Navbar />

      <PageBanner
        priceNotice
        image={trail.item.image || heroBanner}
        title={currentName}
        trail={crumbs}
        currentPage={currentName}
      />

      <section className="battery-brand-content">
        <div className="container">
          {/* Is item ke andar ke sub-items (agar hon) */}
          {trail.item.sub && trail.item.sub.length > 0 && (
            <div className="battery-brand-subs">
              <h2 className="battery-brand-subs-title">In {currentName}</h2>
              <div className="battery-brand-subs-list">
                {trail.item.sub.map((child) => (
                  <Link
                    key={child.slug}
                    to={`/batteries/${child.slug}`}
                    className="battery-brand-sub-chip"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {brandProducts.length > 0 ? (
            <>
              <p className="battery-brand-results-text">
                Showing{" "}
                {brandProducts.length === 1
                  ? "the single result"
                  : `all ${brandProducts.length} results`}
              </p>

              <div className="battery-brand-product-grid grid">
                {brandProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/batteries/${product.brandSlug}/${product.slug}`}
                    className="battery-brand-product-card"
                  >
                    <img
                      src={product.image || heroBanner}
                      alt={product.name}
                      className="battery-brand-product-card-image"
                    />
                    <h3 className="battery-brand-product-card-title">
                      {product.name}
                    </h3>
                    <p className="battery-brand-product-card-price">
                      Rs{product.price.toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="battery-brand-no-products-text">
              No products found for {currentName} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BatteryBrandPage;
