import client from "./client";

export const getSolarPanelBrands = () =>
  client.get("/solar-panels/brands/").then((res) => res.data);

export const getSolarPanelProducts = (brandSlug) =>
  client
    .get("/solar-panels/products/", { params: brandSlug ? { brand: brandSlug } : {} })
    .then((res) => res.data);

export const getSolarPanelProduct = (slug) =>
  client.get(`/solar-panels/products/${slug}/`).then((res) => res.data);
