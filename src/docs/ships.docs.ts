export const shipsPaths = {
  "/api/public/ships": {
    get: {
      tags: ["Ships"],
      summary: "Listar ships",
      description: "Retorna os ships cadastrados com seus personagens e votos.",
      responses: {
        "200": {
          description: "Lista de ships",
        },
      },
    },
  },

  "/api/public/ships/preview": {
    get: {
      tags: ["Ships"],
      summary: "Pré-visualizar a combinação de dois personagens",
      description:
        "Verifica se a combinação já corresponde a um ship conhecido. Caso contrário, retorna os dois personagens selecionados.",
      parameters: [
        {
          name: "workId",
          in: "query",
          required: true,
          description: "ID da obra",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        {
          name: "character1",
          in: "query",
          required: true,
          description: "ID do primeiro personagem",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        {
          name: "character2",
          in: "query",
          required: true,
          description: "ID do segundo personagem",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "200": {
          description: "Pré-visualização da combinação",
        },
        "400": {
          description: "Personagens inválidos ou combinação incompleta",
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

  "/api/public/ships/{id}": {
    get: {
      tags: ["Ships"],
      summary: "Obter página pública de um ship",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID do ship",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "200": {
          description:
            "Dados do ship, personagens, aliases, votos e posição no ranking da obra",
        },
        "404": {
          description: "Ship não encontrado",
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

  "/api/admin/ships": {
    get: {
      tags: ["Ships"],
      summary: "Listar ships na área administrativa",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "Lista administrativa de ships",
        },
        "401": {
          description: "Token não informado ou inválido",
        },
        "403": {
          description: "Acesso permitido apenas para administradores",
        },
      },
    },
  },

  "/api/admin/ships/{id}": {
    get: {
      tags: ["Ships"],
      summary: "Buscar ship por ID na área administrativa",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
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
          description: "Ship encontrado",
        },
        "404": {
          description: "Ship não encontrado",
        },
      },
    },

    put: {
      tags: ["Ships"],
      summary: "Atualizar nome, imagem, estado conhecido e aliases do ship",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  minLength: 2,
                  nullable: true,
                  example: "NaruHina",
                },
                imageUrl: {
                  type: "string",
                  nullable: true,
                  example: "/uploads/ships/naruhina.jpg",
                },
                isKnown: {
                  type: "boolean",
                  example: true,
                },
                aliases: {
                  type: "array",
                  items: {
                    type: "string",
                    minLength: 2,
                  },
                  example: [
                    "Naruto x Hinata",
                    "Naruto e Hinata",
                  ],
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Ship atualizado com sucesso",
        },
        "400": {
          description: "Dados inválidos",
        },
        "404": {
          description: "Ship não encontrado",
        },
      },
    },

    delete: {
      tags: ["Ships"],
      summary: "Excluir ship",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "204": {
          description: "Ship excluído com sucesso",
        },
        "404": {
          description: "Ship não encontrado",
        },
      },
    },
  },

  "/api/admin/ships/{id}/image": {
    patch: {
      tags: ["Ships"],
      summary: "Enviar ou substituir a imagem oficial do ship",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["image"],
              properties: {
                image: {
                  type: "string",
                  format: "binary",
                  description: "Imagem JPG, PNG ou WEBP com até 5 MB",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Imagem do ship atualizada com sucesso",
        },
        "400": {
          description: "Imagem ausente, inválida ou acima do limite",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        "404": {
          description: "Ship não encontrado",
        },
      },
    },
  },
} as const;