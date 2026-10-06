import React from "react";
import "./Contactinfobar.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const officeAddress =
  "3rd Floor, Plaze 28, Hassan Commercial, Al Rehman Garden Phase II, Lahore";
const mapQueryAddress = `${officeAddress}, Pakistan`;

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
          {/* Do numbers hain, is liye ContactItem ka apna href use nahi karte —
              dono numbers apna apna tel: link leke aate hain. */}
          <ContactItem icon={<FaPhoneAlt />} label="Phone Number">
            <a href="tel:+923701622103" className="contact-link">0370 1622103</a>
            <span className="contact-value-sep">|</span>
            <a href="tel:+924237900400" className="contact-link">042 37900400</a>
          </ContactItem>

          <ContactItem icon={<FaEnvelope />} label="Email Us Here" href="mailto:info@madnisolar.com">
            info@madnisolar.com
          </ContactItem>

          <ContactItem
            icon={<FaMapMarkerAlt />}
            label="Office Address"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueryAddress)}`}
          >
            {officeAddress}
          </ContactItem>
        </div>

        {/* Right: map */}
        <div className="contact-bar-map">
          <iframe
            title="Madni Solar Location Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQueryAddress)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoBar;