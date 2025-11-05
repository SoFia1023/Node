import { Router } from "express";
import { spring } from "../services/springClient.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación

 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]

 *     security: []     # esta ruta NO requiere token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo: { type: string, example: arbitro1@gmail.com }
 *               contrasena: { type: string, example: 123456 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string, description: JWT }
 *       400: { description: Credenciales inválidas }
 *       500: { description: Error del servidor }
 */


router.post("/login", async (req, res) => {
  try {
    const r = await spring.post("/api/auth/login", req.body, {
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SPRING_API_KEY ? { "X-API-KEY": process.env.SPRING_API_KEY } : {}),
      },
    });
    res.status(r.status).send(r.data);
  } catch (e) {
    res
      .status(e.response?.status || 500)
      .send(e.response?.data || { error: e.message });
  }
});

export default router;
