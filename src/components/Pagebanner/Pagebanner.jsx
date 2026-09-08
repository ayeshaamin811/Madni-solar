import React from "react";
import "./Pagebanner.css";

function PageBanner({ image, title, currentPage, parent }) {
  return (
    <section className="page-banner">
      {/* Background image - different for every page, passed as a prop */}
      <img src={image} alt={title} className="page-banner-bg" />

      {/* Dark overlay so text stays readable on any image */}
      <div className="page-banner-overlay"></div>

      <div className="container page-banner-content">
        {/* Title - different for every page */}
        <h1 className="page-banner-title">{title}</h1>

        {/* Breadcrumb - "Home" is always a working link back to the home page */}
        <p className="page-banner-breadcrumb">
          <a href="/" className="page-banner-breadcrumb-link">
            Madni Solar
          </a>
          <span className="page-banner-breadcrumb-sep"> / </span>

          {/* Optional beech ka link, jaise "Inverters" - sirf tab jab parent diya ho */}
          {parent && (
            <>
              <a href={parent.to} className="page-banner-breadcrumb-link">
                {parent.name}
              </a>
              <span className="page-banner-breadcrumb-sep"> / </span>
            </>
          )}

          <span className="page-banner-breadcrumb-current">{currentPage}</span>
        </p>
      </div>
    </section>
  );
}

export default PageBanner;