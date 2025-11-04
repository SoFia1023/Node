/*
// MODIFICADOOOOOOOOOOOO ULTIMOOOOOOOOOO

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import arbitroRoutes from "./routes/arbitro.js";
import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";

// ============================
// Swagger
// ============================
import swaggerUi from "swagger-ui-express"; // Paquete para servir Swagger UI
import swaggerSpec from "./swagger.js";      // Tu configuración Swagger (src/swagger.js)

// ⬇️ NUEVO: para servir el customJs (interceptor PDF)
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Para resolver rutas de /public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// Middlewares
// ============================
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// (opcional) Soportar x-www-form-urlencoded si algún cliente lo usa
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ============================
// Rutas base
// ============================
app.get("/", (_req, res) =>
  res.json({
    ok: true,
    name: "node-arbitro-api",
    version: "1.0.0",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/arbitro", arbitroRoutes);
app.use("/api/news", newsRoutes);

// ============================
// Servir estáticos (customJs)
// ============================
// Coloca tu archivo "public/swagger-pdf.js" en la raíz del proyecto (al nivel de /src)
app.use("/assets", express.static(path.join(__dirname, "../public")));

// ============================
// Swagger UI
// ============================
// Esto expone la documentación interactiva en:
// 👉 http://localhost:4000/api/docs
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,       // recuerda el token entre recargas
      displayRequestDuration: true,
    },
    // ⬇️ NUEVO: inyecta script que intercepta respuestas PDF y fuerza descarga .pdf
    customJs: "/assets/swagger-pdf.js",
  })
);

// ============================
// Manejo de rutas no encontradas
// ============================
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not Found",
    path: req.originalUrl,
  });
});

// ============================
// Servidor
// ============================
app.listen(PORT, () => {
  console.log(`[node-arbitro-api] Listening on http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api/docs`);
});
*/

// MODIFICADOOOOOOOOOOOO ULTIMOOOOOOOOOO
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// === AGREGADO (para evidencias de réplicas en Swarm) ===
import os from "os"; // <-- AGREGADO: usar hostname del contenedor

import arbitroRoutes from "./routes/arbitro.js";
import authRoutes from "./routes/auth.js";
import newsRoutes from "./routes/news.js";

// ============================
// Swagger
// ============================
import swaggerUi from "swagger-ui-express"; // Paquete para servir Swagger UI
import swaggerSpec from "./swagger.js";      // Tu configuración Swagger (src/swagger.js)

// ⬇️ NUEVO: para servir el customJs (interceptor PDF)
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Para resolver rutas de /public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// Middlewares
// ============================
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// (opcional) Soportar x-www-form-urlencoded si algún cliente lo usa
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// === AGREGADO (para evidencias de balanceo) ===============================
// Inyecta en TODAS las respuestas el ID del contenedor (hostname)
// Permite que el profe vea contenedores distintos en llamadas sucesivas
app.use((req, res, next) => {
  res.set("x-container-id", os.hostname()); // <-- AGREGADO
  next();
});
// ==========================================================================

// ============================
// Rutas base
// ============================
app.get("/", (_req, res) =>
  res.json({
    ok: true,
    name: "node-arbitro-api",
    version: "1.0.0",
    containerId: os.hostname(), // <-- AGREGADO (opcional pero útil para pantallazo)
  })
);

// === AGREGADO (endpoint de salud para pantallazos) =========================
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    containerId: os.hostname(), // evidencia de réplica
    now: new Date().toISOString(),
  });
});
// ==========================================================================

app.use("/api/auth", authRoutes);
app.use("/api/arbitro", arbitroRoutes);
app.use("/api/news", newsRoutes);

// ============================
// Servir estáticos (customJs)
// ============================
// Coloca tu archivo "public/swagger-pdf.js" en la raíz del proyecto (al nivel de /src)
app.use("/assets", express.static(path.join(__dirname, "../public")));

// ============================
// Swagger UI
// ============================
// Esto expone la documentación interactiva en:
// 👉 http://localhost:4000/api/docs
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,       // recuerda el token entre recargas
      displayRequestDuration: true,
    },
    // ⬇️ NUEVO: inyecta script que intercepta respuestas PDF y fuerza descarga .pdf
    customJs: "/assets/swagger-pdf.js",
  })
);

// ============================
// Manejo de rutas no encontradas
// ============================
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not Found",
    path: req.originalUrl,
  });
});

// ============================
// Servidor
// ============================
app.listen(PORT, () => {
  console.log(`[node-arbitro-api] Listening on http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api/docs`);
});
