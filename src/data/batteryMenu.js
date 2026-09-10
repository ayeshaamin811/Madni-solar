// ============================================================================
// BATTERIES MEGA MENU — single source of truth for the whole hierarchy
// ----------------------------------------------------------------------------
// Bilkul src/data/inverterMenu.js aur src/data/productsMenu.js ki tarah, ye
// file "Batteries" ki poori tree rakhti hai: brand -> sub-variant (HV / LV /
// model). Isi ek jagah se teen cheezein banti hain:
//
//   1. Navbar ka Batteries mega menu (src/components/Navbar/Navbar.jsx)
//   2. /batteries listing aur har brand ki page ka product list
//      (src/data/batteryProducts.js)
//   3. Breadcrumb trail — getBatteryTrail() neeche
//
// Pehle ye tree Navbar ke andar padi thi aur saare items href="#" thay, is liye
// koi page hi nahi banti thi. Ab tree yahan hai aur menu/pages/breadcrumbs
// teenon isi se derive hote hain — kabhi alag nahi ho sakte.
//
// INVERTERS SE EK FARQ: Inverters ki teen categories hain (Ongrid / Batteryless
// / Hybrid) is liye unka URL /inverters/<category>/<brand> banta hai. Batteries
// mein filhaal sirf EK category hai ("Batteries"), is liye us ki category page
// khud /batteries hi hai aur URL ek level chhota rehta hai:
//
//   /batteries                                 -> saari batteries ki listing
//   /batteries/<brandSlug>                     -> brand / capacity page
//   /batteries/<brandSlug>/<productSlug>       -> detail page
//
// Isi wajah se breadcrumb bhi Inverters jaisa hi dikhta hai, bas beech se
// duplicate "Batteries / Batteries" nahi aata:
//
//   Madni Solar / Batteries / Huawei / HV
//
// Structure (Navbar isi ke hisaab se layout karta hai):
//   group   -> ek block; `span` = menu grid ki kitni tracks leta hai
//   section -> heading + uski category slug
//   columns -> us section ke items, jitni columns mein baantna ho
// ============================================================================

// Navbar/data dono ek hi slug rule use karte hain. Inverters waale slugify se
// farq ye hai ke battery naamon mein punctuation aata hai ("14.33/16kwh LV
// Batteries", "LI-WALL 2.0", "2.5kwh Batteries") — sirf spaces collapse karne
// se URL mein slash/dot aa jate, is liye Products waala rule use karte hain:
// har non-alphanumeric run ek dash ban jata hai.
export const slugifyBattery = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Category ka naam/slug — ek hi hai, is liye yahan constant rakh diya taake
// Navbar heading, breadcrumb aur pages sab ek hi jagah se lein.
export const BATTERY_CATEGORY = { name: "Batteries", slug: "batteries" };

const batteryMenu = [
  {
    // Poori width leta hai (dono tracks), andar 4 columns
    span: 2,
    sections: [
      {
        heading: "Batteries",
        categorySlug: BATTERY_CATEGORY.slug,
        columns: [
          [
            "12V Batteries", "HV Batteries", "2.5kwh Batteries", "5kwh LV Batteries",
            "10kwh Batteries", "14.33/16kwh LV Batteries", "Lithium Valley", "Mesol",
            "SAJ", "Crown", "Fronus", "Pilot",
          ],
          [
            "Sofar", "Chint", "LvtopSun", "VestWoods",
            { name: "Huawei", sub: ["HV"] },
            "Inverex", "Hithium",
            { name: "BYD", sub: ["HV", "LV"] },
            "Knox", "Nimbess", "Itel",
          ],
          [
            "EVE", "Sunwoda", "Livoltek",
            { name: "EY Power", sub: ["HV", "LV"] },
            { name: "Dyness", sub: ["HV", "LV"] },
            { name: "Fox", sub: ["HV", "LV"] },
            { name: "ZIEWNIC", sub: ["LI-WALL 2.0", "Z Box European"] },
            { name: "Goodwe", sub: ["HV", "LV"] },
          ],
          [
            "Narada", "Vaults", "SunFlx", "Growatt", "Soluna", "ESS",
            { name: "PylonTech", sub: ["HV", "LV"] },
            "Max Power", "Hoymiles", "Auxsol",
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

// Ek menu entry ko node mein badalta hai. Slug parent ke saath jud kar banta
// hai (Inverters/Products jaisa hi rule), is liye Huawei ke neeche "HV" ka slug
// "huawei-hv" hota hai — BYD ya Fox ke "HV" se takrata nahi.
//
// `fullName` breadcrumb ke liye nahi, product ke naam ke liye hai: akela "HV"
// bemaani hai, "Huawei HV" theek lagta hai.
const buildNode = (entry, parent) => {
  const name = labelOf(entry);
  const ownSlug = slugifyBattery(name);
  const slug = parent ? `${parent.slug}-${ownSlug}` : ownSlug;
  const fullName = parent ? `${parent.fullName} ${name}` : name;
  const subEntries = typeof entry === "object" && entry.sub ? entry.sub : [];

  const node = { name, slug, fullName, children: [] };
  node.children = subEntries
    .filter((sub) => !isNavOnly(sub))
    .map((sub) => buildNode(sub, node));

  return node;
};

// Node tree ko menu order mein flat kar deta hai (parent, phir uske bachche).
const flattenNodes = (nodes) =>
  nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);

// Saari sections (filhaal ek), node trees ke saath. Pages aur breadcrumbs isi
// par chalte hain.
export const batteryMenuSections = batteryMenu.flatMap((group) =>
  group.sections.map((section) => ({
    name: section.heading,
    slug: section.categorySlug,
    items: section.columns
      .flat()
      .filter((entry) => !isNavOnly(entry))
      .map((entry) => buildNode(entry, null)),
  }))
);

// Saare items (brand + uske sub-variants), menu order mein — dummy products
// aur item lookups isi se bante hain.
export const allBatteryMenuItems = batteryMenuSections.flatMap((section) =>
  flattenNodes(section.items)
);

// Breadcrumb trail. Item slug do, aur ye wapas karta hai:
//
//   { ancestors: [{name, slug}, ...], item: {name, slug, fullName, children} }
//
// `ancestors` mein item ke upar ke saare parents aate hain (menu order mein),
// is liye breadcrumb "Batteries / Huawei / HV" tak poora ban jata hai.
// Category ka crumb ("Batteries") alag se nahi aata kyunke wo base path hi hai.
// Slug na mile tou null.
export const getBatteryTrail = (itemSlug) => {
  if (!itemSlug) return null;

  const walk = (nodes, ancestors) => {
    for (const node of nodes) {
      if (node.slug === itemSlug) {
        return {
          ancestors,
          // `children` bhi saath jata hai, taake brand page apne sub-items
          // (Huawei -> HV) ke chips dikha sake.
          item: node,
        };
      }
      const found = walk(node.children, [
        ...ancestors,
        { name: node.name, slug: node.slug },
      ]);
      if (found) return found;
    }
    return null;
  };

  for (const section of batteryMenuSections) {
    const found = walk(section.items, []);
    if (found) return found;
  }
  return null;
};

export default batteryMenu;
