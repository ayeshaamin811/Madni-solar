import React, { useEffect, useState } from "react";
import PriceDisplay from "../../components/PriceDisplay/PriceDisplay";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import {
  getBatteryTrail,
  getBatteryBranchSlugs,
  getBatteryBrandRoot,
  BATTERY_CATEGORY,
} from "../../data/batteryMenu";
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
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Saare battery products fetch karke client-side filter karte hain —
    // kyunke backend sirf exact brandSlug match karta hai, aur brand page par
    // uske sub-variants (HV/LV) ke products bhi ek saath dikhane hain.
    Promise.all([getBatteryBrands(), getBatteryProducts()])
      .then(([brandsData, products]) => {
        if (cancelled) return;
        setBrands(brandsData);
        setAllProducts(products);
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

  // Is item (aur uske andar ke saare sub-nodes) ke products. Brand par woo khud
  // hi hai, is liye brand ke saare sub-variants (HV + LV) combine ho jaate hain;
  // sub-variant par sirf us ke apne products rehte hain.
  const branchSlugs = getBatteryBranchSlugs(trail.item);
  const brandProducts = allProducts.filter((product) =>
    branchSlugs.includes(product.brandSlug)
  );

  // Top-level brand node jiske andar ye item hai — iske sub-variant chips (HV/
  // LV) page par dikhate hain, chahe hum brand par hon ya uski kisi sub-variant
  // par. "All" chip brand par wapas le jata hai (saare products).
  const brandRoot = getBatteryBrandRoot(brands, brandSlug);
  const hasSubs = (brandRoot?.sub || []).length > 0;
  const isAllState = trail.item.slug === brandRoot?.slug;

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
          {/* Brand ke sub-variants (HV/LV) — brand page par bhi, sub-variant
            par bhi dikhte hain; active waala highlight hota hai aur "All"
            brand ke saare products par le jata hai. */}
          {hasSubs && (
            <div className="battery-brand-subs">
              <h2 className="battery-brand-subs-title">In {brandRoot.name}</h2>
              <div className="battery-brand-subs-list">
                <Link
                  to={`/batteries/${brandRoot.slug}`}
                  className={`battery-brand-sub-chip${
                    isAllState ? " battery-brand-sub-chip-active" : ""
                  }`}
                >
                  All
                </Link>
                {brandRoot.sub.map((child) => {
                  const isActive = getBatteryBranchSlugs(child).includes(
                    trail.item.slug
                  );
                  return (
                    <Link
                      key={child.slug}
                      to={`/batteries/${child.slug}`}
                      className={`battery-brand-sub-chip${
                        isActive ? " battery-brand-sub-chip-active" : ""
                      }`}
                    >
                      {child.name}
                    </Link>
                  );
                })}
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
                      <PriceDisplay price={product.price} inCard />
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
