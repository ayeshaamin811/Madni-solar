import React from "react";
import { Link } from "react-router-dom";
import "./Solarservices.css";
import { FaLightbulb, FaHome, FaChargingStation, FaHandHoldingUsd, FaArrowRight } from "react-icons/fa";

// Images imported from the assets folder
import solarServices1 from "../../assets/solar-services/1.webp";
import solarServices2 from "../../assets/solar-services/2.webp";
import solarServices3 from "../../assets/solar-services/3.webp";
import solarServices4 from "../../assets/solar-services/4.webp";

function SolarServices() {
  // Services data - easy to update or load from an API later
  const servicesData = [
    {
      image: solarServices1,
      icon: <FaLightbulb />,
      title: "Solar Equipment Trading",
      description:
        "Supplying high-quality solar panels, inverters, cables, VFDs, batteries, and breakers.",
    },
    {
      image: solarServices2,
      icon: <FaHome />,
      title: "EPC Solar Solutions",
      description:
        "Complete EPC solar solutions including design, procurement, installation, and commissioning.",
    },
    {
      image: solarServices3,
      icon: <FaChargingStation />,
      title: "Net Billing Solutions",
      description:
        "WAPDA-approved net billing services to help reduce your electricity costs.",
    },
    {
      image: solarServices4,
      icon: <FaHandHoldingUsd />,
      title: "Solar Installments — Through Banks",
      description:
        "Madni Solar does not offer direct financing. Bank approval and terms apply.",
    },
  ];

  return (
    <section className="solar-services-section">
      <div className="container">
        {/* Small tag above heading */}
        <div className="services-tag flex justify-center">
          <span className="services-tag-highlight">About</span>
          <span className="services-tag-plain">Solar Service</span>
        </div>

        {/* Heading */}
        <h2 className="services-heading">
          A leading Lahore-based solar company offering high-quality solar
          products and professional services nationwide.
        </h2>

        {/* Cards */}
        <div className="services-grid grid">
          {servicesData.map((service, index) => (
            <div className="service-card" key={index}>
              {/* Top image */}
              <div className="service-image-wrapper">
                <img
                  src={service.image}
                  alt={service.title}
                  className="service-image"
                />
                {/* Icon badge overlapping the image */}
                <div className="service-icon-badge">{service.icon}</div>
              </div>

              {/* Card text content */}
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <button className="service-btn flex items-center justify-between">
                  Read More <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="view-all-wrapper flex justify-center">
          <Link to="/services">
          <button className="view-all-btn">View All Services</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SolarServices;