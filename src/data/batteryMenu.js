// ============================================================================
// BATTERIES TREE HELPERS
// ----------------------------------------------------------------------------
// Brand -> sub-variant tree (arbitrary depth) ab backend se aati hai
// (src/api/batteries.js -> getBatteryBrands()), is liye ye file ab koi static
// tree nahi rakhti — sirf ek constant (Batteries ki ek hi category, backend
// mein iska koi model nahi) aur us fetched tree par chalne waala breadcrumb
// helper hai.
// ============================================================================

// Category ka naam/slug — ek hi hai (koi backend model nahi), is liye
// constant rakh diya taake Navbar heading, breadcrumb aur pages sab ek hi
// jagah se lein.
export const BATTERY_CATEGORY = { name: "Batteries", slug: "batteries" };

// Breadcrumb trail. Fetched brands (top-level array, har node apna `sub`
// recursively carry karta hai) + item slug do, aur ye wapas karta hai:
//
//   { ancestors: [{name, slug}, ...], item: {name, slug, sub} }
//
// `ancestors` mein item ke upar ke saare parents aate hain (root se shuru),
// is liye breadcrumb "Batteries / Huawei / HV" tak poora ban jata hai.
// Category ka crumb ("Batteries") alag se nahi aata kyunke wo base path hi hai.
// Slug na mile tou null.
export const getBatteryTrail = (brands, itemSlug) => {
  if (!itemSlug) return null;

  const walk = (nodes, ancestors) => {
    for (const node of nodes) {
      if (node.slug === itemSlug) {
        return { ancestors, item: node };
      }
      const found = walk(node.sub || [], [
        ...ancestors,
        { name: node.name, slug: node.slug },
      ]);
      if (found) return found;
    }
    return null;
  };

  return walk(brands, []);
};
