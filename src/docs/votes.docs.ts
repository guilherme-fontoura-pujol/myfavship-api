export const votesPaths = {
  "/api/public/votes": {
    post: {
      tags: ["Votes"],
      summary: "Votar em um ship",
      description:
        "Registra o voto do usuário em uma combinação de dois personagens. Se o ship ainda não existir, ele será criado automaticamente.",
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["workId", "characterIds"],
              properties: {
                workId: {
                  type: "string",
                  format: "uuid",
                  description: "ID da obra",
                },
                characterIds: {
                  type: "array",
                  minItems: 2,
                  maxItems: 2,
                  uniqueItems: true,
                  description:
                    "IDs dos dois personagens escolhidos para formar o ship",
                  items: {
                    type: "string",
                    format: "uuid",
                  },
                  example: [
                    "7935f807-4eca-40b3-a374-9f38d85b7b0f",
                    "a74557fc-e7de-43fd-a253-e18167ff7259",
                  ],
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Voto registrado com sucesso",
        },
        "400": {
          description:
            "Personagens inválidos, repetidos, pertencentes a outra obra ou usuário já votou nessa obra",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        "401": {
          description: "Token não informado ou inválido",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        "404": {
          description: "Obra não encontrada",
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