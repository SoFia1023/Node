import { Router } from "express";
import { spring, authHeaders } from "../../services/springClient.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Liquidaciones

 */

/**
 * @swagger
 * /api/arbitro/liquidaciones:
 *   get:

 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de liquidaciones del árbitro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 12
 *                   torneo:
 *                     type: string
 *                     example: "Torneo Nacional 2024"
 *                   monto:
 *                     type: number
 *                     example: 450000
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     example: "2024-11-10"
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/liquidaciones", async (req, res) => {
  try {
    const r = await spring.get("/api/arbitro/liquidaciones", { headers: authHeaders(req) });
    res.status(r.status).send(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || { error: e.message });
  }
});

/**
 * @swagger
 * /api/arbitro/liquidaciones/{id}/pdf:
 *   get:

 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la liquidación a descargar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF de la liquidación (devuelto como archivo)
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Acceso prohibido (la liquidación no pertenece al árbitro autenticado)
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/liquidaciones/:id/pdf", async (req, res) => {
  try {
    const r = await spring.get(`/api/arbitro/liquidaciones/${req.params.id}/pdf`, {
      headers: authHeaders(req),
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", r.headers["content-type"] || "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=liquidacion.pdf");
    res.status(200).send(Buffer.from(r.data));
  } catch (e) {
    if (e.response?.data && e.response.headers?.["content-type"]?.includes("text")) {
      const message = e.response.data.toString("utf8");
      return res.status(e.response?.status || 500).json({ error: message });
    }
    res.status(e.response?.status || 500).send(e.response?.data || { error: e.message });
  }
});

export default router;
