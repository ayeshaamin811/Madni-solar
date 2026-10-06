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

// Ek node ke saath uske andar (nested sub-nodes) ke saare slugs mila ke
// lautaata hai (khud ka slug bhi shamil). Yaani BYD ke liye [byd, byd-hv,
// byd-lv] milte hain. Brand page par "All" state mein isi set se products
// filter kiye jaate hain, taake brand ke saare sub-variants (HV + LV) ke
// products ek saath dikhen — bina kisi hardcoding ke, generic tree ke liye.
export const getBatteryBranchSlugs = (node) => {
  if (!node) return [];
  return [
    node.slug,
    ...(node.sub || []).flatMap((child) => getBatteryBranchSlugs(child)),
  ];
};

// Kisi slug ke andar waala top-level brand node dhoondta hai (brands tree ka
// root item). Yahi wo brand hai jiske sub-variant chips (HV/LV) page par dikhne
// hain — chahe hum brand par hon ya uski kisi sub-variant par. Na mile tou null.
export const getBatteryBrandRoot = (brands, itemSlug) => {
  if (!brands || !itemSlug) return null;
  return (
    brands.find((brand) => getBatteryBranchSlugs(brand).includes(itemSlug)) ||
    null
  );
};
