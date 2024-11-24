import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async () => {
  return await API.get("/products");
};

export const login = async (credentials) => {
  return await API.post("/login", credentials);
};

export const register = async (userData) => {
  return await API.post("/register", userData);
};

export const addProduct = async (productData) => {
  return await API.post("/products", productData);
};

export default API;