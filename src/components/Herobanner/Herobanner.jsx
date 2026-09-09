import React, { useState } from "react";
import "./Herobanner.css";
import heroImage from "../../assets/hero-banner.webp";

function HeroBanner() {
  // Today's date, shown in the blue box (dynamic - always shows the current date)
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Ticker items - this data can come from an API later.
  // Right now it's just simple state so it's easy to replace with real data.
  const [tickerItems] = useState([
    { name: "Longi Himo X10 Panel", price: "37.50/W", trend: "up" },
    { name: "Cora Dawn 615W Bifacial", price: "36.20/W", trend: "up" },
    { name: "Jinko Tiger Neo 585W", price: "35.90/W", trend: "down" },
    { name: "Canadian Solar 550W", price: "34.75/W", trend: "up" },
  ]);

  return (
    <section className="hero-banner">
      {/* Background image */}
      <img src={heroImage} alt="Solar installer on a rooftop" className="hero-bg-image" />

      {/* Dark overlay so text stays readable on top of the image */}
      <div className="hero-overlay"></div>

      <div className="container hero-content">
        {/* Small welcome text */}
        <p className="hero-welcome">Welcome to madni solar</p>

        {/* Price ticker row */}
        <div className="ticker-row flex">
          {/* Orange label */}
          <div className="ticker-label">Solar Panel Rates</div>

          {/* Blue date box */}
          <div className="ticker-date">{formattedDate}</div>

          {/* Grey sliding ticker - pauses on hover */}
          <div className="ticker-track-wrapper">
            <div className="ticker-track">
              {/* Render the list twice so the scroll loop looks seamless */}
              {[...tickerItems, ...tickerItems].map((item, index) => (
                <span className="ticker-item" key={index}>
                  <strong>{item.price}</strong>{" "}
                  <span className={`ticker-arrow ${item.trend}`}>
                    {item.trend === "up" ? "▲" : "▼"}
                  </span>{" "}
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="hero-heading">
          Solar Products and Installation Services Across Pakistan
        </h1>

        {/* Description */}
        <p className="hero-description">
          madni solar supplies reliable solar products and installation services
          for homes, businesses, industries and farms across Pakistan.
        </p>

        {/* Buttons */}
        <div className="hero-buttons flex">
          <a href="/contact" className="btn btn-primary-hero">
            Contact Us
          </a>
          <a href="/services" className="btn btn-secondary">
            Our Services
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;