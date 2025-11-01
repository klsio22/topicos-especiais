# 🚀 Guia Rápido: Testes de Autorização com Variáveis

## ⚡ O que mudou?

Agora o arquivo `test-api-authorization.http` usa **variáveis internas** para evitar cópia/cola manual de tokens. Você só precisa:

1. Executar os logins (9.3 e 9.4)
2. Copiar o `access_token` retornado
3. Atualizar as variáveis `@tokenUser` e `@tokenAdmin` no topo do arquivo

---

## 📋 Variáveis Disponíveis

```http
@baseUrl = http://localhost:3000           # URL base da API
@userEmail = usuario.user@example.com      # Email do usuário USER
@userPassword = 123456                     # Senha do usuário USER
@adminEmail = usuario.admin@example.com    # Email do usuário ADMIN
@adminPassword = 654321                    # Senha do usuário ADMIN
@tokenUser =                               # Token JWT do USER (preenchido após 9.3)
@tokenAdmin =                              # Token JWT do ADMIN (preenchido após 9.4)
```

---

## 🔄 Passo a Passo

### Passo 1: Registrar Usuários
Execute 9.1 e 9.2 sem modificações.

### Passo 2: Alterar Role no Prisma Studio
```bash
npx prisma studio
```
- Localize o usuário com email `usuario.admin@example.com`
- Altere `role` de `USER` para `ADMIN`
- Salve

### Passo 3: Login USER (9.3)
1. Clique em **"Send Request"** acima de 9.3
2. Veja a resposta com `"access_token": "eyJhbGc..."`
3. **Copie o token inteiro** (sem as aspas)
4. No topo do arquivo, na linha 12, substitua `@tokenUser = ` por:
   ```http
   @tokenUser = eyJhbGc...seu_token_aqui
   ```
5. Salve o arquivo (Ctrl+S)

### Passo 4: Verificar Perfil USER (9.3.1)
Clique em "Send Request". O token será inserido automaticamente! ✅

### Passo 5: Login ADMIN (9.4)
1. Clique em **"Send Request"** acima de 9.4
2. Veja a resposta com o `access_token`
3. **Copie o token inteiro**
4. No topo do arquivo, na linha 13, substitua `@tokenAdmin = ` por:
   ```http
   @tokenAdmin = eyJhbGc...seu_token_aqui_do_admin
   ```
5. Salve o arquivo (Ctrl+S)

### Passo 6: Verificar Perfil ADMIN (9.4.1)
Clique em "Send Request". O token será inserido automaticamente! ✅

### Passo 7: Testar /admin com USER (9.5)
Clique em "Send Request". Espere **403 Forbidden** ✅

### Passo 8: Testar /admin com ADMIN (9.6)
Clique em "Send Request". Espere **200 OK** ✅

### Passo 9: (Opcional) Testar /admin/users (9.7)
Clique em "Send Request". Espere **200 OK** ✅

---

## 💡 Exemplo Prático

**Antes (cópia/cola manual):**
```http
GET http://localhost:3000/admin
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidXN1YXJpby5hZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2MjAzNDgzMiwiZXhwIjoxNzYyMDM4NDMyfQ.Y2xFOQrZXtoM-5qhIoBU4uuzPiUJXOwiiZq4AWDo3pM
```

**Depois (com variáveis):**
```http
GET {{baseUrl}}/admin
Authorization: Bearer {{tokenAdmin}}
```

Muito melhor! 🎉

---

## 🎯 Checklist Final

- [ ] Arquivo `test-api-authorization.http` aberto no VS Code
- [ ] Extensão **REST Client** instalada ([clique aqui](vscode:extension/humao.rest-client))
- [ ] Servidor rodando: `npm run start:dev`
- [ ] Banco de dados disponível
- [ ] ✅ Executar 9.1 e 9.2 (registrar usuários)
- [ ] ✅ Alterar role no Prisma Studio
- [ ] ✅ Executar 9.3 (login USER) → Copiar token para `@tokenUser`
- [ ] ✅ Executar 9.3.1 (perfil USER)
- [ ] ✅ Executar 9.4 (login ADMIN) → Copiar token para `@tokenAdmin`
- [ ] ✅ Executar 9.4.1 (perfil ADMIN)
- [ ] ✅ Executar 9.5 (admin com USER → 403)
- [ ] ✅ Executar 9.6 (admin com ADMIN → 200)
- [ ] ✅ (Opcional) Executar 9.7 (admin/users com ADMIN → 200)

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Cannot find variable" | Certifique-se que atualizou `@tokenUser` ou `@tokenAdmin` com o token completo |
| Token vazio | Execute o login (9.3 ou 9.4) primeiro |
| 403 mesmo com ADMIN | Refaça o login (9.4) após alterar role no Studio |
| Extensão não funciona | Instale: **humao.rest-client** no VS Code |

---

## 📚 Documentação Relacionada

- [test-api-authorization.http](./test-api-authorization.http) - Arquivo com testes
- [GUIA_TESTES_AUTORIZACAO.md](./GUIA_TESTES_AUTORIZACAO.md) - Guia detalhado
- [roles-authorization.md](./docs/roles-authorization.md) - Implementação de roles
