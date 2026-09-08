// Dummy inverter products — one per brand/category listed in the Inverters mega menu.
// As with src/data/solarProducts.js, this is static placeholder data that will later
// come from the admin/backend. Every product uses the same shape as the original
// Goodwe sample so the existing detail page + cart (addToBasket) flow work as-is.
import SolarImg from "../assets/solar-products/solar-product.webp";

// Turn a slug ("goodwe-three-phase-hv") into a display-ish name ("Goodwe Three Phase Hv").
const titleCase = (slug) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// Builds one fully-shaped dummy product object for a given brand/category slug.
const buildProduct = (slug) => ({
  name: `${titleCase(slug)} Solar Inverter`,
  slug,
  brandSlug: slug,
  price: 185000,
  image: SolarImg,
  shortDescription: `The ${titleCase(
    slug
  )} Solar Inverter is a placeholder dummy product used to demo the brand page flow.`,
  description: [
    `The ${titleCase(slug)} Solar Inverter is a representative dummy product for demo purposes.`,
    "It will be replaced with real inventory, models and specs once the admin/backend provides live data.",
    "Its listing card and detail page follow the exact same pattern as the Solar Panels brand products.",
  ],
  whyChoose: [
    "Clean, consistent demo product card",
    "Reuses the existing detail page layout",
    "Works with the same Add to Basket / Quote flow",
    "Ready to be swapped for real data later",
  ],
  categories: ["Inverters", titleCase(slug)],
});

// Every brand/category (and phase/model sub-category) from the mega menu.
const inverterProductSlugs = [
  // Ongrid Inverters
  "canadian",
  "fox",
  "solarmax",
  "sofar",
  "goodwe",
  "sineng",
  "growatt",
  "huawei",
  "inverex",
  "knox",
  "sma",
  "chint",
  "maxpower",
  "livoltek",
  "luminey",
  "solis",
  "sungrow",
  "ziewnic",
  "crown",
  // Batteryless PV Inverters
  "fronus",
  // Hybrid / additional ongrid columns
  "auxsol",
  "anicsun",
  "pilot",
  "solar-max",
  "itel",
  "hoymiles",
  "saj",
  // Phase / model sub-categories
  "inverex-single-phase",
  "inverex-three-phase",
  "goodwe-single-phase",
  "goodwe-three-phase-lv",
  "goodwe-three-phase-hv",
  "solis-single-phase",
  "solis-three-phase",
  "knox-krypton",
  "knox-xenon",
  "knox-zapher",
  "knox-zynex",
  "saj-single-phase",
  "saj-three-phase",
  "hoymiles-single-phase",
  "hoymiles-three-phase",
];

const inverterProducts = inverterProductSlugs.map(buildProduct);

export default inverterProducts;
