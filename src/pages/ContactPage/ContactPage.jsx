import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import ContactBannerImg from "../../assets/hero-banner.webp";
import { sendContactMessage, parseContactError } from "../../api/contact";
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
  const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  const [formData, setFormData] = useState(EMPTY_FORM);

  // Pehle sirf `submitted` boolean tha, is liye API fail hone par bhi
  // "Thank you!" dikh jata tha. Ab chaar states: idle | sending | success | error
  const [status, setStatus] = useState("idle");

  // Field-wise errors server se ({ email: "Enter a valid email address." })
  const [errors, setErrors] = useState({});

  // Form ke upar dikhne wala error (network / throttle / server)
  const [formError, setFormError] = useState("");

  // The office address - kept in one place so the text, map query,
  // and directions link always stay in sync
  const officeAddress = "Johar Town, Lahore, Pakistan";
  // Simple text query for the map - the most reliable embed format
  const mapQueryAddress = "Johar Town, Lahore, Pakistan";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // User dobara type kare tou us field ka purana error hata do — warna
    // theek karne ke baad bhi red text chipka rehta hai.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  // Server ke serializer jaise hi rules, client par. Maqsad ye hai ke aam
  // ghaltiyan server tak jayen hi na — DRF ka throttle (5/hour per IP) 400
  // responses ko bhi ginta hai, is liye har fail hui koshish ek slot kha jati
  // hai. `minLength` attribute jaan-boojh kar use nahi kiya: browser usay
  // chhote tooltip ke saath chup-chaap block karta hai, aur user ko lagta hai
  // form toota hua hai. Ye errors wahi red text dikhate hain jo server ke.
  const validate = (data) => {
    const found = {};

    if (data.name.trim().length < 2) {
      found.name = "Please enter your full name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      found.email = "Enter a valid email address.";
    }
    if (data.subject.trim().length < 3) {
      found.subject = "Please enter a subject (at least 3 characters).";
    }
    if (data.message.trim().length < 10) {
      found.message = "Please write a slightly longer message (at least 10 characters).";
    } else if (data.message.trim().length > 5000) {
      found.message = "Message is too long (max 5000 characters).";
    }

    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double submit band — warna button 5 dafa dabne par 5 messages jate hain.
    if (status === "sending") return;

    const clientErrors = validate(formData);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setFormError("Please fix the highlighted fields and try again.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrors({});
    setFormError("");

    try {
      await sendContactMessage(formData);
      setStatus("success");
      setFormData(EMPTY_FORM);
    } catch (error) {
      // Server ke 400 field errors aur throttle/network errors — dono ek hi
      // helper se aate hain (src/api/contact.js).
      const { fieldErrors, formError: message } = parseContactError(error);
      setErrors(fieldErrors);
      setFormError(message);
      setStatus("error");
    }
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
              <p className="contact-card-value">
                <a href="tel:+923701622103" className="contact-card-link">0370 1622103</a>
              </p>
              <p className="contact-card-value">
                <a href="tel:+924237900400" className="contact-card-link">042 37900400</a>
              </p>
              <p className="contact-card-label">Mon – Sat, 9AM –  ​6PM</p>
            </div>
            <div className="contact-card">
              <span className="contact-card-icon"><FaEnvelope /></span>
              <h3 className="contact-card-title">Email Us</h3>
              <p className="contact-card-value">info@madnisolar.com</p>
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

              {status === "success" ? (
                <div className="contact-success">
                  <span className="contact-success-icon-wrap">
                    <FaCheckCircle className="contact-success-icon" />
                  </span>
                  <h3>Thank you!</h3>
                  <p>Your message has been sent successfully. We will contact you soon.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  {formError && (
                    <p className="contact-form-error" role="alert">
                      {formError}
                    </p>
                  )}

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
                        aria-invalid={Boolean(errors.name)}
                      />
                      {errors.name && (
                        <span className="contact-field-error">{errors.name}</span>
                      )}
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
                        aria-invalid={Boolean(errors.email)}
                      />
                      {errors.email && (
                        <span className="contact-field-error">{errors.email}</span>
                      )}
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
                        aria-invalid={Boolean(errors.phone)}
                      />
                      {errors.phone && (
                        <span className="contact-field-error">{errors.phone}</span>
                      )}
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
                        aria-invalid={Boolean(errors.subject)}
                      />
                      {errors.subject && (
                        <span className="contact-field-error">{errors.subject}</span>
                      )}
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
                      maxLength={5000}
                      value={formData.message}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.message)}
                    ></textarea>
                    {errors.message && (
                      <span className="contact-field-error">{errors.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="contact-submit-btn"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <FaPaperPlane />
                      </>
                    )}
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