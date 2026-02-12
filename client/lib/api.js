import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

export default api;

export const sendMessage = async (payload) => {
  const res = await api.post("/chat", payload);
  return res.data;
};
