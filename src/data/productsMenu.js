// ============================================================================
// PRODUCTS MEGA MENU — single source of truth for the whole hierarchy
// ----------------------------------------------------------------------------
// Bilkul src/data/inverterMenu.js ki tarah, ye file "Products" ki poori tree
// rakhti hai: category -> item -> sub-item (aur zaroorat ho tou us se aur
// neeche bhi). Isi ek jagah se teen cheezein banti hain:
//
//   1. Navbar ka Products mega menu (src/components/Navbar/Navbar.jsx)
//   2. Categories aur unke products (src/data/productCategories.js +
//      src/data/productItems.js)
//   3. Breadcrumb trail — getProductTrail() neeche
//
// Farq sirf itna hai ke Inverters ki tree do level gehri hai (brand + phase),
// aur yahan "Cables -> Nafees Cables -> DC/AC Cables" jaisi teen level bhi
// aati hai — is liye ke helpers recursive hain, fixed do level ke nahi.
//
// Structure (Navbar isi ke hisaab se layout karta hai):
//   group   -> ek block; `span` = menu grid ki kitni tracks leta hai
//   section -> heading + uski category slug
//   columns -> us section ke items, jitni columns mein baantna ho
// ============================================================================

// Navbar/data dono ek hi slug rule use karte hain. Inverters ke slugify se ek
// farq hai: yahan naam mein punctuation aata hai ("D.B Box with Breakers",
// "INVT (Original)"), is liye har non-alphanumeric run ko dash bana dete hain
// taake URL saaf rahe — "d-b-box-with-breakers", "invt-original".
export const slugifyProduct = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const productsMenu = [
  {
    // Left block: Installation Accessories + Packages neeche
    span: 1,
    sections: [
      {
        heading: "Installation Accessories",
        categorySlug: "installation-accessories",
        columns: [
          [
            { name: "Cables", sub: [{ name: "Nafees Cables", sub: ["DC Cables", "AC Cables"] }] },
            "Structure",
            "Installation Labor",
            "Civil Works",
            "D.B Box with Breakers",
            "Supporting Items",
          ],
        ],
      },
      {
        heading: "Packages",
        categorySlug: "packages",
        columns: [["Huawei", "Solis", "Goodwe"]],
      },
    ],
  },
  {
    // Right block: Product Accessories + VFDs neeche
    span: 1,
    sections: [
      {
        heading: "Product Accessories",
        categorySlug: "product-accessories",
        columns: [["Sungrow", "BYD", "Pylontech", "Luminey", "Fox", "Solis", "Huawei"]],
      },
      {
        heading: "VFDs",
        categorySlug: "vfds",
        columns: [["Invent", "INVT (Original)"]],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const labelOf = (entry) => (typeof entry === "object" ? entry.name : entry);
const isNavOnly = (entry) => typeof entry === "object" && Boolean(entry.to);

// Ek menu entry ko node mein badalta hai. Slug parent ke saath jud kar banta
// hai (Inverters jaisa hi rule), is liye "DC Cables" ka slug
// "cables-nafees-cables-dc-cables" hota hai — kisi doosri category ke same naam
// se takrata nahi.
const buildNode = (entry, parentSlug) => {
  const name = labelOf(entry);
  const ownSlug = slugifyProduct(name);
  const slug = parentSlug ? `${parentSlug}-${ownSlug}` : ownSlug;
  const subEntries = typeof entry === "object" && entry.sub ? entry.sub : [];

  return {
    name,
    slug,
    children: subEntries.filter((sub) => !isNavOnly(sub)).map((sub) => buildNode(sub, slug)),
  };
};

// Node tree ko menu order mein flat kar deta hai (parent, phir uske bachche).
const flattenNodes = (nodes) =>
  nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);

// Saari categories, node trees ke saath. Category pages aur breadcrumbs isi par
// chalte hain.
export const productMenuSections = productsMenu.flatMap((group) =>
  group.sections.map((section) => ({
    name: section.heading,
    slug: section.categorySlug,
    items: section.columns
      .flat()
      .filter((entry) => !isNavOnly(entry))
      .map((entry) => buildNode(entry, null)),
  }))
);

// Saare items (har category ke), category ke naam/slug ke saath — dummy products
// aur item lookups isi se bante hain.
export const allProductMenuItems = productMenuSections.flatMap((section) =>
  flattenNodes(section.items).map((node) => ({
    ...node,
    categoryName: section.name,
    categorySlug: section.slug,
  }))
);

// Breadcrumb trail. Category + item slug do, aur ye wapas karta hai:
//
//   { category: {name, slug}, ancestors: [{name, slug}, ...],
//     item: {name, slug, children} }
//
// `ancestors` mein item ke upar ke saare parents aate hain (menu order mein),
// is liye breadcrumb "Products / Installation Accessories / Cables /
// Nafees Cables / DC Cables" tak poora ban jata hai. Slug na mile tou null.
export const getProductTrail = (categorySlug, itemSlug) => {
  const section = productMenuSections.find((s) => s.slug === categorySlug);
  if (!section) return null;

  const category = { name: section.name, slug: section.slug };

  const walk = (nodes, ancestors) => {
    for (const node of nodes) {
      if (node.slug === itemSlug) {
        return {
          category,
          ancestors,
          // `children` bhi saath jata hai, taake item page apne sub-items
          // (Cables -> Nafees Cables) ke chips dikha sake.
          item: { name: node.name, slug: node.slug, children: node.children },
        };
      }
      const found = walk(node.children, [...ancestors, { name: node.name, slug: node.slug }]);
      if (found) return found;
    }
    return null;
  };

  return walk(section.items, []);
};

// Jis item ki category pata na ho (ya purana flat URL ho) — pehli category
// jisme ye slug mojood ho, taake breadcrumb phir bhi bhara hua dikhe.
export const findProductCategoryForSlug = (itemSlug) => {
  for (const section of productMenuSections) {
    if (getProductTrail(section.slug, itemSlug)) return section.slug;
  }
  return null;
};

export default productsMenu;
