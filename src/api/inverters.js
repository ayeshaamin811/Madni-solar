import client from "./client";

export const getInverterCategories = () =>
  client.get("/inverters/categories/").then((res) => res.data);

export const getInverterProducts = ({ category, brand } = {}) =>
  client
    .get("/inverters/products/", {
      params: {
        ...(category ? { category } : {}),
        ...(brand ? { brand } : {}),
      },
    })
    .then((res) => res.data);

export const getInverterProduct = (slug) =>
  client.get(`/inverters/products/${slug}/`).then((res) => res.data);
