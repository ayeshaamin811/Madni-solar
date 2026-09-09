// Inverter categories (Ongrid / Batteryless PV / Hybrid) — apni page rakhti hain:
//   /inverters/ongrid-inverters
//   /inverters/batteryless-pv-inverters
//   /inverters/hybrid-inverters
//
// Kaun sa brand kis category mein hai, ye yahan dobara nahi likha jata — sab
// kuch src/data/inverterMenu.js (Navbar ki tree) se derive hota hai, taake menu
// aur pages kabhi alag na ho jayen. Yahan sirf har category ka intro text hai.
// Products khud src/data/inverterProducts.js mein rehte hain.
import {
  inverterMenuSections,
  getCategoryProductSlugs,
} from "./inverterMenu";

// Har category ka intro paragraph (category page par banner ke neeche aata hai).
const descriptions = {
  "ongrid-inverters":
    "Ongrid (grid-tie) inverters convert the DC power from your solar panels into AC and sync it directly with the WAPDA grid — the best choice when you want net metering and don't need battery backup.",
  "batteryless-pv-inverters":
    "Batteryless PV inverters run your load directly from the solar panels, with the grid as backup, so there is no battery bank to buy or maintain. A low-cost option for daytime loads where backup power is not the priority.",
  "hybrid-inverters":
    "Hybrid inverters run all three power sources — grid, solar and battery — from a single unit, so you get backup during load shedding as well as net metering. Every brand is available in single phase and three phase capacities.",
};

const inverterCategories = inverterMenuSections.map((section) => ({
  name: section.name,
  slug: section.slug,
  description: descriptions[section.slug] || "",
  // Page multi-section categories bhi support karta hai; filhaal har category
  // ka ek hi section hai, jiska heading category ka naam hi hai.
  sections: [
    {
      heading: section.name,
      productSlugs: getCategoryProductSlugs(section.slug),
    },
  ],
}));

// Helper: category slug se poori category nikaal lo (page component isko use karta hai).
export const getInverterCategory = (slug) =>
  inverterCategories.find((category) => category.slug === slug);

export default inverterCategories;
