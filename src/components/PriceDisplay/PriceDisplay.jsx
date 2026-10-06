import React from "react";

// Shared phone number used by the "Call for price" links across the site.
export const CALL_FOR_PRICE_PHONE = "+923701622103";

// Keep "Call for price" looking like the surrounding price text (inherits the
// card/detail-page color/font-size) instead of a default blue underlined link.
const PRICE_LINK_STYLE = {
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
};

/**
 * Display a single product's price.
 *
 * - price > 0  -> renders "Rs<price>" exactly as before (a raw text node, no
 *                 extra wrapper element, same toLocaleString output).
 * - otherwise  -> renders "Call for price". Supply `inCard` when the price is
 *                 rendered inside a wrapping <Link>/<a> (product-grid cards):
 *                 then a <span role="link"> is used (never a nested <a>) that
 *                 stops the card navigation and opens the tel: dialer. Without
 *                 `inCard` a normal <a href="tel:..."> is rendered (detail pages).
 */
function PriceDisplay({ price, inCard = false }) {
  const numeric = Number(price);
  const hasPrice = Number.isFinite(numeric) && numeric > 0;

  if (hasPrice) {
    return <>{`Rs${numeric.toLocaleString()}`}</>;
  }

  const openDialer = () => {
    window.location.href = "tel:" + CALL_FOR_PRICE_PHONE;
  };

  if (inCard) {
    return (
      <span
        role="link"
        tabIndex={0}
        className="price-display price-display-call"
        onClick={(e) => {
          // Keep only the dialer from opening — never let the card's
          // <Link>/<a> navigate to the product page.
          e.preventDefault();
          e.stopPropagation();
          openDialer();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            openDialer();
          }
        }}
        style={PRICE_LINK_STYLE}
      >
        Call for price
      </span>
    );
  }

  return (
    <a
      href={"tel:" + CALL_FOR_PRICE_PHONE}
      className="price-display price-display-call"
      style={PRICE_LINK_STYLE}
    >
      Call for price
    </a>
  );
}

export default PriceDisplay;