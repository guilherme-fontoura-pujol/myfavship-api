export const worksPaths = {
  "/api/public/works": {
    get: {
      tags: ["Works"],
      summary: "Listar obras",
      description: "Retorna todas as obras cadastradas.",
      responses: {
        "200": {
          description: "Lista de obras",
        },
      },
    },
  },

  "/api/public/works/{slug}": {
    get: {
      tags: ["Works"],
      summary: "Obter página pública de uma obra",
      description:
        "Retorna informações da obra, personagens disponíveis, estatísticas e os ships mais votados.",
      parameters: [
        {
          name: "slug",
          in: "path",
          required: true,
          description: "Slug da obra",
          schema: {
            type: "string",
          },
          example: "naruto",
        },
      ],
      responses: {
        "200": {
          description: "Dados públicos da obra",
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

  "/api/admin/works": {
    get: {
      tags: ["Works"],
      summary: "Listar obras na área administrativa",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "Lista administrativa de obras",
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
        "403": {
          description: "Acesso permitido apenas para administradores",
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

    post: {
      tags: ["Works"],
      summary: "Cadastrar uma obra",
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
              required: ["title", "categoryId"],
              properties: {
                title: {
                  type: "string",
                  minLength: 2,
                  example: "Dragon Ball",
                },
                description: {
                  type: "string",
                  example: "Anime de artes marciais e aventuras.",
                },
                categoryId: {
                  type: "string",
                  format: "uuid",
                },
                coverImageUrl: {
                  type: "string",
                  nullable: true,
                  example: "/uploads/works/dragon-ball.jpg",
                },
                releaseYear: {
                  type: "integer",
                  nullable: true,
                  example: 1986,
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Obra cadastrada com sucesso",
        },
        "400": {
          description: "Dados inválidos",
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
        },
        "403": {
          description: "Usuário não possui permissão de administrador",
        },
        "404": {
          description: "Categoria não encontrada",
        },
      },
    },
  },

  "/api/admin/works/{id}": {
    get: {
      tags: ["Works"],
      summary: "Buscar obra por ID na área administrativa",
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
          description: "ID da obra",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "200": {
          description: "Obra encontrada",
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

    put: {
      tags: ["Works"],
      summary: "Atualizar uma obra",
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
          description: "ID da obra",
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
                title: {
                  type: "string",
                  minLength: 2,
                  example: "Dragon Ball Z",
                },
                description: {
                  type: "string",
                },
                categoryId: {
                  type: "string",
                  format: "uuid",
                },
                coverImageUrl: {
                  type: "string",
                  nullable: true,
                },
                releaseYear: {
                  type: "integer",
                  nullable: true,
                  example: 1989,
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Obra atualizada com sucesso",
        },
        "400": {
          description: "Dados inválidos",
        },
        "404": {
          description: "Obra ou categoria não encontrada",
        },
      },
    },

    delete: {
      tags: ["Works"],
      summary: "Excluir uma obra",
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
          description: "ID da obra",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      ],
      responses: {
        "204": {
          description: "Obra excluída com sucesso",
        },
        "404": {
          description: "Obra não encontrada",
        },
      },
    },
  },

  "/api/admin/works/{id}/image": {
    patch: {
      tags: ["Works"],
      summary: "Enviar ou substituir a capa de uma obra",
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
          description: "ID da obra",
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
          description: "Capa atualizada com sucesso",
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
          description: "Obra não encontrada",
        },
      },
    },
  },
} as const;