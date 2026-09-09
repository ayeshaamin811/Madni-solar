import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import ContactBannerImg from "../../assets/hero-banner.webp";
import "../ContactPage/ContactPage.css"
import {
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaDirections,
} from "react-icons/fa";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // The office address - kept in one place so the text, map query,
  // and directions link always stay in sync
  const officeAddress = "Johar Town, Lahore, Pakistan";
  // Simple text query for the map - the most reliable embed format
  const mapQueryAddress = "Johar Town, Lahore, Pakistan";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app you would POST formData to your API here.

    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* ===== Page banner with breadcrumb ===== */}
      <PageBanner
        image={ContactBannerImg}
        title="Contact"
        currentPage="Contact"
      />

      {/* ===== Contact info cards + form + map ===== */}
      <section className="contact-section">
        <div className="container">
          {/* Top info cards */}
          <div className="contact-cards flex flex-wrap justify-between gap-6">
            <div className="contact-card">
              <span className="contact-card-icon"><FaPhoneAlt /></span>
              <h3 className="contact-card-title">Call Us</h3>
              <p className="contact-card-value">+923 111 666 677</p>
              <p className="contact-card-label">Mon – Sat, 9AM –  ​6PM</p>
            </div>
            <div className="contact-card">
              <span className="contact-card-icon"><FaEnvelope /></span>
              <h3 className="contact-card-title">Email Us</h3>
              <p className="contact-card-value">info@madnisolar.pk</p>
              <p className="contact-card-label">We reply within 24 hours</p>
            </div>
            <div className="contact-card">
              <span className="contact-card-icon"><FaClock /></span>
              <h3 className="contact-card-title">Office Hours</h3>
              <p className="contact-card-value">9AM – 6PM</p>
              <p className="contact-card-label">Monday – Saturday</p>
            </div>
          </div>

          {/* Form + map */}
          <div className="contact-layout flex flex-wrap gap-10">
            {/* Contact form */}
            <div className="contact-form-wrap">
              <span className="section-label">Send a Message</span>
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-desc">
                Fill out the form below and our team will get back to you shortly.
              </p>

              {submitted ? (
                <div className="contact-success">
                  <FaCheckCircle className="contact-success-icon" />
                  <h3>Thank you!</h3>
                  <p>Your message has been sent successfully. We will contact you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row flex gap-4">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row flex gap-4">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Enter subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Write your message here..."
                      required
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    Send Message <FaPaperPlane />
                  </button>
                </form>
              )}
            </div>

            {/* Map embed */}
            <div className="contact-map-wrap">
              <div className="contact-map-heading">
                <h3>Our Location</h3>
                <p>{officeAddress}</p>
              </div>

              <div className="map-box">
          <iframe
            title="madni solar Location Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQueryAddress)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>

                {/* Floating card sitting on top of the map */}
                <div className="map-info-card">
                  <span className="map-info-icon">
                    <FaMapMarkerAlt />
                  </span>
                  <div className="map-info-text">
                    <p className="map-info-title">madni solar Office</p>
                    <p className="map-info-address">{officeAddress}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      mapQueryAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-directions-btn"
                  >
                    <FaDirections /> Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactPage;