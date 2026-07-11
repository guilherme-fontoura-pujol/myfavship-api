export const searchPaths = {
  "/api/public/search": {
    get: {
      tags: ["Search"],
      summary: "Pesquisar obras, personagens e ships",
      parameters: [
        {
          name: "q",
          in: "query",
          required: true,
          description: "Termo pesquisado",
          schema: {
            type: "string",
            minLength: 2,
          },
          example: "naruto",
        },
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Limite de resultados por grupo",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 20,
            default: 5,
          },
        },
      ],
      responses: {
        "200": {
          description: "Resultados da pesquisa",
        },
        "400": {
          description: "Termo de pesquisa inválido",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
} as const;