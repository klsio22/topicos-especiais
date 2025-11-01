# Setup Completo — jwt-auth-service

Data: 1 de novembro de 2025

Guia passo-a-passo integrado para configurar e rodar o projeto `jwt-auth-service` com Docker, Prisma e NestJS.

---

## Visão geral

O projeto usa:
- **NestJS** — framework Node.js para a API
- **Prisma** — ORM para persistência (MySQL)
- **Docker Compose** — orquestração do MySQL local
- **JWT** — autenticação stateless
- **class-validator** — validação de DTOs

O setup completo envolve: (1) Docker MySQL, (2) Prisma Client e migrations, (3) iniciar a API.

---

## 1) Pré-requisitos

- **Node.js** >= 18 (recomendado 22.x)
- **npm** (geralmente vem com Node)
- **Docker** e **Docker Compose** instalados
- **Git** (opcional, para clonar)

Verificar:
```bash
node --version
npm --version
docker --version
docker compose --version
```

---

## 2) Estrutura do projeto

```
jwt-auth-service/
├── .env                      # DATABASE_URL (MySQL local)
├── .env.example              # (não exists ainda)
├── docker-compose.yml        # Serviço MySQL 8
├── package.json              # Dependências
├── prisma/
│   ├── schema.prisma         # Modelo User
│   └── migrations/           # Histórico de migrations
├── generated/prisma/         # Client gerado
├── src/
│   ├── auth/                 # AuthModule, DTOs, estratégia JWT
│   ├── prisma/               # PrismaService global
│   └── main.ts               # Bootstrap
├── test/                     # E2E tests
└── docs/
    ├── execucao.md           # Instruções de execução
    ├── implementation-summary.md  # Resumo da implementação
    └── setup-completo.md     # Este arquivo
```

---

## 3) Passo 1 — Clonar/navegar para o projeto

```bash
cd /media/klsio27/outher-files/documentos/utfpr/topicos-especiais/atividade-11/jwt-auth-service
pwd  # confirme a localização
```

---

## 4) Passo 2 — Configurar variáveis de ambiente

O projeto contém `.env` com `DATABASE_URL` apontando para MySQL local:

```bash
cat .env
# Deve exibir algo como:
# DATABASE_URL="mysql://root:root@localhost:3306/atividade11jwtdb"
```

Se não existir, crie:

```bash
cat > .env << 'EOF'
DATABASE_URL="mysql://root:root@localhost:3306/atividade11jwtdb"
EOF
```

---

## 5) Passo 3 — Subir o MySQL via Docker Compose

O arquivo `docker-compose.yml` define o serviço `db` (MySQL 8).

### 5.1) Iniciar containers

```bash
docker compose up -d
```

Saída esperada:
```
[+] Running 3/3
 ✔ Network jwt-auth-service_default   Created
 ✔ Volume "jwt-auth-service_db_data"  Created
 ✔ Container prisma_mysql_02          Started
```

### 5.2) Verificar status

```bash
docker compose ps
# Deve mostrar "prisma_mysql_02" com status "Up"

docker compose logs -f db --tail 20
# Aguarde uma mensagem como "ready for connections"
```

Se o container falhar, veja logs:
```bash
docker compose logs db
```

### 5.3) Aguardar MySQL ficar pronto

O MySQL pode levar alguns segundos para inicializar. Teste conexão:

```bash
# Via mysql-client (se instalado):
mysql -h 127.0.0.1 -P 3306 -u root -proot -e "SHOW DATABASES;"

# Ou confie nos logs (busque "ready for connections")
```

---

## 6) Passo 4 — Gerar Prisma Client

Com o MySQL pronto, gere o cliente do Prisma:

```bash
npx prisma generate
```

Saída esperada:
```
Prisma schema loaded from prisma/schema.prisma
✔ Generated Prisma Client (v6.18.0) to ./generated/prisma in 164ms
```

A pasta `generated/prisma` é atualizada com o cliente.

---

## 7) Passo 5 — Aplicar migrations

Crie as tabelas do banco (migrations):

```bash
npx prisma migrate dev --name init_users
```

Saída esperada:
```
Datasource "db": MySQL database "atividade11jwtdb" at "localhost:3306"

✔ Successfully created database
✔ Ran the following migration(s):
  20251026202523_init_users/
    → create `User` table

The following migration(s) have not yet been applied to the database:
```

Se der erro P1001 (Can't reach database), aguarde o MySQL ficar pronto (veja logs) e repita.

---

## 8) Passo 6 — Instalar dependências do projeto (se necessário)

```bash
npm install
```

(Normalmente já está pronto, mas execute se tiver alterado `package.json`)

---

## 9) Passo 7 — Iniciar a API

Inicie em modo desenvolvimento (watch mode):

```bash
npm run start:dev
```

Saída esperada (logs do Nest):
```
[Nest] 102280  - 01/Nov/2025, 12:00:00     LOG [NestFactory] Starting Nest application...
[Nest] 102280  - 01/Nov/2025, 12:00:01     LOG [InstanceLoader] PrismaModule dependencies initialized +20ms
[Nest] 102280  - 01/Nov/2025, 12:00:01     LOG [InstanceLoader] AuthModule dependencies initialized +1ms
[Nest] 102280  - 01/Nov/2025, 12:00:01     LOG [RoutesResolver] AuthController {/auth}:
[Nest] 102280  - 01/Nov/2025, 12:00:01     LOG [RouterExplorer] Mapped {/auth/register, POST} route +2ms
[Nest] 102280  - 01/Nov/2025, 12:00:01     LOG [RouterExplorer] Mapped {/auth/login, POST} route +0ms
[Nest] 102280  - 01/Nov/2025, 12:00:01     LOG [RouterExplorer] Mapped {/auth/perfil, GET} route +1ms
[Nest] 102280  - 01/Nov/2025, 12:00:01     LOG [NestApplication] Nest application successfully started +6ms
```

A API está rodando em `http://localhost:3000`.

---

## 10) Passo 8 — Testar a API

Em outro terminal (sem desligar o `npm run start:dev`):

### 10.1) Registrar usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste@example.com",
    "password":"123456",
    "name":"Usuário Teste"
  }'
