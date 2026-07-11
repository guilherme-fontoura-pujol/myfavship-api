export const authPaths = {
  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Cadastrar usuário",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: {
                  type: "string",
                  minLength: 3,
                  example: "Guilherme",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "guilherme@email.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  minLength: 6,
                  example: "123456",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Usuário cadastrado com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "400": {
          description: "Dados inválidos ou e-mail já cadastrado",
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

  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Autenticar usuário",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "admin@myfavship.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "123456",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login realizado com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AuthResponse",
              },
            },
          },
        },
        "401": {
          description: "E-mail ou senha inválidos",
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