# Guia de Testes de Autorização - JWT Auth Service

## ⚠️ Fluxo Correto para Testar Roles

### Problema Comum
Se você receber **403 Forbidden** ao testar `/admin` mesmo com o token do usuário que "deveria ser ADMIN", é porque:
- O usuário foi registrado como `role: USER` (padrão)
- Você fez login **antes** de alterar o role no Prisma Studio
- O token JWT contém `role: "USER"` no payload
- O `RolesGuard` rejeita a requisição (403)

### Solução
**O role do usuário DEVE ser alterado ANTES do login para que o token contenha o role correto.**

---

## 🔄 Passo a Passo Correto

### 1️⃣ Registrar Usuários

**Requisição 9.1 - Registrar USER:**
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "usuario.user@example.com",
  "password": "123456",
  "name": "Usuário Padrão"
}
```
✅ Resposta: `201 Created`

**Requisição 9.2 - Registrar ADMIN (inicialmente como USER):**
```http
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "usuario.admin@example.com",
  "password": "654321",
  "name": "Usuário Para Admin"
}
```
✅ Resposta: `201 Created`

---

### 2️⃣ ⚠️ ALTERAR ROLE NO BANCO ANTES DO LOGIN

**Execute no terminal:**
```bash
npx prisma studio
```

**Na interface Prisma Studio:**
1. Clique na tabela `User`
2. Localize a linha com email `usuario.admin@example.com`
3. Clique no campo `role` e altere de `USER` para `ADMIN`
4. Salve (geralmente há um botão salvar ou auto-save)
5. Feche o Studio (CTRL+C no terminal)

✅ **Agora o usuário tem role `ADMIN` no banco de dados**

---

### 3️⃣ Fazer Login dos Dois Usuários

**Requisição 9.3 - Login do USER:**
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "usuario.user@example.com",
  "password": "123456"
}
```
✅ Resposta: `200 OK` com `access_token`
- **Copie este token para `<TOKEN_DO_USER>`**
- Decodifique em [jwt.io](https://jwt.io) para confirmar: `"role": "USER"`

**Requisição 9.4 - Login do ADMIN:**
```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "usuario.admin@example.com",
  "password": "654321"
}
```
✅ Resposta: `200 OK` com `access_token`
- **Copie este token para `<TOKEN_DO_ADMIN>`**
- Decodifique em [jwt.io](https://jwt.io) para confirmar: `"role": "ADMIN"`

---

### 4️⃣ Testar Autorização

**Requisição 9.5 - Testar /admin com TOKEN do USER:**
```http
GET http://localhost:3000/admin
Authorization: Bearer <TOKEN_DO_USER>
```
❌ Resposta esperada: **403 Forbidden**
```json
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}
```

**Requisição 9.6 - Testar /admin com TOKEN do ADMIN:**
```http
GET http://localhost:3000/admin
Authorization: Bearer <TOKEN_DO_ADMIN>
```
✅ Resposta esperada: **200 OK**
```json
{
  "message": "Bem-vindo, Admin!",
  "user": {
    "id": 2,
    "email": "usuario.admin@example.com",
    "name": "Usuário Para Admin",
    "role": "ADMIN"
  }
}
```

---

## 🔍 Verificação Rápida: Decodificar JWT

Para visualizar o conteúdo do token JWT:

1. Copie o `access_token` retornado no login
2. Acesse [jwt.io](https://jwt.io)
3. Cole o token na seção **"Encoded"**
4. Veja o payload no lado **"Decoded"**

Você deve ver algo como:
```json
{
  "sub": 1,
  "email": "usuario.user@example.com",
  "role": "USER",
  "iat": 1762033982,
  "exp": 1762037582
}
```

---

## 📋 Checklist de Testes

- [ ] Registrar usuário USER (9.1)
- [ ] Registrar usuário ADMIN (9.2)
- [ ] ⚠️ **Alterar role para ADMIN no Prisma Studio (9.2.1)**
- [ ] Login USER (9.3) → Copiar token
- [ ] Verificar perfil USER (9.3.1) → Confirmar `role: "USER"`
- [ ] Login ADMIN (9.4) → Copiar token
- [ ] Verificar perfil ADMIN (9.4.1) → Confirmar `role: "ADMIN"`
- [ ] Testar /admin com token USER (9.5) → Esperar 403 ✅
- [ ] Testar /admin com token ADMIN (9.6) → Esperar 200 ✅
- [ ] (Opcional) Testar /admin/users (9.7) → Esperar 200 ✅

---

## 🆘 Troubleshooting

| Erro | Causa | Solução |
|------|-------|--------|
| **403 Forbidden** em /admin | Token com `role: "USER"` | Altere no Studio ANTES de login |
| **404 Not Found** | Rota /admin não existe | Verifique se AdminController está registrado em AppModule |
| **401 Unauthorized** | Token inválido/expirado | Refaça login (tokens expiram em ~1h) |
| **500 Internal Server Error** | Erro no servidor | Verifique logs do servidor (npm run start:dev) |

---

## 📚 Documentação Relacionada

- [roles-authorization.md](./docs/roles-authorization.md) - Implementação de roles
- [test-api-authorization.http](./test-api-authorization.http) - Requisições HTTP para testes
- [execute-project.md](./docs/execute-project.md) - Como executar o projeto
