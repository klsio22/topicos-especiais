# Como executar o projeto — minha-api-jw-t

Este documento descreve, de forma prática e direta, como rodar a API localmente para desenvolvimento e testes. Inclui pré-requisitos, passos para levantar o banco (Docker), gerar o cliente Prisma, aplicar migrations, iniciar a API e testar endpoints.

## Pré-requisitos

- Node.js (recomendado >= 18) e npm instalados
- Docker e Docker Compose instalados (se for usar o MySQL via compose)
- Git (opcional)

## Estrutura relevante do projeto

- `src/` — código fonte (NestJS)
- `prisma/schema.prisma` — esquema do banco (model `User`)
- `generated/prisma` — cliente Prisma gerado (pasta já incluída no repositório)
- `.env` — contém `DATABASE_URL` (ex.: `mysql://root:root@localhost:3306/atividade11jwtdb`)
- `docker-compose.yml` — serviço `db` (MySQL 8) para rodar localmente
- `test-api-users.http` — coleção de requisições para testar os endpoints (REST Client)

---

## 1) Preparar variáveis de ambiente

O projeto lê `DATABASE_URL` do arquivo `.env` na raiz. O repositório já contém um `.env` com um exemplo apontando para MySQL local:

```
DATABASE_URL="mysql://root:root@localhost:3306/atividade11jwtdb"
```

Se quiser usar outro banco/credenciais, atualize essa linha.

> Observação: o Prisma CLI carrega o `.env` via `prisma.config.ts` (o projeto já importa `dotenv/config`).

---

## 2) Subir o banco com Docker Compose (recomendado)

Na raiz do projeto, execute:

```bash
docker compose up -d
# ou (caso seu Docker use o binário antigo):
# docker-compose up -d
```

O `docker-compose.yml` do projeto define um serviço `db` (MySQL 8) que mapeia a porta 3306.

Verifique se o container está saudável:

```bash
docker compose ps
docker compose logs -f db --tail 50
```

Se já existir um container com o mesmo nome, use `docker ps -a --filter name=prisma_mysql` para ver o estado e, se necessário, remova/renomeie com `docker rm -f <nome>`.

---

## 3) Gerar Prisma Client

Gere o client (gera/atualiza `generated/prisma`):

```bash
npx prisma generate
```

Você deverá ver uma mensagem indicando que o Prisma Client foi gerado com sucesso.

---

## 4) Aplicar migrations

Aplique as migrations para criar as tabelas (use o nome que preferir):

```bash
npx prisma migrate dev --name init_users
```

Se receber erro P1001 (Can't reach database server), verifique:

- O container MySQL está realmente rodando e saudável (veja logs e `docker compose ps`).
- A porta 3306 está livre e mapeada corretamente.
- Se preferir forçar a URL via linha de comando (caso o `.env` não esteja sendo lido):

```bash
DATABASE_URL="mysql://root:root@localhost:3306/atividade11jwtdb" npx prisma migrate dev --name init_users
```

---

## 5) Abrir Prisma Studio (opcional)

Para inspecionar dados via interface web:

```bash
npx prisma studio
```

Por padrão abre `http://localhost:5555`.

---

## 6) Iniciar a aplicação (modo desenvolvimento)

Com o banco pronto, inicie a API em modo watch:

```bash
npm run start:dev
```

A API deverá subir em `http://localhost:3000`. Nos logs do Nest você verá as rotas mapeadas, por exemplo:

- POST /auth/register
- POST /auth/login
- GET /auth/perfil

---

## 7) Testar endpoints

Você pode usar o arquivo `test-api-users.http` (extensão REST Client do VS Code) ou ferramentas como Postman/Insomnia.

Exemplos curl:

- Registrar usuário:

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"123456","name":"Usuário de Teste"}'
```

- Login:

```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"123456"}'
```

Resposta esperada do login: `200 OK` com JSON contendo `access_token`.

- Acesso à rota protegida sem token (deve retornar 401):

```bash
curl -i http://localhost:3000/auth/perfil
```

- Acesso à rota protegida com token:

```bash
curl -i http://localhost:3000/auth/perfil \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>"
```

Substitua `<SEU_TOKEN_AQUI>` pelo `access_token` retornado no login.

---

## 8) Comandos úteis durante desenvolvimento

- Checar tipos (typecheck):

```bash
npm run typecheck
```

- Rodar linter (com --fix):

```bash
npm run lint
```

- Rodar testes (jest):

```bash
npm test
# ou
npm run test:e2e
```



