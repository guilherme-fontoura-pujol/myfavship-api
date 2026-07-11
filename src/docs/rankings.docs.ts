export const rankingsPaths = {
  "/api/public/rankings/dashboard": {
    get: {
      tags: ["Rankings"],
      summary: "Obter dados do dashboard público",
      responses: {
        "200": {
          description:
            "Top ships, obras populares, obras mais diversas e estatísticas gerais",
        },
      },
    },
  },

  "/api/public/rankings/top-ships": {
    get: {
      tags: ["Rankings"],
      summary: "Listar os 10 ships mais votados",
      responses: {
        "200": {
          description: "Ranking global de ships",
        },
      },
    },
  },

  "/api/public/rankings/top-works": {
    get: {
      tags: ["Rankings"],
      summary: "Listar as obras com mais votos",
      responses: {
        "200": {
          description: "Ranking das obras mais votadas",
        },
      },
    },
  },

  "/api/public/rankings/most-diverse-works": {
    get: {
      tags: ["Rankings"],
      summary: "Listar as obras com mais ships diferentes",
      responses: {
        "200": {
          description: "Ranking das obras com maior diversidade de ships",
        },
      },
    },
  },

  "/api/public/rankings/works/{workId}": {
    get: {
      tags: ["Rankings"],
      summary: "Obter o ranking de ships de uma obra",
      parameters: [
        {
          name: "workId",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "200": {
          description: "Ranking de ships da obra",
        },
      },
    },
  },
} as const;