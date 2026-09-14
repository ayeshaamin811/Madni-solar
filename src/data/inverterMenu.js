// ============================================================================
// INVERTERS TREE HELPERS
// ----------------------------------------------------------------------------
// Category -> brand -> sub-variant tree ab backend se aati hai
// (src/api/inverters.js -> getInverterCategories()), is liye ye file ab koi
// static tree nahi rakhti — sirf us fetched tree par chalne waale pure
// helpers hain: breadcrumb trail, aur "ye slug kis category mein hai" lookup
// (purane flat /inverters/:brandSlug URLs ke liye).
// ============================================================================

// Breadcrumb trail. Fetched categories array + category slug + item slug do,
// aur ye wapas karta hai:
//
//   { category: {name, slug}, parent?: {name, slug}, item: {name, slug} }
//
// `parent` sirf tab aata hai jab item kisi brand ka sub-variant ho — is se
// breadcrumb "Ongrid Inverters / Inverex / Single Phase" ban jata hai.
// Category ya slug na mile tou null.
export const getInverterTrail = (categories, categorySlug, itemSlug) => {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return null;

  const categoryInfo = { name: category.name, slug: category.slug };

  for (const brand of category.brands) {
    if (brand.slug === itemSlug) {
      return { category: categoryInfo, item: { name: brand.name, slug: brand.slug } };
    }
    const sub = (brand.sub || []).find((s) => s.slug === itemSlug);
    if (sub) {
      return {
        category: categoryInfo,
        parent: { name: brand.name, slug: brand.slug },
        item: { name: sub.name, slug: sub.slug },
      };
    }
  }
  return null;
};

// Jo purane flat URLs (/inverters/:brandSlug) hain unke liye — pehli category
// jisme ye slug mojood ho, taake breadcrumb phir bhi bhara hua dikhe.
export const findCategoryForSlug = (categories, itemSlug) => {
  for (const category of categories) {
    if (getInverterTrail(categories, category.slug, itemSlug)) return category.slug;
  }
  return null;
};
