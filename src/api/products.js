import client from "./client";

export const getProductCategories = () =>
  client.get("/products/categories/").then((res) => res.data);

export const getProducts = ({ category, item } = {}) =>
  client
    .get("/products/products/", {
      params: {
        ...(category ? { category } : {}),
        ...(item ? { item } : {}),
      },
    })
    .then((res) => res.data);

export const getProduct = (slug) =>
  client.get(`/products/products/${slug}/`).then((res) => res.data);
