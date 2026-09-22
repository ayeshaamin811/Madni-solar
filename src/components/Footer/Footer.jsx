import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
  FaPhone,
} from "react-icons/fa6";
import { HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

// Simple reusable link item with an arrow icon
function FooterLink({ text, to }) {
  return (
    <li className="footer-link-item">
      {to ? (
        <Link to={to}>
          <HiArrowRight className="footer-arrow-icon" />
          <span>{text}</span>
        </Link>
      ) : (
        <a href="#">
          <HiArrowRight className="footer-arrow-icon" />
          <span>{text}</span>
        </a>
      )}
    </li>
  );
}

function Footer() {
  return (
    <footer className="footer">
      {/* Top section: 4 columns */}
      <div className="container footer-top flex flex-wrap justify-between gap-8">
        {/* Column 1: About Company */}
        <div className="footer-column">
          <h3 className="footer-heading">About Company</h3>
          <p className="footer-about-text">
            Madni Solar specializes in trading high-quality solar products,
            including Tier-1 panels, inverters, batteries, and accessories.
            We also provide complete solar solutions such as system design,
            installation, net billing, and maintenance.
          </p>

          {/* Contact numbers — dono par seedha call ho jata hai */}
          <ul className="footer-contact-list">
            <li>
              <a href="tel:+923701622103">
                <FaPhone className="footer-contact-icon" />
                <span>0370 1622103</span>
              </a>
            </li>
            <li>
              <a href="tel:+924237900400">
                <FaPhone className="footer-contact-icon" />
                <span>042 37900400</span>
              </a>
            </li>
          </ul>

          {/* Social icons */}
          <div className="footer-socials flex gap-3">
            <a href="#" className="social-icon">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon">
              <FaXTwitter />
            </a>
            <a href="#" className="social-icon">
              <FaYoutube />
            </a>
            <a href="#" className="social-icon">
              <FaLinkedinIn />
            </a>
            <a href="#" className="social-icon">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Column 2: Useful Links */}
        <div className="footer-column">
          <h3 className="footer-heading">Useful Links</h3>
          <ul className="flex flex-col gap-3">
            <FooterLink text="About Us" to = "/about" />
            <FooterLink text="Projects"to = "/our-projects" />
            <FooterLink text="Products" to = "/our-products" />
            <FooterLink text="Our Services" to = "/services" />
            <FooterLink text="Our Team" to="/team" />
            {/* <FooterLink text="Sun Electronics" /> */}
          </ul>
        </div>

        {/* Column 3: Help & Legal */}
        <div className="footer-column">
          <h3 className="footer-heading">Help &amp; Legal</h3>
          <ul className="flex flex-col gap-3">
            <FooterLink text="Contact" to="/contact" />
            <FooterLink text="FAQ"  to="/Faqs" />
            <FooterLink text="Blog" to="/blog" />
            <FooterLink text="Privacy Policy" to= "/privacy-policy" />
            <FooterLink text="Terms And Conditions" to="/terms-and-conditions" />
            <FooterLink text="Refund Policy" to="/refund-policy" />
          </ul>
        </div>

        {/* Column 4: YouTube Channel */}
        <div className="footer-column">
          <h3 className="footer-heading">YouTube Channel</h3>

          {/* Video thumbnail */}
          <div className="footer-video-thumb">
            <img
              src="https://via.placeholder.com/300x170"
              alt="YouTube video thumbnail"
              className="w-full"
            />
            <div className="play-button">
              <span>&#9658;</span>
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            <FooterLink text="Link To The Channel" />
            <FooterLink text="Top Viewed Video" />
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container flex flex-wrap justify-between gap-2">
          <p>Copyright © Madni Solar LLP 2026 All Rights Reserved.</p>
          <p>
            Made by{" "}
            <a
              href="https://www.twocoreglobal.com/"
              target="_blank"
              rel="noreferrer"
              className="twocore-link"
            >
             <span className="company_link"> twocoreglobal </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;