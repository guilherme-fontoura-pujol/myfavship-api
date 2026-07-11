import { paths } from "../docs";
import { schemas } from "../docs/schemas";

const swaggerDocument = {
  openapi: "3.0.3",

  info: {
    title: "MyFavShip API",
    version: "1.0.0",
    description:
      "API REST para cadastro de obras, personagens, ships, votos e rankings.",
  },

  servers: [
    {
      url: "http://localhost:3333",
      description: "Servidor local",
    },
  ],

  tags: [
    {
      name: "Auth",
      description: "Cadastro e autenticação de usuários",
    },
    {
      name: "Search",
      description: "Pesquisa global",
    },
    {
      name: "Rankings",
      description: "Rankings e dados do dashboard",
    },
    {
      name: "Works",
      description: "Obras",
    },
    {
      name: "Characters",
      description: "Personagens",
    },
    {
      name: "Ships",
      description: "Ships",
    },
    {
      name: "Votes",
      description: "Votos",
    },
    {
      name: "Admin",
      description: "Operações administrativas",
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

    schemas,
  },

  paths,
} as const;

export default swaggerDocument;