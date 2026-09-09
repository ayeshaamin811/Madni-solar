// Shared product lookup used by the Request a Quote page.
// Detail pages sirf slug (+ brandSlug) URL mein bhejte hain, aur ye helper us se
// poora product object (name, price, image) dono data files se dhoond leta hai —
// isi liye page refresh ya shared link par bhi quote wala product zinda rehta hai.
import solarPanelProducts from "./solarProducts";
import inverterProducts from "./inverterProducts";
import productItems from "./productItems";

// Har product ke saath uska type rakho taake quote page category dikha sake.
// productItems ke slugs category ke saath prefixed hain ("packages-huawei"),
// is liye ye kisi inverter/panel slug se takrate nahi.
const allProducts = [
  ...solarPanelProducts.map((product) => ({ ...product, type: "solar-panel" })),
  ...inverterProducts.map((product) => ({ ...product, type: "inverter" })),
  ...productItems.map((product) => ({ ...product, type: "product" })),
];

// slug (aur agar diya ho to brandSlug) se matching product return karta hai.
// Kuch na mile to null.
export function findProduct(slug, brandSlug) {
  if (!slug) return null;

  return (
    allProducts.find(
      (product) =>
        product.slug === slug && (!brandSlug || product.brandSlug === brandSlug)
    ) ||
    allProducts.find((product) => product.slug === slug) ||
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
export function parseQuoteItems(searchParams) {
  const itemsParam = searchParams.get("items");

  if (itemsParam) {
    return itemsParam
      .split(",")
      .map((entry) => {
        const [slug, qty] = entry.split(":");
        const product = findProduct(slug);
        if (!product) return null;

        const quantity = Math.max(1, Number(qty) || 1);
        return { product, quantity, lineTotal: product.price * quantity };
      })
      .filter(Boolean);
  }

  const product = findProduct(
    searchParams.get("product"),
    searchParams.get("brand")
  );
  if (!product) return [];

  const quantity = Math.max(1, Number(searchParams.get("qty")) || 1);
  return [{ product, quantity, lineTotal: product.price * quantity }];
}

export default findProduct;
