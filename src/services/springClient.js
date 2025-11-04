import axios from "axios";

export const spring = axios.create({
  baseURL: process.env.SPRING_BASE_URL || "http://localhost:8080",
  timeout: 30000,
});

export function authHeaders(req) {
  const h = {};
  if (req.incomingAuth) h.Authorization = req.incomingAuth;
  if (process.env.SPRING_API_KEY) h["X-API-KEY"] = process.env.SPRING_API_KEY;
  return h;
}
