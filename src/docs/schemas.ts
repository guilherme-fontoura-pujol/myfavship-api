export const schemas = {
  Error: {
    type: "object",
    properties: {
      error: {
        type: "string",
        example: "Erro interno do servidor.",
      },
    },
  },

  User: {
    type: "object",
    required: ["id", "name", "email", "role"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
      name: {
        type: "string",
        example: "Guilherme",
      },
      email: {
        type: "string",
        format: "email",
        example: "guilherme@email.com",
      },
      role: {
        type: "string",
        enum: ["USER", "ADMIN"],
      },
    },
  },

  AuthResponse: {
    type: "object",
    required: ["user", "token"],
    properties: {
      user: {
        $ref: "#/components/schemas/User",
      },
      token: {
        type: "string",
        example: "eyJhbGciOiJIUzI1NiIs...",
      },
    },
  },
  Ship: {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    name: {
      type: "string",
      example: "NaruHina",
    },
    imageUrl: {
      type: "string",
      nullable: true,
    },
    isKnown: {
      type: "boolean",
    },
    votes: {
      type: "integer",
      example: 8,
    },
    ranking: {
      type: "integer",
      nullable: true,
      example: 1,
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
        },
        slug: {
          type: "string",
        },
        coverImageUrl: {
          type: "string",
          nullable: true,
        },
        category: {
          type: "string",
        },
      },
    },
    characters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          name: {
            type: "string",
          },
          slug: {
            type: "string",
          },
          imageUrl: {
            type: "string",
            nullable: true,
          },
        },
      },
    },
    aliases: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
},
} as const;