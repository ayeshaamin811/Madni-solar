import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import { getInverterCategory } from "../../data/inverterCategories";
import inverterProducts from "../../data/inverterProducts";
import "./InverterCategoryPage.css";

/*
  ============================================================================
  INVERTER CATEGORY PAGE  (Ongrid Inverters / Hybrid Inverters)
  ----------------------------------------------------------------------------
  Ek hi component dono category pages ko chalata hai — bilkul waise jaise
  InverterBrandPage saare brands ko chalata hai. Farq sirf `categorySlug` prop
  ka hai, jo App.js mein route ke saath diya jata hai:

    /inverters/ongrid-inverters  -> categorySlug="ongrid-inverters"
    /inverters/hybrid-inverters  -> categorySlug="hybrid-inverters"

  Category ki definition (kaun sa brand kis category mein hai) yahan nahi,
  src/data/inverterCategories.js mein hai. Products wahi purane
  src/data/inverterProducts.js se aate hain, is liye card -> detail page ->
  Add to Basket ka flow pehle jaisa hi chalta rehta hai.
  ============================================================================
*/
function InverterCategoryPage({ categorySlug }) {
  const category = getInverterCategory(categorySlug);

  // Galat/unknown slug — same fallback jaisa InverterBrandPage mein hai.
  if (!category) {
    return (
      <div>
        <Navbar />
        <div className="inverter-category-not-found">
          <p>Category not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Har section ke slugs ko asal product objects mein badlo. Jo slug data mein
  // maujood na ho usay chup-chaap chhod dete hain (filter(Boolean)), taake ek
  // typo se poora page na toote.
  const sections = category.sections.map((section) => ({
    heading: section.heading,
    products: section.productSlugs
      .map((slug) => inverterProducts.find((product) => product.slug === slug))
      .filter(Boolean),
  }));

  // Kitne cards total dikh rahe hain (results text ke liye).
  const totalProducts = sections.reduce(
    (count, section) => count + section.products.length,
    0
  );

  // Heading sirf tab dikhao jab ek se zyada section hon — warna wo banner ke
  // title ko hi repeat karegi.
  const showSectionHeadings = sections.length > 1;

  return (
    <div>
      <Navbar />

      <PageBanner
        image={heroBanner}
        title={category.name}
        parent={{ name: "Inverters", to: "/inverters" }}
        currentPage={category.name}
      />

      <section className="inverter-category-content">
        <div className="container">
          {category.description && (
            <p className="inverter-category-intro">{category.description}</p>
          )}

          {totalProducts > 0 ? (
            <>
              <p className="inverter-category-results-text">
                Showing{" "}
                {totalProducts === 1
                  ? "the single result"
                  : `all ${totalProducts} results`}
              </p>

              {sections.map((section) => (
                <div className="inverter-category-section" key={section.heading}>
                  {showSectionHeadings && (
                    <h2 className="inverter-category-section-title">
                      {section.heading}
                    </h2>
                  )}

                  <div className="inverter-category-product-grid grid">
                    {section.products.map((product) => (
                      <Link
                        key={product.slug}
                        to={`/inverters/${category.slug}/${product.brandSlug}/${product.slug}`}
                        className="inverter-category-product-card"
                      >
                        <img
                          src={product.image || heroBanner}
                          alt={product.name}
                          className="inverter-category-product-card-image"
                        />
                        <h3 className="inverter-category-product-card-title">
                          {product.name}
                        </h3>
                        <p className="inverter-category-product-card-price">
                          Rs{product.price.toLocaleString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="inverter-category-no-products-text">
              No products found for {category.name} yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InverterCategoryPage;