```

Resposta esperada: `201 Created`
```json
{
  "id": 1,
  "email": "teste@example.com",
  "name": "Usuário Teste"
}
```

### 10.2) Fazer login

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste@example.com",
    "password":"123456"
  }' | jq .access_token
```

Saída: um token JWT longo (string).

### 10.3) Copiar token e acessar rota protegida

```bash
# Copie o token do passo anterior
TOKEN="<cola_o_token_aqui>"

curl -i -H "Authorization: Bearer $TOKEN" http://localhost:3000/auth/perfil
```

Resposta esperada: `200 OK`
```json
{
  "message": "Você acessou uma rota protegida!",
  "user": {
    "id": 1,
    "email": "teste@example.com",
    "name": "Usuário Teste"
  }
}
```

### 10.4) Testar rota protegida sem token (deve falhar)

```bash
curl -i http://localhost:3000/auth/perfil
```

Resposta esperada: `401 Unauthorized`

---

## 11) Passo 9 — Usar o arquivo .http (REST Client do VS Code)

Abra `test-api-users.http` no VS Code (se tiver extensão REST Client instalada):

1. Clique em "Send Request" acima da requisição de registro.
2. Copie o `access_token` da resposta de login.
3. Cole o token em `Authorization: Bearer <SEU_TOKEN_AQUI>` da rota protegida.
4. Clique em "Send Request" nas rotas protegidas.

---

## 12) Passo 10 — Prisma Studio (visualizar banco)

Para inspecionar dados via UI web:

```bash
npx prisma studio
```

Abre `http://localhost:5555` — você pode ver/criar/editar registros da tabela `User`.

---

## 13) Comandos úteis

| Comando | Descrição |
|---------|-----------|
| `docker compose up -d` | Subir MySQL |
| `docker compose down` | Derrubar MySQL (preserva dados em volume) |
| `docker compose logs -f db` | Ver logs do MySQL em tempo real |
| `npx prisma generate` | Regenerar Prisma Client |
| `npx prisma migrate dev` | Aplicar migrations (interativo) |
| `npx prisma studio` | Abrir interface web do banco |
| `npm run start:dev` | Iniciar API em watch mode |
| `npm run build` | Compilar TypeScript para `dist/` |
| `npm run start:prod` | Rodar build compilado |
| `npm run typecheck` | Verificar tipos com `tsc --noEmit` |
| `npm run lint` | Rodar ESLint com --fix |
| `npm test` | Rodar testes jest |
| `npm run test:e2e` | Rodar e2e tests |

---

## 14) Possíveis problemas e soluções

### Erro: `Can't reach database server at localhost:3306`
- **Causa**: MySQL não está rodando ou ainda não terminou de inicializar.
- **Solução**:
  - Verifique: `docker compose ps` (status deve ser "Up")
  - Aguarde logs: `docker compose logs -f db` (procure por "ready for connections")
  - Se necessário, reinicie: `docker compose restart db`

### Erro: `Missing required environment variable: DATABASE_URL`
- **Causa**: `.env` não existe ou não contém `DATABASE_URL`.
- **Solução**:
  - Confirme: `cat .env | grep DATABASE_URL`
  - Se vazio, crie manualmente ou confirme arquivo de configuração.

### Erro: `Cannot find module '../../generated/prisma'`
- **Causa**: Prisma Client não foi gerado.
- **Solução**: Execute `npx prisma generate` (ele já deve estar em `generated/prisma`).

### API roda mas endpoints retornam erro de banco
- **Causa**: Migrations não foram aplicadas.
- **Solução**: Execute `npx prisma migrate dev --name init_users`.

### Container com mesmo nome já existe
- **Causa**: Um container `prisma_mysql_02` anterior ainda existe.
- **Solução**:
  ```bash
  docker compose down -v  # remove containers e volumes
  docker compose up -d    # cria do zero
  ```

---

## 15) Fluxo rápido de inicialização (copiar/colar)

Se você já fez setup antes e só quer reiniciar rapidamente:

```bash
# 1) Ir para pasta
cd /media/klsio27/outher-files/documentos/utfpr/topicos-especiais/atividade-11/jwt-auth-service

# 2) Subir MySQL (se não estiver rodando)
docker compose up -d

# 3) Aguardar MySQL ficar pronto (~10-30s)
sleep 15

# 4) Aplicar migrations (idempotente)
npx prisma migrate deploy

# 5) Iniciar API
npm run start:dev
```

---

## 16) Deployment/Produção

Para colocar em produção (opcional):

```bash
# 1) Build
npm run build

# 2) Rodar build (com MySQL externo/configurado)
DATABASE_URL="<url-producao>" npm run start:prod
```

Certifique-se de usar um MySQL externo e seguro em produção.

---

## 17) Resumo visual

```
┌─────────────────────────────────────────────────────┐
│         Setup Completo — jwt-auth-service           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1) docker compose up -d          ← MySQL           │
│  2) npx prisma generate           ← Client          │
│  3) npx prisma migrate dev        ← Schema          │
│  4) npm run start:dev             ← API             │
│  5) curl http://localhost:3000/   ← Testar         │
│                                                     │
│  Opcional:                                          │
│  - npx prisma studio  (UI web)                     │
│  - npm run test:e2e   (testes)                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

Arquivo criado: `docs/setup-completo.md` — documentação integrada para Docker, Prisma e projeto.
