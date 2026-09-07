import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/project-logo.png";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

// Professional icon set from react-icons (install: npm i react-icons)
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaTiktok, FaSearch, FaShoppingCart, FaBars, FaTimes, FaChevronDown, FaSun } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// ===== Dropdown data =====
// Plain strings are simple links. Objects { name, sub } have a nested sub-list.
// This mirrors the multi-column mega menus shown in the real site.

const aboutMenu = ["About", "Policy Trading", "Our Team", "Careers"];

const solarPanelsMenu = [
  "Yingli", "Aiko Solar", "Astronergy", "Huasun", "Hanersun", "Canadian",
  "Risen", "JA Solar", "TCL", "Ronma Solar", "Jinko", "Znshine",
  "Mesol Alpha", "Longi", "Osda", "Trina Solar", "Tongwei", "Cora Dawn",
];

// Inverters mega menu - 4 columns, matching the site's layout
const invertersMenu = [
  {
    heading: "Ongrid Inverters",
    items: [
      "Canadian", "Fox", "SolarMax", "Sofar", "Goodwe", "Sineng", "Growatt", "Huawei",
      { name: "Inverex", sub: ["Single Phase", "Three Phase"] },
      "Knox", "SMA", "Chint", "MaxPower", "Livoltek", "Luminey", "Solis", "Sungrow", "ZIEWNIC", "Crown",
    ],
    extra: {
      heading: "Batteryless PV Inverters",
      items: ["Fronus", "Ziewnic"],
    },
  },
  {
    heading: "Hybrid Inverters",
    items: [
      {
        name: "All Brands with Capacity (kW)",
        sub: [
          "12V Inverters (1 Phase)", "24V Inverters (1 Phase)", "6kw Inverters (1 Phase)",
          "8kw Inverters (1 Phase)", "10kw Inverters (1 Phase)", "12kw Inverters (1 Phase)",
          "12kw Inverters LV (3 Phase)", "15kw Inverters LV (3 Phase)",
          "20kw Inverters LV (3 Phase)", "25kw Inverters LV (3 Phase)",
        ],
      },
      "Chint", "Sineng", "Sofar",
      { name: "Hoymiles", sub: ["Single Phase", "Three Phase"] },
    ],
  },
  {
    heading: null,
    items: [
      "Auxsol", "Fox",
      { name: "Goodwe", sub: ["Single Phase", "Three Phase LV", "Three Phase HV"] },
      "Growatt", "Inverex", "Anicsun", "MaxPower", "Pilot", "Luminey", "Crown",
    ],
  },
  {
    heading: null,
    items: [
      "Solar Max",
      { name: "Solis", sub: ["Single Phase", "Three Phase"] },
      "Itel", "Huawei", "ZIEWNIC",
      { name: "Knox", sub: ["Krypton", "XENON", "Zapher", "Zynex"] },
      { name: "SAJ", sub: ["Single Phase", "Three Phase"] },
    ],
  },
];

// Batteries mega menu - 4 battery columns + a separate "Other Products" group
const batteriesMenu = [
  {
    heading: "Batteries",
    items: [
      "12V Batteries", "HV Batteries", "2.5kwh Batteries", "5kwh LV Batteries",
      "10kwh Batteries", "14.33/16kwh LV Batteries", "Lithium Valley", "Mesol",
      "SAJ", "Crown", "Fronus", "Pilot",
    ],
  },
  {
    heading: null,
    items: [
      "Sofar", "Chint", "LvtopSun", "VestWoods",
      { name: "Huawei", sub: ["HV"] },
      "Inverex", "Hithium",
      { name: "BYD", sub: ["HV", "LV"] },
      "Knox", "Nimbess", "Itel",
    ],
  },
  {
    heading: null,
    items: [
      "EVE", "Sunwoda", "Livoltek",
      { name: "EY Power", sub: ["HV", "LV"] },
      { name: "Dyness", sub: ["HV", "LV"] },
      { name: "Fox", sub: ["HV", "LV"] },
      { name: "ZIEWNIC", sub: ["LI-WALL 2.0", "Z Box European"] },
      { name: "Goodwe", sub: ["HV", "LV"] },
    ],
  },
  {
    heading: null,
    items: [
      "Narada", "Vaults", "SunFlx", "Growatt", "Soluna", "ESS",
      { name: "PylonTech", sub: ["HV", "LV"] },
      "Max Power", "Hoymiles", "Auxsol",
    ],
  },
];

