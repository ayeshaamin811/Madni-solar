const fs = require("fs");
const nav = fs.readFileSync("src/components/Navbar/Navbar.jsx", "utf8");
const start = nav.indexOf("const invertersMenu = [");
const end = nav.indexOf("];", start) + 2;
const menuText = nav.slice(start + "const invertersMenu = ".length, end);
const menu = eval(menuText);
const slugify = (n) => n.toLowerCase().trim().replace(/\s+/g, "-");
const slugs = new Set();
function walk(items, parent) {
  for (const it of items) {
    const isObj = typeof it === "object";
    const lbl = isObj ? it.name : it;
    if (isObj && it.to) continue; // explicit destination (e.g. /inverters)
    const own = parent ? `${parent}-${slugify(lbl)}` : slugify(lbl);
    slugs.add(own);
    if (isObj && it.sub) walk(it.sub, own);
  }
}
for (const col of menu) walk(col.items);
for (const col of menu) if (col.extra) walk(col.extra.items);

const brands = fs.readFileSync("src/data/inverterBrands.js", "utf8");
const bs = [...brands.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const missing = [...slugs].filter((s) => !bs.includes(s));
const extra = bs.filter((b) => !slugs.has(b));

console.log("menu slugs:", slugs.size, "| data slugs:", bs.length);
console.log("menu slugs missing from data:", missing);
console.log("data slugs not reachable from menu:", extra);