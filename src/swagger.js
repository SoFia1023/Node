// MODIFICADO ULTIMOOOOOOOOOOOOOO

import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Árbitros",
    version: "1.0.0",
    description: "Documentación de la API Node que conecta con Spring Boot.",
  },
  servers: [
    {
      url: "http://localhost:4000", // 🔹 debe coincidir con tu server.js
      description: "Servidor local de desarrollo",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "Autenticación" },
    { name: "Perfil" },
    { name: "Asignaciones" },
    { name: "Liquidaciones" },
    { name: "Noticias" },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.js"], // 🔹 busca los bloques @swagger
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
