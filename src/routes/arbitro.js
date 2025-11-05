
import { Router } from "express";
import perfilRoutes from "./arbitro/perfil.routes.js";
import asignacionesRoutes from "./arbitro/asignaciones.routes.js";
import liquidacionesRoutes from "./arbitro/liquidaciones.routes.js";

const router = Router();

/**
 * @swagger
 * /api/arbitro/perfil:
 *   get:

 *     tags: [Árbitros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del árbitro obtenido correctamente
 *       401:
 *         description: No autorizado
 * 
 * /api/arbitro/asignaciones:
 *   get:

 *     tags: [Árbitros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones obtenida correctamente
 *       401:
 *         description: No autorizado
 * 
 * /api/arbitro/liquidaciones:
 *   get:

 *     tags: [Árbitros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de liquidaciones obtenida correctamente
 *       401:
 *         description: No autorizado
 */

router.use(perfilRoutes);
router.use(asignacionesRoutes);
router.use(liquidacionesRoutes);

export default router;