// "Other Products" is shown alongside Batteries in the same mega menu
const otherProductsMenu = [
  {
    heading: "Installation Accessories",
    items: [
      { name: "Cables", sub: [{ name: "Nafees Cables", sub: ["DC Cables", "AC Cables"] }] },
      "Structure", "Installation Labor", "Civil Works", "D.B Box with Breakers", "Supporting Items",
    ],
    extra: {
      heading: "Packages",
      items: ["Huawei", "Solis", "Goodwe"],
    },
  },
  {
    heading: "Product Accessories",
    items: ["Sungrow", "BYD", "Pylontech", "Luminey", "Fox", "Solis", "Huawei"],
    extra: {
      heading: "VFDs",
      items: ["Invent", "INVT (Original)"],
    },
  },
];

const slugify = (name) => name.toLowerCase().trim().replace(/\s+/g, "-");
// Recursively renders a list of items, supporting one or two levels of nesting
const renderItems = (items, keyPrefix) =>
  items.map((item, index) => {
    const isObject = typeof item === "object";
    const label = isObject ? item.name : item;
    const key = `${keyPrefix}-${index}`;

    return (
      <li key={key} className="mega-item">
        <a href="#">
          <FaSun className="bullet-icon" /> {label}
        </a>
        {isObject && item.sub && (
          <ul className="mega-sublist">{renderItems(item.sub, key)}</ul>
        )}
      </li>
    );
  });

// Renders one mega menu column, including its optional heading and extra section
const renderColumn = (column, colIndex) => (
  <div className="mega-column" key={colIndex}>
    {column.heading && <h4 className="mega-heading">{column.heading}</h4>}
    <ul className="mega-list">{renderItems(column.items, `col${colIndex}`)}</ul>

    {column.extra && (
      <>
        <h4 className="mega-heading mega-heading-spaced">{column.extra.heading}</h4>
        <ul className="mega-list">{renderItems(column.extra.items, `col${colIndex}-extra`)}</ul>
      </>
    )}
  </div>
);

