// ============================================================================
// PRODUCTS (ACCESSORIES) TREE HELPERS
// ----------------------------------------------------------------------------
// Category -> item -> sub-item tree (arbitrary depth) ab backend se aati hai
// (src/api/products.js -> getProductCategories()), is liye ye file ab koi
// static tree nahi rakhti — sirf us fetched tree par chalne waale pure
// helpers hain: breadcrumb trail, aur "ye slug kis category mein hai" lookup
// (purane flat /products/:itemSlug URLs ke liye).
//
// Inverters se farq: yahan teen level tak nesting hoti hai (Cables -> Nafees
// Cables -> DC/AC Cables), is liye `parent` ki jagah poora `ancestors` array
// wapas karte hain (Batteries jaisa hi).
// ============================================================================

// Breadcrumb trail. Fetched categories array + category slug + item slug do,
// aur ye wapas karta hai:
//
//   { category: {name, slug}, ancestors: [{name, slug}, ...], item: {name, slug, sub} }
//
// `ancestors` mein item ke upar ke saare parents aate hain (root se shuru),
// is liye breadcrumb "Products / Installation Accessories / Cables / Nafees
// Cables / DC Cables" tak poora ban jata hai. Category ya slug na mile tou null.
export const getProductTrail = (categories, categorySlug, itemSlug) => {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return null;

  const categoryInfo = { name: category.name, slug: category.slug };

  const walk = (nodes, ancestors) => {
    for (const node of nodes) {
      if (node.slug === itemSlug) {
        return { category: categoryInfo, ancestors, item: node };
      }
      const found = walk(node.sub || [], [
        ...ancestors,
        { name: node.name, slug: node.slug },
      ]);
      if (found) return found;
    }
    return null;
  };

  return walk(category.items, []);
};

// Jis item ki category pata na ho (ya purana flat URL ho) — pehli category
// jisme ye slug mojood ho, taake breadcrumb phir bhi bhara hua dikhe.
export const findProductCategoryForSlug = (categories, itemSlug) => {
  for (const category of categories) {
    if (getProductTrail(categories, category.slug, itemSlug)) return category.slug;
  }
  return null;
};
