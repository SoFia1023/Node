import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || req.get("Authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token JWT requerido en Authorization: Bearer <token>" });
  }

  const token = auth.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.decode(token);
    console.log("JWT decodificado:", decoded);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "Token JWT inválido o no decodificable" });
  }

  req.incomingAuth = auth; 
  next();
}
