// Shared product lookup used by the Request a Quote page.
// Detail pages sirf slug (+ brandSlug) URL mein bhejte hain, aur ye helper us se
// poora product object (name, price, image) dono data files se dhoond leta hai —
// isi liye page refresh ya shared link par bhi quote wala product zinda rehta hai.
//
// Solar panels ab backend se aate hain (src/api/solarPanels.js), baaki teenon
// (inverter/battery/product) abhi bhi static data files hain — is liye unka
// merge synchronous hai, aur solar panels ka fetch-once cache neeche.
import inverterProducts from "./inverterProducts";
import batteryProducts from "./batteryProducts";
import productItems from "./productItems";
import { getSolarPanelProducts } from "../api/solarPanels";

// Har product ke saath uska type rakho taake quote page category dikha sake.
// productItems ke slugs category ke saath prefixed hain ("packages-huawei") aur
// batteryProducts ke "battery-" ke saath ("battery-huawei"), is liye ye kisi
// inverter/panel slug se takrate nahi.
const staticProducts = [
  ...inverterProducts.map((product) => ({ ...product, type: "inverter" })),
  ...batteryProducts.map((product) => ({ ...product, type: "battery" })),
  ...productItems.map((product) => ({ ...product, type: "product" })),
];

// Solar panel products ek dafa API se fetch karke cache ho jate hain — baar baar
// request ki zaroorat nahi. Fetch fail ho jaye tou cache khaali reh jati hai aur
// agli call phir se try karti hai.
let solarPanelProductsCache = null;
let solarPanelProductsPromise = null;

function loadSolarPanelProducts() {
  if (solarPanelProductsCache) return Promise.resolve(solarPanelProductsCache);
  if (!solarPanelProductsPromise) {
    solarPanelProductsPromise = getSolarPanelProducts()
      .then((products) => {
        solarPanelProductsCache = products.map((product) => ({
          ...product,
          type: "solar-panel",
        }));
        return solarPanelProductsCache;
      })
      .catch(() => {
        solarPanelProductsPromise = null;
        return [];
      });
  }
  return solarPanelProductsPromise;
}

// slug (aur agar diya ho to brandSlug) se matching product return karta hai.
// Kuch na mile to null. `products` na diya jaye tou sirf static (non-solar-panel)
// list mein dhoondta hai.
export function findProduct(slug, brandSlug, products = staticProducts) {
  if (!slug) return null;

  return (
    products.find(
      (product) =>
        product.slug === slug && (!brandSlug || product.brandSlug === brandSlug)
    ) ||
    products.find((product) => product.slug === slug) ||
    null
  );
}

// Detail pages isi se "Add to Quote" ka link banate hain, taake query params
// ka shape ek hi jagah define ho.
export function buildQuoteLink(product, quantity = 1) {
  const params = new URLSearchParams({
    product: product.slug,
    brand: product.brandSlug || "",
    qty: String(Math.max(1, Number(quantity) || 1)),
  });

  return `/request-quote?${params.toString()}`;
}

// Checkout/cart ke "Ask for a quote" ke liye — poora basket ek hi link mein:
// /request-quote?items=<slug>:<qty>,<slug>:<qty>
export function buildCartQuoteLink(cartItems = []) {
  if (!cartItems.length) return "/request-quote";

  const items = cartItems
    .map((item) => `${item.slug}:${Math.max(1, Number(item.quantity) || 1)}`)
    .join(",");

  return `/request-quote?items=${encodeURIComponent(items)}`;
}

// Quote page yahan se apni item list banata hai. Pehle `items` (basket) dekhta
// hai, warna single `product` param. Har entry: { product, quantity, lineTotal }.
//
// Async hai kyunke solar panel products ab API se aate hain (loadSolarPanelProducts) —
// koi product/items param hi na ho tou ye fetch bhi nahi hota.
export async function parseQuoteItems(searchParams) {
  const itemsParam = searchParams.get("items");
  const productParam = searchParams.get("product");

  if (!itemsParam && !productParam) return [];

  const solarPanelProducts = await loadSolarPanelProducts();
  const allProducts = [...staticProducts, ...solarPanelProducts];

  if (itemsParam) {
    return itemsParam
      .split(",")
      .map((entry) => {
        const [slug, qty] = entry.split(":");
        const product = findProduct(slug, undefined, allProducts);
        if (!product) return null;

        const quantity = Math.max(1, Number(qty) || 1);
        return { product, quantity, lineTotal: product.price * quantity };
      })
      .filter(Boolean);
  }

  const product = findProduct(
    productParam,
    searchParams.get("brand"),
    allProducts
  );
  if (!product) return [];

  const quantity = Math.max(1, Number(searchParams.get("qty")) || 1);
  return [{ product, quantity, lineTotal: product.price * quantity }];
}

export default findProduct;
