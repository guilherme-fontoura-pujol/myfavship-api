# MyFavShip API

API REST do **MyFavShip**, uma plataforma em que usuários escolhem dois personagens de uma obra ficcional e votam no seu ship favorito.

A aplicação registra os votos, cria automaticamente combinações ainda não cadastradas e gera rankings e estatísticas de ships, personagens e obras.

## Funcionalidades

- Cadastro e login de usuários
- Autenticação com JWT
- Controle de acesso entre usuários e administradores
- CRUD de categorias, obras, personagens e ships
- Um voto por usuário em cada obra
- Criação automática de ships durante a votação
- Preview de combinações antes da confirmação
- Nomes e aliases para ships conhecidos
- Rankings globais e por obra
- Dashboard público
- Pesquisa global
- Perfil do usuário com histórico de votos
- Estatísticas de personagens e obras
- Upload de imagens
- Slugs automáticos
- Validação de dados
- Documentação interativa com Swagger

## Tecnologias

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL Adapter
- JWT
- bcrypt
- Zod
- Multer
- Swagger/OpenAPI

## Arquitetura

O projeto utiliza uma arquitetura organizada em camadas:

```text
src/
├── config/
├── controllers/
├── docs/
├── dtos/
│   ├── requests/
│   └── responses/
├── mappers/
├── middlewares/
├── prisma/
├── routes/
│   ├── admin/
│   └── public/
├── services/
│   └── statistics/
├── utils/
├── validations/
├── app.ts
└── server.ts
```

As rotas são divididas em três grupos:

```text
/api/auth
/api/public
/api/admin
```

As rotas administrativas exigem autenticação e usuário com papel `ADMIN`.

## Pré-requisitos

Antes de executar o projeto, instale:

- Node.js
- PostgreSQL
- npm

## Instalação

Clone o repositório:

```bash
git clone https://github.com/guilherme-fontoura-pujol/myfavship-api.git
```

Entre na pasta:

```bash
cd myfavship-api
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Copie o arquivo de exemplo:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux ou macOS

```bash
cp .env.example .env
```

Configure o arquivo `.env`:

```env
PORT=3333

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

JWT_SECRET="replace-with-a-secure-secret"
```

Nunca envie o arquivo `.env` para o repositório.

## Banco de dados

Aplique as migrations:

```bash
npx prisma migrate deploy
```

Durante o desenvolvimento, também pode ser usado:

```bash
npx prisma migrate dev
```

Popule o banco com dados de demonstração:

```bash
npx prisma db seed
```

O seed cria usuários de demonstração:

```text
Administrador
E-mail: admin@myfavship.com
Senha: 123456

Usuário comum
E-mail: user@myfavship.com
Senha: 123456
```

Essas credenciais devem ser usadas somente em desenvolvimento e demonstração.

## Execução

Inicie em modo de desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3333
```

Para gerar o build:

```bash
npm run build
```

Para executar o build:

```bash
npm start
```

## Documentação da API

Com o servidor em execução, acesse:

```text
http://localhost:3333/docs
```

O Swagger permite visualizar e testar os endpoints.

Nas rotas protegidas, use o botão **Authorize** e informe o token JWT recebido no login.

## Principais endpoints

### Autenticação

```http
POST /api/auth/register
POST /api/auth/login
```

### Público

```http
GET  /api/public/rankings/dashboard
GET  /api/public/search
GET  /api/public/works
GET  /api/public/works/:slug
GET  /api/public/characters/:slug
GET  /api/public/ships/:id
GET  /api/public/ships/preview
POST /api/public/votes
GET  /api/public/profile/me
```

### Administração

```http
/api/admin/categories
/api/admin/works
/api/admin/characters
/api/admin/ships
/api/admin/uploads
```

A relação completa de rotas e parâmetros está disponível no Swagger.

## Regra principal de votação

Cada usuário pode registrar apenas um voto por obra.

Ao receber dois personagens, a API:

1. valida se são personagens diferentes;
2. verifica se pertencem à obra indicada;
3. verifica se estão disponíveis para votação;
4. procura uma combinação já existente;
5. cria o ship caso ele ainda não exista;
6. registra o voto.

A restrição também é garantida no banco de dados.

## Uploads

As imagens locais são armazenadas em:

```text
uploads/works
uploads/characters
uploads/ships
```

Durante o desenvolvimento, ficam disponíveis por URLs como:

```text
http://localhost:3333/uploads/characters/arquivo.jpg
```

Em hospedagens sem armazenamento persistente, os arquivos locais podem ser apagados quando a aplicação reiniciar. Para produção, recomenda-se utilizar um serviço externo de armazenamento de imagens.

## Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

## Status

Backend funcional e preparado para integração com o frontend do MyFavShip.

## Autor

Guilherme Fontoura Pujol