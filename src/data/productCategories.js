// Product categories (Installation Accessories / Packages / Product Accessories
// / VFDs) — har ek apni page rakhti hai:
//   /products/installation-accessories
//   /products/packages
//   /products/product-accessories
//   /products/vfds
//
// src/data/inverterCategories.js jaisa hi pattern: kaun sa item kis category
// mein hai, ye yahan dobara nahi likha jata — sab kuch src/data/productsMenu.js
// (Navbar ki tree) se derive hota hai, taake menu aur pages kabhi alag na ho
// jayen. Yahan sirf har category ka intro text hai. Products khud
// src/data/productItems.js mein rehte hain.
import { productMenuSections } from "./productsMenu";

// Har category ka intro paragraph (category page par banner ke neeche aata hai).
const descriptions = {
  "installation-accessories":
    "Everything that goes around the panels and the inverter — DC/AC cabling, mounting structure, civil works, distribution boxes and the labour to put it all together, priced separately so you can see exactly what your installation includes.",
  packages:
    "Complete ready-to-install solar packages built around a single inverter brand — panels, inverter, structure, cabling and installation bundled into one price.",
  "product-accessories":
    "Brand-specific accessories — smart meters, dongles, monitoring modules, base plates and connection kits that match the inverter or battery you already own.",
  vfds:
    "Variable Frequency Drives for solar water pumping and motor loads, so you can run tube wells and pumps directly off solar without a battery bank.",
};

const productCategories = productMenuSections.map((section) => ({
  name: section.name,
  slug: section.slug,
  description: descriptions[section.slug] || "",
}));

// Helper: category slug se poori category nikaal lo (page component isko use karta hai).
export const getProductCategory = (slug) =>
  productCategories.find((category) => category.slug === slug);

export default productCategories;