// Simple Navbar component with a top info bar and a main nav bar.
// The top bar hides on scroll down, and the main nav sticks to the top.
const Navbar = () => {
  // Tracks whether the page has been scrolled down
  const [isScrolled, setIsScrolled] = useState(false);

  // Tracks which dropdown menu is currently open (by name), or null if none
  const [openMenu, setOpenMenu] = useState(null);

  // Tracks whether the mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tracks whether the search overlay is open
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Holds the current search input value
  const [searchQuery, setSearchQuery] = useState("");

  // Tracks whether the mini-cart dropdown is open
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Global cart state (items, count, subtotal and action helpers)
  const { cartItems, cartCount, subtotal, removeFromBasket } = useCart();

  // Listen to scroll position to hide/show the top bar.
  // Throttled via requestAnimationFrame and guarded with a small
  // hysteresis band so tiny thumb jitter near the top doesn't flicker.
  useEffect(() => {
    const THRESHOLD = 10; // scroll down past this to hide the top bar
    const RESTORE = 2;    // scroll back up below this to show it again

    let rafId = null;

    const handleScroll = () => {
      if (rafId !== null) return; // already queued for this frame
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const y = window.scrollY;
        setIsScrolled((prev) => {
          if (y > THRESHOLD) return true;
          if (y < RESTORE) return false;
          return prev; // inside the dead-zone: keep current state, no re-render
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close the search overlay when the Escape key is pressed
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Toggles a dropdown menu open/closed (used on mobile tap)
  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <header className="navbar-wrapper">
      {/* Top info bar - hides when the page is scrolled */}
      <div className={`top-bar ${isScrolled ? "top-bar-hidden" : ""}`}>
        <div className="container top-bar-inner flex items-center justify-between">
          <div className="top-bar-left flex items-center">
            <a href="tel:+923111666677" className="top-bar-link">
              <FaPhoneAlt className="top-bar-icon" /> +923 111 666 677
            </a>
            <a href="mailto:info@madni solar.pk" className="top-bar-link">
              <FaEnvelope className="top-bar-icon" /> info@madni solar.pk
            </a>
          </div>
          <div className="top-bar-right flex items-center">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaXTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="TikTok"><FaTiktok /></a>
          </div>
        </div>
      </div>

      {/* Main navigation bar - always visible, sticks to top */}
      <nav className={`main-nav ${isScrolled ? "main-nav-scrolled" : ""}`}>
        <div className="container main-nav-inner flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="logo-link">
            <img src={logo} alt="madni solar Logo" className="logo-image" />
          </a>

          {/* Desktop menu */}
          <ul className="nav-menu">
            <li
              className="nav-item has-dropdown"
              onMouseEnter={() => setOpenMenu("about")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span className="nav-link">About <FaChevronDown className="chevron" /></span>
              {openMenu === "about" && (
                <ul className="dropdown">
                  {aboutMenu.map((item) => (
                    <li key={item}>
                      {item === "About" ? (
                        <Link to="/about">{item}</Link>
                      ) : item === "Contact" ? (
                        <Link to="/contact">{item}</Link>
                      ) : item === "Our Team" ? (
                        <Link to="/team">{item}</Link>
                      ) : item === "Careers" ? (
                        <Link to="/careers">{item}</Link>
                      ) : (
                        <a href="#">{item}</a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li
              className="nav-item has-dropdown"
              onMouseEnter={() => setOpenMenu("solarPanels")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span className="nav-link">Solar Panels <FaChevronDown className="chevron" /></span>
              {openMenu === "solarPanels" && (
                <ul className="dropdown dropdown-wide">
                  <div className="dropdown-columns">
                    {solarPanelsMenu.map((item) => (
                      <li key={item}>
                        <Link to={`/solar-panels/${slugify(item)}`}>
                          <FaSun className="bullet-icon" /> {item}
                        </Link>
                      </li>
                    ))}
                  </div>
                </ul>
              )}
            </li>
            <li
              className="nav-item has-dropdown"
              onMouseEnter={() => setOpenMenu("inverters")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span className="nav-link">Inverters <FaChevronDown className="chevron" /></span>
              {openMenu === "inverters" && (
                <div className="mega-menu">
                  <h3 className="mega-title">Inverters</h3>
                  <div className="mega-grid mega-grid-4">
                    {invertersMenu.map((column, index) => renderColumn(column, index))}
                  </div>
                </div>
              )}
            </li>

            <li
              className="nav-item has-dropdown"
              onMouseEnter={() => setOpenMenu("batteries")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span className="nav-link">Batteries <FaChevronDown className="chevron" /></span>
              {openMenu === "batteries" && (
                <div className="mega-menu mega-menu-wide">
                  <div className="mega-grid mega-grid-4">
                    {batteriesMenu.map((column, index) => renderColumn(column, `bat${index}`))}
                    <div className="mega-divider" />
                    {otherProductsMenu.map((column, index) => renderColumn(column, `other${index}`))}
                  </div>
                </div>
              )}
            </li>

            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>

            <li className="nav-item">
              <a href="/our-projects" className="nav-link">Projects</a>
            </li>
            <li className="nav-item">
              <a href="/orders" className="nav-link">Orders</a>
            </li>
            <li className="nav-item">
              <a href="/request-quote" className="nav-link">Request a Quote (Beta)</a>
            </li>
          </ul>

          {/* Right side actions */}
          <div className="nav-actions flex items-center">
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <FaSearch />
            </button>
            <button className="calculator-btn">CALCULATOR</button>
            <div className="cart-wrap">
              <button
                className="cart-btn"
                onClick={() => setIsCartOpen(!isCartOpen)}
                aria-expanded={isCartOpen}
                aria-label="Open shopping cart"
              >
                <span className="cart-price">Rs{subtotal.toLocaleString()}</span>
                <span className="cart-badge">{cartCount}</span>
                <FaShoppingCart />
              </button>

              {/* Mini-cart dropdown */}
              {isCartOpen && (
                <div className="mini-cart">
                  <div className="mini-cart-header">
                    <span>Shopping Cart</span>
                    <button
                      className="mini-cart-close"
                      aria-label="Close cart"
                      onClick={() => setIsCartOpen(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {cartItems.length === 0 ? (
                    <p className="mini-cart-empty">
                      Your basket is empty.
                    </p>
                  ) : (
                    <>
                      <ul className="mini-cart-items">
                        {cartItems.map((item) => (
                          <li key={item.slug} className="mini-cart-item">
                            <img 
                              src={item.image}
                              alt={item.name}
                              className="mini-cart-item-img"
                            />
                            <div className="mini-cart-item-info">
                              <span className="mini-cart-item-name">
                                {item.name}
                              </span>
                              <span className="mini-cart-item-price">
                                {item.quantity} × Rs{item.price.toLocaleString()}
                              </span>
                            </div>
                            <button
                              className="mini-cart-item-remove"
                              aria-label={`Remove ${item.name}`}
                              onClick={() => removeFromBasket(item.slug)}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="mini-cart-subtotal">
                        <span>Subtotal</span>
                        <span>Rs{subtotal.toLocaleString()}</span>
                      </div>

                      <div className="mini-cart-actions">
                        <Link
                          to="/cart"
                          className="mini-cart-btn mini-cart-btn-view"
                          onClick={() => setIsCartOpen(false)}
                        >
                          View basket
                        </Link>
                        <Link
                          to="/checkout"
                          className="mini-cart-btn mini-cart-btn-checkout"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Checkout
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger button - only shows on mobile */}
            <button
              className="hamburger-btn"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <ul className="mobile-menu">
            <li onClick={() => toggleMenu("about")}>
              <div className="mobile-nav-row">
                <span>About</span>
                <FaChevronDown className="chevron" />
              </div>
              {openMenu === "about" && (
                <ul className="mobile-dropdown">
                  {aboutMenu.map((item) => (
                    <li key={item}>
                      {item === "About" ? (
                        <Link to="/about">{item}</Link>
                      ) : item === "Contact" ? (
                        <Link to="/contact">{item}</Link>
                      ) : item === "Our Team" ? (
                        <Link to="/team">{item}</Link>
                      ) : item === "Careers" ? (
                        <Link to="/careers">{item}</Link>
                      ) : (
                        <a href="#">{item}</a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>

          <li onClick={() => toggleMenu("solarPanels")}>
            <div className="mobile-nav-row">
              <span>Solar Panels</span>
              <FaChevronDown className="chevron" />
            </div>
            {openMenu === "solarPanels" && (
              <ul className="mobile-dropdown">
                {solarPanelsMenu.map((item) => (
                  <li key={item}>
                    <Link
                      to={`/solar-panels/${slugify(item)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaSun className="bullet-icon" /> {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            </li>
          <li onClick={() => toggleMenu("inverters")}>
            <div className="mobile-nav-row">
              <span>Inverters</span>
              <FaChevronDown className="chevron" />
            </div>
            {openMenu === "inverters" && (
              <ul className="mobile-dropdown">
                {invertersMenu.map((column, index) => (
                  <React.Fragment key={index}>
                    {column.heading && <li className="mobile-section-heading">{column.heading}</li>}
                    {renderItems(column.items, `m-inv-${index}`)}
                    {column.extra && (
                      <>
                        <li className="mobile-section-heading">{column.extra.heading}</li>
                        {renderItems(column.extra.items, `m-inv-${index}-extra`)}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </li>

         <li onClick={() => toggleMenu("batteries")}>
          <div className="mobile-nav-row">
            <span>Batteries</span>
            <FaChevronDown className="chevron" />
          </div>
          {openMenu === "batteries" && (
            <ul className="mobile-dropdown">
              {batteriesMenu.map((column, index) => (
                <React.Fragment key={index}>
                  {column.heading && <li className="mobile-section-heading">{column.heading}</li>}
                  {renderItems(column.items, `m-bat-${index}`)}
                </React.Fragment>
              ))}
              {otherProductsMenu.map((column, index) => (
                <React.Fragment key={index}>
                  <li className="mobile-section-heading">{column.heading}</li>
                  {renderItems(column.items, `m-other-${index}`)}
                  {column.extra && (
                    <>
                      <li className="mobile-section-heading">{column.extra.heading}</li>
                      {renderItems(column.extra.items, `m-other-${index}-extra`)}
                    </>
                  )}
                </React.Fragment>
              ))}
            </ul>
          )}
        </li>

            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/our-projects">Projects</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/request-quote">Request a Quote (Beta)</Link></li>
          </ul>
        )}
      </nav>

      {/* Search overlay - slides down below the navbar */}
      <div className={`search-overlay ${isSearchOpen ? "search-overlay-open" : ""}`}>
        <div className="search-overlay-inner">
          <button
            className="search-close-btn"
            aria-label="Close search"
            onClick={() => setIsSearchOpen(false)}
          >
            <FaTimes />
          </button>
          <div className="search-input-wrap">
            <input
              type="text"
              className="search-input"
              placeholder="Searching..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-input-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;