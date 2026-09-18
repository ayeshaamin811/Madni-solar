import React from "react";
import "./Contactinfobar.css";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

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
      <div className="container flex items-center justify-between flex-wrap gap-6">


        {/* Contact details */}
        <div className="contact-details flex items-center flex-wrap gap-5">
          <ContactItem icon={<FaPhoneAlt />} label="Phone Number" href="tel:+923111666677">
            +923 111 666 677
          </ContactItem>

          <ContactItem icon={<FaEnvelope />} label="Email Us Here" href="mailto:info@madnisolar.com">
            info@madnisolar.com
          </ContactItem>

          <ContactItem
            icon={<FaMapMarkerAlt />}
            label="Office Address"
            href="https://www.google.com/maps/search/?api=1&query=502-C+Jubilee+Town+Canal+Bank+Lahore+Pakistan"
          >
            502-C Jubilee Town, Canal Bank Lahore Pakistan.
          </ContactItem>

          <ContactItem
            icon={<FaMapMarkerAlt />}
            label="Warehouse Address"
            href="https://www.google.com/maps/search/?api=1&query=Defence+Road+adjacent+to+US+Apparel+Lahore"
          >
            Defence Road, adjacent to US Apparel, Lahore
          </ContactItem>
        </div>
      </div>
    </div>
  );
}

export default ContactInfoBar;