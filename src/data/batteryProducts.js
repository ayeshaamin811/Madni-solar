// Dummy battery products — Batteries mega menu ke har item (aur sub-item) ke
// liye ek. src/data/inverterProducts.js / productItems.js jaisa hi placeholder
// data hai jo baad mein admin/backend se aayega. Shape bhi wahi hai, is liye
// detail page + cart (addToBasket) ka flow bina kisi tabdeeli ke chalta hai.
//
// Slug list hath se nahi likhi — seedha menu tree se aati hai, taake koi item
// menu mein add ho aur product banana bhool jane par page khaali na dikhe.
import SolarImg from "../assets/solar-products/solar-product.webp";
import { allBatteryMenuItems, BATTERY_CATEGORY } from "./batteryMenu";

// Product slug ke aage "battery-" lagate hain (Products waali file bhi category
// prefix karti hai). Wajah: cart aur "Add to Quote" sirf slug se product
// pehchante hain, aur Huawei / Fox / Goodwe / Knox / SAJ jaise naam Inverters
// ke data mein bhi mojood hain — prefix ke baghair basket mein Huawei battery
// aur Huawei inverter aapas mein mil jate.
const productSlugFor = (item) => `battery-${item.slug}`;

// Naam: sub-variant ka akela naam ("HV") bemaani hai, is liye parent ke saath
// poora naam ("Huawei HV") use karte hain. Jis naam mein pehle se "Batteries"
// aa raha ho ("12V Batteries") us par dobara "Battery" nahi lagate.
const productNameFor = (item) =>
  /batter/i.test(item.fullName) ? item.fullName : `${item.fullName} Battery`;

// Builds one fully-shaped dummy product object for a given menu item.
const buildProduct = (item) => {
  const name = productNameFor(item);

  return {
    name,
    slug: productSlugFor(item),
    // Item khud apna "brand" hai (Inverters mein bhi brandSlug menu item hi
    // hai), is liye URL /batteries/<brand>/<product> banta hai.
    brandSlug: item.slug,
    price: 165000,
    image: SolarImg,
    shortDescription: `${name} is a placeholder dummy product used to demo the batteries flow.`,
    description: [
      `${name} is a representative dummy product listed under ${BATTERY_CATEGORY.name}.`,
      "It will be replaced with real inventory, models and specs once the admin/backend provides live data.",
      "Its listing card and detail page follow the exact same pattern as the Inverters products.",
    ],
    whyChoose: [
      "Clean, consistent demo product card",
      "Reuses the existing detail page layout",
      "Works with the same Add to Basket / Quote flow",
      "Ready to be swapped for real data later",
    ],
    categories: [BATTERY_CATEGORY.name, item.fullName],
  };
};

const batteryProducts = allBatteryMenuItems.map(buildProduct);

// Ek item (brand ya sub-variant) ke products — brand page isko use karta hai.
export const getBatteryItemProducts = (itemSlug) =>
  batteryProducts.filter((product) => product.brandSlug === itemSlug);

export default batteryProducts;
