// MODFICADO ULTIMOOOOOOOOOOOOOOO

import { Router } from "express";
import multer from "multer";
import FormData from "form-data";
import { spring, authHeaders } from "../../services/springClient.js";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { subirArchivoCloudinary } from "../../services/cloudinaryClient.js";

const router = Router();
router.use(requireAuth);

// Multer en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024 },
});

/**
 * @swagger
 * tags:
 *   name: Perfil

 */

/**
 * @swagger
 * /api/arbitro/perfil:
 *   get:

 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil del árbitro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 email:
 *                   type: string
 *                   example: "juanperez@example.com"
 *                 urlFoto:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/v123/avatar.jpg"
 *                 fechasDisponibles:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-10"
 *       401:
 *         description: No autorizado o token inválido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/perfil", async (req, res) => {
  try {
    const r = await spring.get("/api/arbitro/perfil", { headers: authHeaders(req) });
    res.status(r.status).send(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || { error: e.message });
  }
});

/**
 * @swagger
 * /api/arbitro/perfil:
 *   put:

 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del árbitro (jpg, png o webp)
 *               urlFoto:
 *                 type: string
 *                 description: URL de una imagen existente en Cloudinary
 *                 example: "https://res.cloudinary.com/demo/image/upload/v123/avatar.jpg"
 *               quitarFoto:
 *                 type: boolean
 *                 description: Indica si se debe eliminar la foto actual
 *                 example: false
 *               fechasDisponibles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *                   example: "2025-11-10"
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Algún dato enviado no tiene el formato esperado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno o al subir la imagen
 */
router.put("/perfil", upload.single("foto"), async (req, res) => {
  try {
    // Subida de imagen si existe archivo
    if (req.file) {
      const nombre = `${Date.now()}_${req.file.originalname}`;
      const url = await subirArchivoCloudinary(req.file.buffer, nombre);
      req.body.urlFoto = url;
    }

    // Normalización de fechas disponibles
    let fechas = [];
    const val = req.body.fechasDisponibles;
    if (Array.isArray(val)) fechas = val;
    else if (typeof val === "string" && val.trim().length > 0) {
      fechas = val.includes(",") ? val.split(",").map(s => s.trim()) : [val.trim()];
    }

    // Validar formato de fechas
    const isoDate = /^\d{4}-\d{2}-\d{2}$/;
    for (const f of fechas) {
      if (!isoDate.test(f)) {
        return res.status(400).json({ ok: false, error: `Fecha inválida '${f}'` });
      }
    }

    // Preparar datos para enviar al backend de Spring
    const form = new FormData();
    if (req.body.quitarFoto !== undefined) form.append("quitarFoto", String(req.body.quitarFoto));
    if (req.body.urlFoto) form.append("urlFoto", String(req.body.urlFoto));
    for (const f of fechas) form.append("fechasDisponibles", f);

    const headers = { ...authHeaders(req), ...form.getHeaders() };
    const r = await spring.put("/api/arbitro/perfil", form, { headers });
    res.status(r.status).send(r.data);
  } catch (e) {
    res.status(e.response?.status || 500).send(e.response?.data || { error: e.message });
  }
});

export default router;
