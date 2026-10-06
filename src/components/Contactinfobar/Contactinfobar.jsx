import React from "react";
import "./Contactinfobar.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const officeAddress =
  "3rd Floor, Plaze 28, Hassan Commercial, Al Rehman Garden Phase II, Lahore";

// Google Maps se copy kiya hua exact pin wala embed link
const mapSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.432189777448!2d74.4494564750724!3d31.59461524347112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39191034c9d415f5%3A0x6ae1cb2a458e057b!2sHFV2%2BVR3%20Hassan%20Commercial%20Gate%2C%2004%20Al-Rehman%20Garden%20Ln%2C%204%2F56%20Phase%203%20Al%20Rehman%20Garden%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1791287889527!5m2!1sen!2s";

// Simple reusable item for each contact info block
function ContactItem({ icon, label, href, children }) {
  const content = href ? (
    <a href={href} className="contact-link" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    children
  );

  return (
    <div className="contact-item flex items-center gap-3">
      <span className="contact-icon">{icon}</span>
      <div className="contact-text">
        <p className="contact-label">{label}</p>
        <p className="contact-value">{content}</p>
      </div>
    </div>
  );
}

function ContactInfoBar() {
  return (
    <div className="contact-bar">
      <div className="container contact-bar-inner">

        {/* Left: contact details */}
        <div className="contact-details">
          <ContactItem icon={<FaPhoneAlt />} label="Phone Number">
            <a href="tel:+923701622103" className="contact-link">0370 1622103</a>
            <span className="contact-value-sep">|</span>
            <a href="tel:+924237900400" className="contact-link">042 37900400</a>
          </ContactItem>

          <ContactItem icon={<FaEnvelope />} label="Email Us Here" href="mailto:info@madnisolar.com">
            info@madnisolar.com
          </ContactItem>

          {/* No href: address sirf text hai */}
          <ContactItem icon={<FaMapMarkerAlt />} label="Office Address">
            {officeAddress}
          </ContactItem>
        </div>

        {/* Right: map */}
        <div className="contact-bar-map">
          <iframe
            title="Madni Solar Location Map"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoBar;