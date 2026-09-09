// Dummy products — Products mega menu ke har item (aur sub-item) ke liye ek.
// src/data/inverterProducts.js jaisa hi placeholder data hai jo baad mein
// admin/backend se aayega. Shape bhi wahi hai, is liye detail page + cart
// (addToBasket) ka flow bina kisi tabdeeli ke chalta hai.
//
// Slug list hath se nahi likhi — seedha menu tree se aati hai, taake koi item
// menu mein add ho aur product banana bhool jane par page khaali na dikhe.
import SolarImg from "../assets/solar-products/solar-product.webp";
import { allProductMenuItems } from "./productsMenu";

// Product slug ke aage category ka slug lagate hain ("packages-huawei"). Do
// wajahein:
//   1. Ek hi naam do category mein aata hai (Huawei = Packages + Product
//      Accessories) — dono asal mein alag cheez hain, is liye alag product.
//   2. Cart aur "Add to Quote" sirf slug se product pehchante hain, aur wahi
//      naam Inverters ke data mein bhi mojood hai — prefix ke baghair basket
//      mein Huawei package aur Huawei inverter aapas mein mil jate.
const productSlugFor = (item) => `${item.categorySlug}-${item.slug}`;

// Builds one fully-shaped dummy product object for a given menu item.
const buildProduct = (item) => ({
  name: item.name,
  slug: productSlugFor(item),
  // Item khud apna "brand" hai (Inverters mein bhi brandSlug menu item hi hai),
  // is liye URL /products/<category>/<item>/<product> banta hai.
  brandSlug: item.slug,
  categorySlug: item.categorySlug,
  categoryName: item.categoryName,
  type: "product",
  price: 45000,
  image: SolarImg,
  shortDescription: `${item.name} is a placeholder dummy product under ${item.categoryName}, used to demo the products flow.`,
  description: [
    `${item.name} is a representative dummy product listed under ${item.categoryName}.`,
    "It will be replaced with real inventory, models and specs once the admin/backend provides live data.",
    "Its listing card and detail page follow the exact same pattern as the Inverters products.",
  ],
  whyChoose: [
    "Clean, consistent demo product card",
    "Reuses the existing detail page layout",
    "Works with the same Add to Basket / Quote flow",
    "Ready to be swapped for real data later",
  ],
  categories: ["Products", item.categoryName, item.name],
});

const productItems = allProductMenuItems.map(buildProduct);

// Ek category ke saare products, menu order mein (category page isko use karta hai).
export const getCategoryProducts = (categorySlug) =>
  productItems.filter((product) => product.categorySlug === categorySlug);

// Ek item ke products. Category pata ho tou usi ke andar dekhte hain, warna
// (purane flat URL par) jahan bhi ye item mile.
export const getItemProducts = (categorySlug, itemSlug) =>
  productItems.filter(
    (product) =>
      product.brandSlug === itemSlug &&
      (!categorySlug || product.categorySlug === categorySlug)
  );

export default productItems;
