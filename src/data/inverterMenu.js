// ============================================================================
// INVERTERS MEGA MENU — single source of truth for the whole hierarchy
// ----------------------------------------------------------------------------
// Ye file Inverters ki poori tree rakhti hai: category -> brand -> sub-variant
// (phase / model). Isi ek jagah se teen cheezein banti hain:
//
//   1. Navbar ka mega menu (src/components/Navbar/Navbar.jsx)
//   2. Category pages ka product list (src/data/inverterCategories.js)
//   3. Breadcrumb trail — getInverterTrail() neeche
//
// Pehle menu tree Navbar mein aur category lists alag file mein thi, tou dono
// alag ho jane ka khatra tha. Ab dono yahin se derive hoti hain.
//
// Structure (Navbar isi ke hisaab se layout karta hai):
//   group   -> ek block; `span` = menu grid ki kitni tracks leta hai
//   section -> heading + uski category slug
//   columns -> us section ke items, jitni columns mein baantna ho
// ============================================================================

// Navbar/data dono ek hi slug rule use karte hain.
export const slugifyInverter = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, "-");

const inverterMenu = [
  {
    // Left block: Ongrid Inverters (2 columns) + Batteryless PV Inverters neeche
    span: 1,
    sections: [
      {
        heading: "Ongrid Inverters",
        categorySlug: "ongrid-inverters",
        columns: [
          [
            "Canadian", "Fox", "SolarMax", "Sofar", "Goodwe", "Sineng", "Growatt", "Huawei",
            { name: "Inverex", sub: ["Single Phase", "Three Phase"] },
          ],
          [
            "Knox", "SMA", "Chint", "MaxPower", "Livoltek", "Luminey", "Solis", "Sungrow",
            "ZIEWNIC", "Crown",
          ],
        ],
      },
      {
        heading: "Batteryless PV Inverters",
        categorySlug: "batteryless-pv-inverters",
        columns: [["Fronus", "Ziewnic"]],
      },
    ],
  },
  {
    // Right block: Hybrid Inverters — ek hi heading, teen columns
    span: 1,
    sections: [
      {
        heading: "Hybrid Inverters",
        categorySlug: "hybrid-inverters",
        columns: [
          [
            // `to` waala item sirf navigation link hai — koi brand nahi, is liye
            // ye na category page par aata hai aur na breadcrumb trail mein.
            { name: "All Brands with Capacity (kW)", to: "/inverters" },
            "Chint", "Sineng", "Sofar",
            { name: "Hoymiles", sub: ["Single Phase", "Three Phase"] },
          ],
          [
            "Auxsol", "Fox",
            { name: "Goodwe", sub: ["Single Phase", "Three Phase LV", "Three Phase HV"] },
            "Growatt", "Inverex", "Anicsun", "MaxPower", "Pilot", "Luminey", "Crown",
          ],
          [
            "Solar Max",
            { name: "Solis", sub: ["Single Phase", "Three Phase"] },
            "Itel", "Huawei", "ZIEWNIC",
            { name: "Knox", sub: ["Krypton", "XENON", "Zapher", "Zynex"] },
            { name: "SAJ", sub: ["Single Phase", "Three Phase"] },
          ],
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const labelOf = (entry) => (typeof entry === "object" ? entry.name : entry);
const isNavOnly = (entry) => typeof entry === "object" && Boolean(entry.to);

// Saari category sections, flat form mein — brand aur uske sub-variants ke
// saath. Category pages aur breadcrumbs isi par chalte hain.
export const inverterMenuSections = inverterMenu.flatMap((group) =>
  group.sections.map((section) => ({
    name: section.heading,
    slug: section.categorySlug,
    brands: section.columns.flat().filter((entry) => !isNavOnly(entry)).map((entry) => {
      const name = labelOf(entry);
      const slug = slugifyInverter(name);
      return {
        name,
        slug,
        sub: (typeof entry === "object" && entry.sub ? entry.sub : []).map((subEntry) => {
          const subName = labelOf(subEntry);
          return { name: subName, slug: `${slug}-${slugifyInverter(subName)}` };
        }),
      };
    }),
  }))
);

// Ek category ke saare product slugs (brand + uske sub-variants), menu order mein.
export const getCategoryProductSlugs = (categorySlug) => {
  const section = inverterMenuSections.find((s) => s.slug === categorySlug);
  if (!section) return [];
  return section.brands.flatMap((brand) => [brand.slug, ...brand.sub.map((s) => s.slug)]);
};

// Breadcrumb trail. Category + item slug do, aur ye wapas karta hai:
//
//   { category: {name, slug}, parent?: {name, slug}, item: {name, slug} }
//
// `parent` sirf tab aata hai jab item kisi brand ka sub-variant ho — is se
// breadcrumb "Ongrid Inverters / Inverex / Single Phase" ban jata hai.
// Slug kisi category mein na mile tou null.
export const getInverterTrail = (categorySlug, itemSlug) => {
  const section = inverterMenuSections.find((s) => s.slug === categorySlug);
  if (!section) return null;

  const category = { name: section.name, slug: section.slug };

  for (const brand of section.brands) {
    if (brand.slug === itemSlug) {
      return { category, item: { name: brand.name, slug: brand.slug } };
    }
    const sub = brand.sub.find((s) => s.slug === itemSlug);
    if (sub) {
      return {
        category,
        parent: { name: brand.name, slug: brand.slug },
        item: { name: sub.name, slug: sub.slug },
      };
    }
  }
  return null;
};

// Jo purane flat URLs (/inverters/:brandSlug) hain unke liye — pehli category
// jisme ye slug mojood ho, taake breadcrumb phir bhi bhara hua dikhe.
export const findCategoryForSlug = (itemSlug) => {
  for (const section of inverterMenuSections) {
    if (getInverterTrail(section.slug, itemSlug)) return section.slug;
  }
  return null;
};

export default inverterMenu;
