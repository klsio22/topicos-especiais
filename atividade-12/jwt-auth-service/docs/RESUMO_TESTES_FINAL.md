# ✅ Testes de Autorização - Resumo Final

## 🎯 Objetivo
Testar autorização baseada em roles (USER vs ADMIN) usando JWT no NestJS.

---

## 📁 Arquivos Criados/Modificados

| Arquivo | Descrição |
|---------|-----------|
| `test-api-authorization.http` | ✅ **Agora com variáveis internas!** Requisições HTTP com suporte a tokens automáticos |
| `GUIA_TESTES_AUTORIZACAO.md` | Guia detalhado explicando o fluxo |
| `GUIA_VARIAVEIS_REST_CLIENT.md` | Tutorial de como usar as variáveis |

---

## 🚀 Como Usar Rápido

### 1️⃣ Abra o arquivo `test-api-authorization.http` no VS Code

### 2️⃣ Execute as requisições em ordem:

| # | Ação | Token? | Resultado Esperado |
|---|------|--------|-------------------|
| 9.1 | Registrar USER | ❌ | 201 Created |
| 9.2 | Registrar ADMIN-to-be | ❌ | 201 Created |
| 9.2.1 | Alterar role no Prisma Studio | ⚠️ Manual | Sem requisição HTTP |
| 9.3 | Login USER | ❌ | 200 OK + access_token → **Copie para `@tokenUser`** |
| 9.3.1 | Perfil USER | ✅ `{{tokenUser}}` | 200 OK, role=USER |
| 9.4 | Login ADMIN | ❌ | 200 OK + access_token → **Copie para `@tokenAdmin`** |
| 9.4.1 | Perfil ADMIN | ✅ `{{tokenAdmin}}` | 200 OK, role=ADMIN |
| 9.5 | GET /admin com USER | ✅ `{{tokenUser}}` | **403 Forbidden** |
| 9.6 | GET /admin com ADMIN | ✅ `{{tokenAdmin}}` | **200 OK** ✅ |
| 9.7 | GET /admin/users com ADMIN | ✅ `{{tokenAdmin}}` | 200 OK (opcional) |

---

## 📝 Como Copiar Tokens

### Quando você vê na resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Faça isto:
1. Selecione TODO o valor do token (começando com `eyJ...` até o final)
2. Copie (Ctrl+C)
3. Vá ao topo do arquivo, linha 12 ou 13
4. Cole o token após `@tokenUser = ` ou `@tokenAdmin = `
5. Salve o arquivo (Ctrl+S)

---

## 🔑 Variáveis Disponíveis

```http
# No topo do arquivo (linhas 6-13):

@baseUrl = http://localhost:3000
@userEmail = usuario.user@example.com
@userPassword = 123456
@adminEmail = usuario.admin@example.com
@adminPassword = 654321
@tokenUser =                    ← Preencha após login (9.3)
@tokenAdmin =                   ← Preencha após login (9.4)
```

### Como as variáveis são usadas:
```http
# Todas as requisições usam {{variableName}}:
POST {{baseUrl}}/auth/login              ← URL dinâmica
GET {{baseUrl}}/admin                    ← URL dinâmica
Authorization: Bearer {{tokenUser}}      ← Token dinâmico
Authorization: Bearer {{tokenAdmin}}     ← Token dinâmico
```

---

## ⚡ Atalhos REST Client (VS Code)

| Ação | Windows/Linux | Mac |
|------|---------------|-----|
| Send Request | Ctrl+Alt+R | Cmd+Alt+R |
| Send Request (anonymous) | Ctrl+Alt+R | Cmd+Alt+R |
| Rerun Last Request | Ctrl+Alt+L | Cmd+Alt+L |

---

## 🎬 Passo-a-Passo Visual

```
┌─────────────────────────────────────────────┐
│ 1. Abra test-api-authorization.http         │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 2. Execute 9.1 & 9.2 (registrar usuários)   │
│    Botão: "Send Request"                    │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 3. Abra terminal: npx prisma studio         │
│    Altere role do admin para ADMIN          │
│    Feche: Ctrl+C                            │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 4. Execute 9.3 (login USER)                 │
│    Copie access_token                       │
│    Cole em: @tokenUser = SEU_TOKEN          │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 5. Execute 9.3.1 (perfil USER)              │
│    Token será inserido automaticamente ✅    │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 6. Execute 9.4 (login ADMIN)                │
│    Copie access_token                       │
│    Cole em: @tokenAdmin = SEU_TOKEN         │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 7. Execute 9.4.1 (perfil ADMIN)             │
│    Token será inserido automaticamente ✅    │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 8. Execute 9.5 (GET /admin com USER)        │
│    Resultado: 403 Forbidden ✅              │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│ 9. Execute 9.6 (GET /admin com ADMIN)       │
│    Resultado: 200 OK ✅                     │
└─────────────────────────────────────────────┘
                      ↓
                    FIM! 🎉
```

---

## ✨ Benefícios das Variáveis

| Antes | Depois |
|-------|--------|
| ❌ Copiar/colar manual | ✅ Uma vez e reutiliza |
| ❌ Tokens envelhecendo | ✅ Sempre fresco |
| ❌ Erro de digitação | ✅ Sem erro |
| ❌ Confuso qual é qual | ✅ Nomes claros |

---

## 🆘 Se Algo der Errado

### 403 Forbidden em /admin (9.5 ou 9.6)
**Causa:** Token não tem role correto  
**Solução:** Refaça login (9.4) após alterar role no Prisma Studio

### "Cannot find variable"
**Causa:** Variável não preenchida ou nome errado  
**Solução:** Verifique se `@tokenUser` e `@tokenAdmin` têm valores

### 401 Unauthorized
**Causa:** Token expirado (padrão: 1 hora)  
**Solução:** Refaça login (9.3 ou 9.4)

### Extensão REST Client não funciona
**Solução:** Instale a extensão `humao.rest-client` no VS Code

---

## 📊 Evidências para Entrega

Capture screenshots de:
- ✅ 9.3 - Login USER com token retornado
- ✅ 9.5 - GET /admin com token USER → 403
- ✅ 9.4 - Login ADMIN com token retornado
- ✅ 9.6 - GET /admin com token ADMIN → 200

---

## 📚 Leitura Adicional

- [GUIA_VARIAVEIS_REST_CLIENT.md](./GUIA_VARIAVEIS_REST_CLIENT.md) - Tutorial completo de variáveis
- [GUIA_TESTES_AUTORIZACAO.md](./GUIA_TESTES_AUTORIZACAO.md) - Guia detalhado de testes
- [docs/roles-authorization.md](./docs/roles-authorization.md) - Implementação técnica
