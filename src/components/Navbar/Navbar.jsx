import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/project-logo.png";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { BATTERY_CATEGORY } from "../../data/batteryMenu";
import AuthModal from "../AuthModal/AuthModal";
import { getSolarPanelBrands } from "../../api/solarPanels";
import { getInverterCategories } from "../../api/inverters";
import { getBatteryBrands } from "../../api/batteries";
import { getProductCategories } from "../../api/products";

// Professional icon set from react-icons (install: npm i react-icons)
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaTiktok, FaSearch, FaShoppingCart, FaBars, FaTimes, FaChevronDown, FaBolt, FaMinus, FaRegUser } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// ===== Dropdown data =====
// Plain strings are simple links. Objects { name, sub } have a nested sub-list.
// This mirrors the multi-column mega menus shown in the real site.

const aboutMenu = ["About", "Policy Trading", "Our Team", "Careers"];

// ===== Mega menu shape (Inverters + Products + Batteries) =====
// Teenon menus ki tree ab backend se fetch hoti hai (src/api/inverters.js,
// src/api/products.js, src/api/batteries.js) — Navbar, category/brand pages
// aur breadcrumbs sab isi ek API response se banti hain, is liye menu aur
// pages kabhi alag nahi ho sakte.
//
//   group   -> ek category ka block; `span` = menu grid ki kitni tracks leta hai
//              (1 = apni jagah, 2 = poori width); groups ke darmiyan divider.
//   section -> heading + uski categorySlug, jo heading ko us category ki page
//              se link kar deta hai.
//   columns -> us section ke items, jitni columns mein baantna ho.

// Bullet icon: top-level brand par lightning (bolt), aur sub-items (phases /
// HV-LV / models) par dash icon — is se ek nazar mein pata chal jata hai ke ye
// kisi brand ke andar ka option hai, apna alag brand nahi. `depth` 0 = top level.
const bulletFor = (depth) =>
  depth === 0 ? (
    <FaBolt className="bullet-icon" />
  ) : (
    <FaMinus className="sub-bullet-icon" aria-hidden="true" />
  );

// Recursively renders a list of items, supporting one or two levels of nesting.
// Object items with a `to` property render as internal router links (menus
// jinke apne pages nahi hain, wahan nav-only shortcuts is tarah aate hain).
const renderItems = (items, keyPrefix, opts = {}) => {
  const { depth = 0 } = opts;
  return items.map((item, index) => {
    const isObject = typeof item === "object";
    const label = isObject ? item.name : item;
    const key = `${keyPrefix}-${index}`;

    const inner =
      isObject && item.to ? (
        <Link to={item.to}>
          {bulletFor(depth)} {label}
        </Link>
      ) : (
        <a href="#">
          {bulletFor(depth)} {label}
        </a>
      );

    return (
      <li key={key} className="mega-item">
        {inner}
        {isObject && item.sub && (
          <ul className="mega-sublist">
            {renderItems(item.sub, key, { depth: depth + 1 })}
          </ul>
        )}
      </li>
    );
  });
};

// ============================================================================
// GROUPED MEGA MENU RENDERERS (Inverters + Batteries)
// ----------------------------------------------------------------------------
// Ek group = ek category ka block (heading + uske items ki columns). Groups ke
// darmiyan vertical divider aata hai, aur group `span` ke mutabiq menu grid ki
// columns leta hai. `renderer` batata hai ke items kaise banenge —
// renderInverterItems / renderProductItems (apne apne pages ke links) ya
// renderItems (baaki menus).
// ============================================================================

// Section heading: `to` ho tou clickable link, warna plain text.
const renderMegaHeading = (heading, to, spaced) => (
  <h4 className={`mega-heading${spaced ? " mega-heading-spaced" : ""}`}>
    {to ? (
      <Link to={to} className="mega-heading-link">
        {heading}
      </Link>
    ) : (
      heading
    )}
  </h4>
);

