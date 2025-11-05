import { Router } from "express";
import { spring } from "../services/springClient.js";

const router = Router();


const NEWS_TARGET = process.env.NEWS_PATH || "/api/news/nba-api";

/**
 * @swagger
 * tags:
 *   name: Noticias

 */

/**
 * @swagger
 * /api/news:
 *   get:
 *     description: Devuelve las noticias más recientes, obtenidas a través del servicio Spring configurado en NEWS_PATH.
 *     tags: [Noticias]
 *     security: []   
 *     parameters:
 *       - in: header
 *         name: X-API-KEY
 *         schema:
 *           type: string
 *         description: API key opcional para reenviar al backend de Spring
 *     responses:
 *       200:
 *         description: Lista de noticias obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   titulo:
 *                     type: string
 *                     example: "LeBron James logra triple-doble histórico"
 *                   fuente:
 *                     type: string
 *                     example: "NBA.com"
 *                   fecha:
 *                     type: string
 *                     example: "2025-11-02"
 *       500:
 *         description: Error al conectar con el backend de Spring
 */
router.get("/", async (req, res) => {
  try {
    const clientApiKey = req.header("x-api-key") || req.header("X-API-KEY");
    const headers = {};
    if (clientApiKey) headers["X-API-KEY"] = clientApiKey;

    const { data, status } = await spring.get(NEWS_TARGET, {
      headers,
      params: req.query,
    });

    res.status(status).json(data);
  } catch (e) {
    res.status(e.response?.status || 500).json({
      ok: false,
      error: "SPRING_NEWS_ERROR",
      detail: e.response?.data || e.message,
    });
  }
});

/**
 * @swagger
 * /api/news/mock:
 *   get:

 *     description: Devuelve un conjunto de noticias ficticias desde el backend Spring.
 *     tags: [Noticias]
 *     security: []   
 *     parameters:
 *       - in: header
 *         name: X-API-KEY
 *         schema:
 *           type: string
 *         description: API key opcional para reenviar al backend de Spring
 *     responses:
 *       200:
 *         description: Noticias mock devueltas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   titulo:
 *                     type: string
 *                     example: "Simulación de partido NBA"
 *                   fuente:
 *                     type: string
 *                     example: "Mock Service"
 *                   fecha:
 *                     type: string
 *                     example: "2025-11-02"
 *       500:
 *         description: Error al obtener noticias simuladas
 */
router.get("/mock", async (req, res) => {
  try {
    const clientApiKey = req.header("x-api-key") || req.header("X-API-KEY");
    const headers = {};
    if (clientApiKey) headers["X-API-KEY"] = clientApiKey;

    const { data, status } = await spring.get("/api/news/nba-mock", {
      headers,
      params: req.query,
    });

    res.status(status).json(data);
  } catch (e) {
    res.status(e.response?.status || 500).json({
      ok: false,
      error: "SPRING_NEWS_MOCK_ERROR",
      detail: e.response?.data || e.message,
    });
  }
});

export default router;
