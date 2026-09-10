import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export default client;