// `totalCols` = mega grid ki kul tracks. Jo group poori width leta hai uska
// right divider hata dete hain, warna menu ke kinare par ek bekaar line aa jati
// hai. `basePath` se heading ka link banta hai (/inverters ya /products).
const renderMegaGroups = (groups, keyPrefix, renderer, totalCols, basePath = "/inverters") =>
  groups.map((group, groupIndex) => (
    <div
      className={`mega-group${group.span === totalCols ? " mega-group-full" : ""}`}
      key={`${keyPrefix}-g${groupIndex}`}
      style={{ "--mega-span": group.span }}
    >
      {group.sections.map((section, sectionIndex) => (
        <div className="mega-section" key={`${keyPrefix}-g${groupIndex}-s${sectionIndex}`}>
          {section.heading &&
            renderMegaHeading(
              section.heading,
              section.categorySlug ? `${basePath}/${section.categorySlug}` : undefined,
              sectionIndex > 0
            )}

          <div
            className="mega-section-columns"
            style={{ "--mega-cols": section.columns.length }}
          >
            {section.columns.map((columnItems, columnIndex) => (
              <ul
                className="mega-list"
                key={`${keyPrefix}-g${groupIndex}-s${sectionIndex}-c${columnIndex}`}
              >
                {renderer(
                  columnItems,
                  `${keyPrefix}-g${groupIndex}-s${sectionIndex}-c${columnIndex}`,
                  { categorySlug: section.categorySlug }
                )}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  ));

// ============================================================================
// PRODUCTS (ACCESSORIES) — API-driven renderer
// ----------------------------------------------------------------------------
// Har item (aur uske nested sub-items) apni page par jata hai:
//
//   /products/<categorySlug>/<itemSlug>
//
// Category URL mein hone ki wajah se breadcrumb poora ban jata hai —
// "Madni Solar / Products / Installation Accessories / Cables / Nafees Cables"
// — aur jo item ek se zyada category mein hai (Huawei, Solis) uska bhi pata
// chal jata hai ke user kis category se aaya tha.
// ----------------------------------------------------------------------------
// Products ka tree ab backend se aata hai (getProductCategories()) aur har
// node apna slug khud leke aata hai (arbitrary depth, jaisa Batteries mein),
// lekin categories bhi hain (jaisa Inverters mein) — is liye dono patterns
// milte hain: renderer categorySlug ke saath scoped hai aur recursive bhi.
// ============================================================================
const renderProductItems = (items, keyPrefix, opts = {}) => {
  const { categorySlug, depth = 0 } = opts;
  return items.map((item, index) => {
    const key = `${keyPrefix}-${index}`;
    const to = `/products/${categorySlug}/${item.slug}`;

    return (
      <li key={key} className="mega-item">
        <Link to={to}>
          {bulletFor(depth)} {item.name}
        </Link>
        {item.sub && item.sub.length > 0 && (
          <ul className="mega-sublist">
            {renderProductItems(item.sub, key, { categorySlug, depth: depth + 1 })}
          </ul>
        )}
      </li>
    );
  });
};

// Fetched categories (API tree) ko renderMegaGroups/renderMobileGroups ke
// groups/sections/columns shape mein dhalta hai. Har category ka ek hi
// column hai — original static menu mein bhi yahi tha (koi multi-column
// split nahi), is liye chunking ki zaroorat nahi.
const buildProductGroups = (categories) => {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const installation = bySlug["installation-accessories"];
  const packages = bySlug["packages"];
  const accessories = bySlug["product-accessories"];
  const vfds = bySlug["vfds"];

  const groups = [];

  const leftSections = [];
  if (installation) {
    leftSections.push({
      heading: installation.name,
      categorySlug: installation.slug,
      columns: [installation.items],
    });
  }
  if (packages) {
    leftSections.push({
      heading: packages.name,
      categorySlug: packages.slug,
      columns: [packages.items],
    });
  }
  if (leftSections.length) groups.push({ span: 1, sections: leftSections });

  const rightSections = [];
  if (accessories) {
    rightSections.push({
      heading: accessories.name,
      categorySlug: accessories.slug,
      columns: [accessories.items],
    });
  }
  if (vfds) {
    rightSections.push({
      heading: vfds.name,
      categorySlug: vfds.slug,
      columns: [vfds.items],
    });
  }
  if (rightSections.length) groups.push({ span: 1, sections: rightSections });

  return groups;
};

// ============================================================================
// INVERTERS — API-driven renderer
// ----------------------------------------------------------------------------
// Inverters ka tree ab backend se aata hai (getInverterCategories()) aur har
// node (brand ya sub-variant) apna slug khud leke aata hai — is liye
// makeLinkedItemRenderer (jo slug client-side compute karta hai) ki zaroorat
// nahi, seedha item.slug use karte hain.
// ============================================================================
const renderInverterBrandItems = (items, keyPrefix, opts = {}) => {
  const { categorySlug, depth = 0 } = opts;
  return items.map((item, index) => {
    const key = `${keyPrefix}-${index}`;
    const to = `/inverters/${categorySlug}/${item.slug}`;

    return (
      <li key={key} className="mega-item">
        <Link to={to}>
          {bulletFor(depth)} {item.name}
        </Link>
        {item.sub && item.sub.length > 0 && (
          <ul className="mega-sublist">
            {renderInverterBrandItems(item.sub, key, { categorySlug, depth: depth + 1 })}
          </ul>
        )}
      </li>
    );
  });
};

// Har category ke brands ko itni columns mein taqseem karta hai (roughly
// even) — column placement ab kisi API field se nahi aata, warna backend mein
// naya brand add hone par bhi menu ka layout theek rehta hai.
const chunkColumns = (items, columns) => {
  if (items.length === 0) return [];
  const size = Math.ceil(items.length / columns);
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

// Fetched categories (API tree) ko renderMegaGroups/renderMobileGroups ke
// groups/sections/columns shape mein dhalta hai (batteries/products jaisa hi
// shape) — column count/grouping yahan frontend ka layout decision hai.
const buildInverterGroups = (categories) => {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const ongrid = bySlug["ongrid-inverters"];
  const batteryless = bySlug["batteryless-pv-inverters"];
  const hybrid = bySlug["hybrid-inverters"];

  const groups = [];

  const leftSections = [];
  if (ongrid) {
    leftSections.push({
      heading: ongrid.name,
      categorySlug: ongrid.slug,
      columns: chunkColumns(ongrid.brands, 2),
    });
  }
  if (batteryless) {
    leftSections.push({
      heading: batteryless.name,
      categorySlug: batteryless.slug,
      columns: [batteryless.brands],
    });
  }
  if (leftSections.length) groups.push({ span: 1, sections: leftSections });

  if (hybrid) {
    groups.push({
      span: 1,
      sections: [
        {
          heading: hybrid.name,
          categorySlug: hybrid.slug,
          columns: chunkColumns(hybrid.brands, 3),
        },
      ],
    });
  }

  return groups;
};

// Batteries ki filhaal ek hi category hai ("Batteries") aur uski page khud
// /batteries hai — Inverters ki tarah alag category segment nahi banta. Is
// liye base path khaali rakhte hain aur URL section ki categorySlug se hi
// mukammal ho jata hai: heading -> /batteries, item -> /batteries/huawei,
// sub-item -> /batteries/huawei-hv.
const BATTERIES_BASE_PATH = "";

// ============================================================================
// BATTERIES — API-driven renderer
// ----------------------------------------------------------------------------
// Battery tree ab backend se aata hai (getBatteryBrands()) aur har node apna
// slug khud leke aata hai (arbitrary depth, Inverters ke `sub` jaisa hi) — is
// liye makeLinkedItemRenderer (jo slug client-side compute karta hai) ki
// zaroorat nahi, seedha item.slug use karte hain.
// ============================================================================
const renderBatteryBrandItems = (items, keyPrefix, opts = {}) => {
  const { categorySlug, depth = 0 } = opts;
  return items.map((item, index) => {
    const key = `${keyPrefix}-${index}`;
    const to = `${BATTERIES_BASE_PATH}/${categorySlug}/${item.slug}`;

    return (
      <li key={key} className="mega-item">
        <Link to={to}>
          {bulletFor(depth)} {item.name}
        </Link>
        {item.sub && item.sub.length > 0 && (
          <ul className="mega-sublist">
            {renderBatteryBrandItems(item.sub, key, { categorySlug, depth: depth + 1 })}
          </ul>
        )}
      </li>
    );
  });
};

// Battery brands ek hi flat list hain (koi sub-category nahi) — bas itni
// columns mein taqseem karte hain (roughly even), jaisa Inverters mein hota hai.
const buildBatteryGroups = (brands) => [
  {
    span: 2,
    sections: [
      {
        heading: BATTERY_CATEGORY.name,
        categorySlug: BATTERY_CATEGORY.slug,
        columns: chunkColumns(brands, 4),
      },
    ],
  },
];

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

  // Login / Register popup — pehle ye /orders page tha, ab modal hai
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Global cart state (items, count, subtotal and action helpers)
  const { cartItems, cartCount, subtotal, removeFromBasket } = useCart();

  // Solar Panels dropdown ab backend se aata hai (Django admin mein naya brand
  // add karte hi yahan bhi dikhna chahiye) — is liye hardcoded list ki jagah fetch.
  const [solarPanelBrands, setSolarPanelBrands] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getSolarPanelBrands().then((brands) => {
      if (!cancelled) setSolarPanelBrands(brands);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Inverters ka category/brand tree bhi ab backend se aata hai — Django admin
  // mein naya brand/sub-variant add karte hi yahan bhi dikhna chahiye.
  const [inverterCategories, setInverterCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getInverterCategories().then((categories) => {
      if (!cancelled) setInverterCategories(categories);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const inverterGroups = buildInverterGroups(inverterCategories);

  // Batteries ka brand tree bhi ab backend se aata hai.
  const [batteryBrands, setBatteryBrands] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getBatteryBrands().then((brands) => {
      if (!cancelled) setBatteryBrands(brands);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const batteryGroups = buildBatteryGroups(batteryBrands);

  // Products (Accessories) ka category/item tree bhi ab backend se aata hai.
  const [productCategories, setProductCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    getProductCategories().then((categories) => {
      if (!cancelled) setProductCategories(categories);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const productGroups = buildProductGroups(productCategories);

  // Mobile mega-menu ki section heading. Agar `to` diya ho (Ongrid / Hybrid /
  // Packages / VFDs ...) tou clickable link banti hai jo apni category page
  // kholti hai aur mobile drawer band kar deti hai; warna plain text rehti hai.
  const renderMobileHeading = (heading, to, key) => (
    <li className="mobile-section-heading" key={key}>
      {to ? (
        <Link
          to={to}
          className="mobile-section-heading-link"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {heading}
        </Link>
      ) : (
        heading
      )}
    </li>
  );

  // Mobile par wahi groups/sections dikhte hain jo desktop mega menu mein hain,
  // bas columns ko flatten kar ke ek hi list bana dete hain (mobile view ke
  // hisaab se) — heading, phir us section ke saare items, phir agla section.
  const renderMobileGroups = (groups, keyPrefix, renderer, basePath = "/inverters") =>
    groups.flatMap((group, groupIndex) =>
      group.sections.map((section, sectionIndex) => {
        const key = `${keyPrefix}-g${groupIndex}-s${sectionIndex}`;
        return (
          <React.Fragment key={key}>
            {section.heading &&
              renderMobileHeading(
                section.heading,
                section.categorySlug ? `${basePath}/${section.categorySlug}` : undefined,
                `${key}-h`
              )}
            {renderer(section.columns.flat(), key, {
              categorySlug: section.categorySlug,
            })}
          </React.Fragment>
        );
      })
    );

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
            <a href="mailto:info@madnisolar.com" className="top-bar-link">
              <FaEnvelope className="top-bar-icon" /> info@madnisolar.com
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
          <Link to="/" className="logo-link">
            <img src={logo} alt="madni solar Logo" className="logo-image" />
          </Link>

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
                      ) : item === "Policy Trading" ? (
                        <Link to="/policy-trading">{item}</Link>
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
                  {/* Heading khud "saare solar panels" page ka link hai —
                      Inverters/Batteries mega menus jaisa hi. */}
                  <li className="dropdown-title-item">
                    <Link
                      to="/solar-panels"
                      className="mega-title-link"
                      onClick={() => setOpenMenu(null)}
                    >
                      <h3 className="mega-title">Solar Panels</h3>
                    </Link>
                  </li>
                  <div className="dropdown-columns">
                    {solarPanelBrands.map((brand) => (
                      <li key={brand.slug}>
                        <Link
                          to={`/solar-panels/${brand.slug}`}
                          onClick={() => setOpenMenu(null)}
                        >
                          <FaBolt className="bullet-icon" /> {brand.name}
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
                  <Link
                    to="/inverters"
                    className="mega-title-link"
                    onClick={() => setOpenMenu(null)}
                  >
                    <h3 className="mega-title">Inverters</h3>
                  </Link>
                  <div className="mega-grid mega-grid-inverters">
                    {renderMegaGroups(inverterGroups, "inv", renderInverterBrandItems, 2)}
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
                  <Link
                    to="/batteries"
                    className="mega-title-link"
                    onClick={() => setOpenMenu(null)}
                  >
                    <h3 className="mega-title">Batteries</h3>
                  </Link>
                  <div className="mega-grid mega-grid-batteries">
                    {renderMegaGroups(
                      batteryGroups,
                      "bat",
                      renderBatteryBrandItems,
                      2,
                      BATTERIES_BASE_PATH
                    )}
                  </div>
                </div>
              )}
            </li>

            <li
              className="nav-item has-dropdown"
              onMouseEnter={() => setOpenMenu("products")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <span className="nav-link">Accessories <FaChevronDown className="chevron" /></span>
              {openMenu === "products" && (
                <div className="mega-menu mega-menu-products">
                  <Link
                    to="/products"
                    className="mega-title-link"
                    onClick={() => setOpenMenu(null)}
                  >
                    <h3 className="mega-title">Other Products</h3>
                  </Link>
                  <div className="mega-grid mega-grid-products">
                    {renderMegaGroups(productGroups, "prd", renderProductItems, 2, "/products")}
                  </div>
                </div>
              )}
            </li>

            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>

            <li className="nav-item">
              <Link to="/our-projects" className="nav-link">Projects</Link>
            </li>
            <li className="nav-item">
              <Link to="/request-quote" className="nav-link">Request a Quote (Beta)</Link>
            </li>
          </ul>

          {/* Right side actions */}
          <div className="nav-actions flex items-center">
            <button
              className="icon-btn account-btn"
              aria-label="Login or register"
              title="Login / Register"
              onClick={() => setIsAuthOpen(true)}
            >
              <FaRegUser />
            </button>
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <FaSearch />
            </button>
            <Link to="/calculator" className="calculator-btn">CALCULATOR</Link>
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
                      ) : item === "Policy Trading" ? (
                        <Link to="/policy-trading">{item}</Link>
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
                {renderMobileHeading("All Solar Panels", "/solar-panels", "m-sp-all")}
                {solarPanelBrands.map((brand) => (
                  <li key={brand.slug}>
                    <Link
                      to={`/solar-panels/${brand.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaBolt className="bullet-icon" /> {brand.name}
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
                {renderMobileGroups(inverterGroups, "m-inv", renderInverterBrandItems)}
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
              {renderMobileGroups(
                batteryGroups,
                "m-bat",
                renderBatteryBrandItems,
                BATTERIES_BASE_PATH
              )}
            </ul>
          )}
        </li>

        <li onClick={() => toggleMenu("products")}>
          <div className="mobile-nav-row">
            <span>Products</span>
            <FaChevronDown className="chevron" />
          </div>
          {openMenu === "products" && (
            <ul className="mobile-dropdown">
              {renderMobileHeading("All Products", "/products", "m-prd-all")}
              {renderMobileGroups(productGroups, "m-prd", renderProductItems, "/products")}
            </ul>
          )}
        </li>

            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/our-projects">Projects</Link></li>
            <li><Link to="/calculator" onClick={() => setIsMobileMenuOpen(false)}>Calculator</Link></li>
            <li>
              <button
                type="button"
                className="mobile-account-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthOpen(true);
                }}
              >
                <FaRegUser className="mobile-account-icon" /> Login / Register
              </button>
            </li>
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
      {/* Login / Register popup */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};

export default Navbar;