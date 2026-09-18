import React from "react";
import { Link } from "react-router-dom";
import "./Pagebanner.css";

/*
  Price disclaimer - sirf ek jagah likha hai taake har product banner par
  bilkul same text jaye. Kabhi wording badle tou yahin badalni hai.
*/
export const PRICE_NOTICE =
  "⚡ Prices are indicative and subject to market changes — Rates may increase or decrease. Add a quote or place your order for the latest price.";

/*
  Marquee seamless loop ke liye text ki copies chahiye: track ko aadha
  (-50%) chalaya jata hai, tou 4 copies me se 2 hamesha screen bharti hain -
  chahe monitor kitna hi chaura ho, gap nahi aata.
*/
const NOTICE_COPIES = 4;

/*
  Breadcrumb do tarah se diya ja sakta hai:

    parent={{ name: "Inverters", to: "/inverters" }}      -> ek beech ka link
    trail={[{ name, to }, { name, to }, ...]}             -> poora rasta

  `trail` un pages ke liye hai jahan hierarchy gehri hai, jaise
  Madni Solar / Inverters / Ongrid Inverters / Inverex / Single Phase.
  Dono na do tou sirf "Madni Solar / <currentPage>" dikhta hai.

  `priceNotice` sirf product wale banners (solar panels, inverters,
  batteries, products) par true hota hai - About/Contact/Policy pages par
  rate ki baat ka koi matlab nahi banta.
*/
function PageBanner({ image, title, currentPage, parent, trail, priceNotice }) {
  // `parent` ko bhi ek crumb ki tarah treat kar lete hain, taake neeche ek hi
  // loop se dono cases render ho jayen.
  const crumbs = trail && trail.length > 0 ? trail : parent ? [parent] : [];

  return (
    <section className={`page-banner${priceNotice ? " page-banner--with-notice" : ""}`}>
      {/* Background image - different for every page, passed as a prop */}
      <img src={image} alt={title} className="page-banner-bg" />

      {/* Dark overlay so text stays readable on any image */}
      <div className="page-banner-overlay"></div>

      {/* Safed patti banner ke bilkul upar - chalti hui price warning */}
      {priceNotice && (
        <div className="page-banner-notice">
          <div className="page-banner-notice-track">
            {Array.from({ length: NOTICE_COPIES }).map((_, i) => (
              <span
                key={i}
                className="page-banner-notice-text"
                /* Sirf pehli copy screen reader parhe, baaki dohrao hai */
                aria-hidden={i === 0 ? undefined : "true"}
              >
                {PRICE_NOTICE}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container page-banner-content">
        {/* Title - different for every page */}
        <h1 className="page-banner-title">{title}</h1>

        {/* Breadcrumb - "Madni Solar" is always a working link back home */}
        <p className="page-banner-breadcrumb">
          <Link to="/" className="page-banner-breadcrumb-link">
            Madni Solar
          </Link>
          <span className="page-banner-breadcrumb-sep"> / </span>

          {/* Beech ke saare links (Inverters / Ongrid Inverters / Inverex ...) */}
          {crumbs.map((crumb) => (
            <React.Fragment key={crumb.to || crumb.name}>
              {crumb.to ? (
                <Link to={crumb.to} className="page-banner-breadcrumb-link">
                  {crumb.name}
                </Link>
              ) : (
                <span className="page-banner-breadcrumb-current">{crumb.name}</span>
              )}
              <span className="page-banner-breadcrumb-sep"> / </span>
            </React.Fragment>
          ))}

          <span className="page-banner-breadcrumb-current">{currentPage}</span>
        </p>
      </div>
    </section>
  );
}

export default PageBanner;
