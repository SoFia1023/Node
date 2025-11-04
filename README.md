# Node Árbitro API (Proxy de CABA‑Pro)

API REST en **Node/Express** (solo **rol Árbitro**) que **consume** la API de **Spring Boot**. Replica el esquema de rutas del árbitro para que puedas probar con Postman sin tocar endpoints de administrador.

## Requisitos
- Node 18+
- Spring Boot API corriendo en `SPRING_BASE_URL` (por defecto `http://localhost:8080`)
- Tener un **árbitro** creado y poder hacer **login** para obtener su **JWT**

## Configuración
1. Copia `.env.example` a `.env` y ajústalo:
```
SPRING_BASE_URL=http://localhost:8080
SPRING_API_KEY=pub_df6bfd4fe1ee4edcb0f9bf2ba096a51b
PORT=4000
MAX_UPLOAD_MB=5
```

2. Instala dependencias:
```bash
npm install
```

3. Ejecuta:
```bash
npm run dev
# o
npm start
```

API escucha en: `http://localhost:${PORT}` (por defecto **4000**).

## Autenticación
- **POST /auth/login** → proxyea `POST /api/auth/login` (Spring).  
  Enviar body JSON:
  ```json
  { "correo": "arbitro@mail.com", "contrasena": "Secreta123" }
  ```
  La respuesta incluye `token` JWT. Guarda `Authorization: Bearer <token>` para las rutas siguientes.

## Rutas del Árbitro
> **Todas** requieren header `Authorization: Bearer <TOKEN_DEL_ARBITRO>` y (si tu backend lo exige) `X-API-KEY`.

1. **Dashboard**
   - `GET /arbitro/dashboard` → `/api/arbitro/dashboard` (Spring)

2. **Perfil**
   - `GET /arbitro/perfil` → `/api/arbitro/perfil`
   - `PUT /arbitro/perfil` → `/api/arbitro/perfil` (Spring **espera multipart/form-data**).  
     **Body → form-data**:
     - `foto` (File, opcional). Tipos aceptados: **image/jpeg, image/png, image/webp**. Máx **5MB** (configurable).
     - `urlFoto` (Text, opcional). Si no subes archivo y quieres conservar/cambiar URL.
     - `quitarFoto` (Text, opcional) → `true`/`false`.
     - `fechasDisponibles` (Text, repetir una fila por cada fecha). **Formato requerido `YYYY-MM-DD`**.  
       _También se acepta una sola fila con CSV (`2025-11-05,2025-11-07`), el proxy lo normaliza a múltiples campos._

3. **Asignaciones**
   - `GET /arbitro/asignaciones` → `/api/arbitro/asignaciones`
   - `POST /arbitro/asignaciones/:id/aceptar` → `/api/arbitro/asignaciones/{id}/aceptar`
   - `POST /arbitro/asignaciones/:id/rechazar` → `/api/arbitro/asignaciones/{id}/rechazar`

4. **Liquidaciones**
   - `GET /arbitro/liquidaciones` → `/api/arbitro/liquidaciones`
   - `GET /arbitro/liquidaciones/:id/pdf` → `/api/arbitro/liquidaciones/{id}/pdf`  
     (El proxy reenvía el **PDF** tal cual; en Postman verás la descarga si el backend lo envía como `application/pdf`).

## Cómo verificar que **sí guarda** en la BD (igual que Spring)
1. Llama al endpoint **Spring** directo (ej. `PUT /api/arbitro/perfil`) con form‑data y asegúrate de que persiste.
2. Llama al **proxy Node** `PUT /arbitro/perfil` con el **mismo form‑data**.  
   - Verás en los logs de Spring el `PUT /api/arbitro/perfil` (si no, revisa `SPRING_BASE_URL`).
   - Si Spring devuelve 401/403/415, el proxy **propaga el mismo status** (no enmascara 200).

## Notas importantes
- Este proyecto **no registra árbitros**; el flujo de registro es solo para admin (según tu requisito).
- Si los paths reales en tu Spring difieren (`/api/arbitro/liquidaciones` etc.), cambia las rutas del proxy en `src/routes/arbitro.js`.
- Zona horaria: usa **America/Bogota** y formatea fechas como `YYYY-MM-DD` para evitar parseos erróneos.
