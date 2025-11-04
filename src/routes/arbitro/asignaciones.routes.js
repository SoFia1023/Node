// MODFICADO ULTIMOOOOOOOOOOOOOOOO

import { Router } from "express";
import { spring, authHeaders } from "../../services/springClient.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = Router();
router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   name: Asignaciones
 */

/**
 * @swagger
 * /api/arbitro/asignaciones:
 *   get:
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones del árbitro
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/asignaciones", async (req, res) => {
  try {
    const r = await spring.get("/api/arbitro/asignaciones", { headers: authHeaders(req) });
    res.status(r.status).send(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || { error: e.message });
  }
});

/**
 * @swagger
 * /api/arbitro/asignaciones/{id}/aceptar:
 *   post:
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Asignación aceptada correctamente
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post("/asignaciones/:id/aceptar", async (req, res) => {
  try {
    const r = await spring.post(`/api/arbitro/asignaciones/${req.params.id}/aceptar`, null, { headers: authHeaders(req) });
    res.status(r.status).send(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || { error: e.message });
  }
});

/**
 * @swagger
 * /api/arbitro/asignaciones/{id}/rechazar:
 *   post:
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación
 *     responses:
 *       200:
 *         description: Asignación rechazada correctamente
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post("/asignaciones/:id/rechazar", async (req, res) => {
  try {
    const r = await spring.post(`/api/arbitro/asignaciones/${req.params.id}/rechazar`, null, { headers: authHeaders(req) });
    res.status(r.status).send(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || { error: e.message });
  }
});

export default router;
