export const charactersPaths = {
  "/api/public/characters": {
    get: {
      tags: ["Characters"],
      summary: "Listar personagens",
      description: "Retorna todos os personagens cadastrados.",
      responses: {
        "200": {
          description: "Lista de personagens",
        },
      },
    },
  },

  "/api/public/characters/{slug}": {
    get: {
      tags: ["Characters"],
      summary: "Obter página pública de um personagem",
      description:
        "Retorna os dados do personagem, sua obra, estatísticas e ships mais votados.",
      parameters: [
        {
          name: "slug",
          in: "path",
          required: true,
          description: "Slug do personagem",
          schema: {
            type: "string",
          },
          example: "naruto-uzumaki",
        },
        {
          name: "work",
          in: "query",
          required: true,
          description:
            "Slug da obra. É necessário porque personagens de obras diferentes podem possuir o mesmo slug.",
          schema: {
            type: "string",
          },
          example: "naruto",
        },
      ],
      responses: {
        "200": {
          description: "Dados públicos do personagem",
        },
        "404": {
          description: "Obra ou personagem não encontrado",
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

  "/api/admin/characters": {
    get: {
      tags: ["Characters"],
      summary: "Listar personagens na área administrativa",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        "200": {
          description: "Lista administrativa de personagens",
        },
        "401": {
          description: "Token não informado ou inválido",
        },
        "403": {
          description: "Acesso permitido apenas para administradores",
        },
      },
    },

    post: {
      tags: ["Characters"],
      summary: "Cadastrar personagem",
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
              required: ["name", "workId"],
              properties: {
                name: {
                  type: "string",
                  minLength: 2,
                  example: "Son Goku",
                },
                imageUrl: {
                  type: "string",
                  nullable: true,
                  example: "/uploads/characters/son-goku.jpg",
                },
                description: {
                  type: "string",
                  nullable: true,
                  example: "Protagonista de Dragon Ball.",
                },
                gender: {
                  type: "string",
                  enum: ["MALE", "FEMALE", "OTHER", "UNKNOWN"],
                  default: "UNKNOWN",
                },
                isPlayable: {
                  type: "boolean",
                  default: true,
                },
                workId: {
                  type: "string",
                  format: "uuid",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Personagem cadastrado com sucesso",
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
        "404": {
          description: "Obra não encontrada",
        },
      },
    },
  },

  "/api/admin/characters/{id}": {
    get: {
      tags: ["Characters"],
      summary: "Buscar personagem por ID",
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
          description: "Personagem encontrado",
        },
        "404": {
          description: "Personagem não encontrado",
        },
      },
    },

    put: {
      tags: ["Characters"],
      summary: "Atualizar personagem",
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
                },
                imageUrl: {
                  type: "string",
                  nullable: true,
                },
                description: {
                  type: "string",
                  nullable: true,
                },
                gender: {
                  type: "string",
                  enum: ["MALE", "FEMALE", "OTHER", "UNKNOWN"],
                },
                isPlayable: {
                  type: "boolean",
                },
                workId: {
                  type: "string",
                  format: "uuid",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Personagem atualizado com sucesso",
        },
        "400": {
          description: "Dados inválidos",
        },
        "404": {
          description: "Personagem ou obra não encontrado",
        },
      },
    },

    delete: {
      tags: ["Characters"],
      summary: "Excluir personagem",
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
          description: "Personagem excluído com sucesso",
        },
        "404": {
          description: "Personagem não encontrado",
        },
      },
    },
  },

  "/api/admin/characters/{id}/image": {
    patch: {
      tags: ["Characters"],
      summary: "Enviar ou substituir a imagem do personagem",
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
          description: "Imagem atualizada com sucesso",
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
          description: "Personagem não encontrado",
        },
      },
    },
  },
  "/api/public/characters/{slug}/stats": {
  get: {
    tags: ["Characters"],
    summary: "Obter estatísticas de um personagem",
    description:
      "Retorna quantidade de ships, votos, média de votos, ship mais popular e ranking completo dos ships do personagem.",
    parameters: [
      {
        name: "slug",
        in: "path",
        required: true,
        description: "Slug do personagem",
        schema: {
          type: "string",
        },
        example: "naruto-uzumaki",
      },
      {
        name: "work",
        in: "query",
        required: true,
        description:
          "Slug da obra à qual o personagem pertence.",
        schema: {
          type: "string",
        },
        example: "naruto",
      },
    ],
    responses: {
      "200": {
        description: "Estatísticas do personagem",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                character: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                    },
                    name: {
                      type: "string",
                      example: "Naruto Uzumaki",
                    },
                    slug: {
                      type: "string",
                      example: "naruto-uzumaki",
                    },
                    imageUrl: {
                      type: "string",
                      nullable: true,
                    },
                  },
                },

                work: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                    },
                    title: {
                      type: "string",
                      example: "Naruto",
                    },
                    slug: {
                      type: "string",
                      example: "naruto",
                    },
                  },
                },

                stats: {
                  type: "object",
                  properties: {
                    totalShips: {
                      type: "integer",
                      example: 4,
                    },
                    knownShips: {
                      type: "integer",
                      example: 2,
                    },
                    unknownShips: {
                      type: "integer",
                      example: 2,
                    },
                    totalVotes: {
                      type: "integer",
                      example: 12,
                    },
                    averageVotesPerShip: {
                      type: "number",
                      format: "float",
                      example: 3,
                    },
                    mostPopularShip: {
                      nullable: true,
                      allOf: [
                        {
                          $ref: "#/components/schemas/Ship",
                        },
                      ],
                    },
                  },
                },

                ships: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Ship",
                  },
                },
              },
            },
          },
        },
      },

      "404": {
        description: "Obra ou personagem não encontrado",
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