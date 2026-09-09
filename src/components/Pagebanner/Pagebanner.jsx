import React from "react";
import { Link } from "react-router-dom";
import "./Pagebanner.css";

/*
  Breadcrumb do tarah se diya ja sakta hai:

    parent={{ name: "Inverters", to: "/inverters" }}      -> ek beech ka link
    trail={[{ name, to }, { name, to }, ...]}             -> poora rasta

  `trail` un pages ke liye hai jahan hierarchy gehri hai, jaise
  Madni Solar / Inverters / Ongrid Inverters / Inverex / Single Phase.
  Dono na do tou sirf "Madni Solar / <currentPage>" dikhta hai.
*/
function PageBanner({ image, title, currentPage, parent, trail }) {
  // `parent` ko bhi ek crumb ki tarah treat kar lete hain, taake neeche ek hi
  // loop se dono cases render ho jayen.
  const crumbs = trail && trail.length > 0 ? trail : parent ? [parent] : [];

  return (
    <section className="page-banner">
      {/* Background image - different for every page, passed as a prop */}
      <img src={image} alt={title} className="page-banner-bg" />

      {/* Dark overlay so text stays readable on any image */}
      <div className="page-banner-overlay"></div>

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
