import client from "./client";

export const getBatteryBrands = () =>
  client.get("/batteries/brands/").then((res) => res.data);

export const getBatteryProducts = ({ brand } = {}) =>
  client
    .get("/batteries/products/", { params: brand ? { brand } : {} })
    .then((res) => res.data);

export const getBatteryProduct = (slug) =>
  client.get(`/batteries/products/${slug}/`).then((res) => res.data);
