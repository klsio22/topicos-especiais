# Testes Swagger — Endpoints Admin

Este documento descreve como testar os endpoints `admin` via Swagger UI e resume as mudanças aplicadas na tarefa de documentação e correção de lints.

## Endpoints expostos no Swagger
- `GET /admin` — endpoint de administração simples que retorna uma mensagem e o usuário autenticado (requer role `ADMIN`).
- `GET /admin/users` — retorna a lista de usuários (requer role `ADMIN`).

Ambos os endpoints estão protegidos por JWT (Bearer token). No Swagger, você deverá usar o botão "Authorize" e colar `Bearer <seu_token_aqui>` no campo.

## Como testar no Swagger UI
1. Inicie a aplicação (modo dev):

```bash
npm run start:dev
```

2. Abra o Swagger UI em:

```
http://localhost:3000/api
```

3. Faça login via `POST /auth/login` (ou use o fluxo do `test-api-authorization.http`) e copie o `access_token` retornado.

4. Clique em `Authorize` no Swagger (canto superior direito) e cole:

```
Bearer <access_token>
```

5. Teste `GET /admin` e `GET /admin/users`.

- Se o token pertence a um usuário com `role: "ADMIN"`, você verá respostas 200.
- Se o token for de um `USER`, deverá receber 403 Forbidden.
- Se não houver token ou for inválido, receberá 401 Unauthorized.

## Exemplos de respostas documentadas
- 200 OK — sucesso
- 401 Unauthorized — token ausente ou inválido
- 403 Forbidden — usuário não possui role ADMIN

## Mudanças realizadas nesta tarefa
1. Ajustes no Swagger docs e testes
   - Atualizei `src/admin/admin.controller.ts` para adicionar `@ApiBearerAuth`, `@ApiOperation` e múltiplos `@ApiResponse` (200/401/403) para os endpoints `GET /admin` e `GET /admin/users`.
   - Isso torna os endpoints claros no Swagger UI e documenta os cenários de erro comuns.

2. Tratamento de avisos do ESLint/@typescript-eslint
   - Criei aliases tipados para os decorators Swagger no `AuthController` (ex.: `SafeApiOperation`, `SafeApiResponse`, `SafeApiBody`, `SafeApiBearerAuth`) para evitar `no-unsafe-call` sem usar casts `any` espalhados.
   - Ajustei `src/auth/jwt.strategy.ts` para um cast seguro ao usar `ExtractJwt.fromAuthHeaderAsBearerToken()` e adicionei uma supressão localizada antes de `super(...)` para remover o `no-unsafe-call` falso-positivo.
   - Em `src/main.ts` o bloco de inicialização do Swagger foi tratado para evitar falsos-positivos do linter (localized eslint disables quando necessário) e o `catch (err) { void err; }` foi simplificado para `catch {}`.

3. Editor / Prettier
   - Atualizei `/.vscode/settings.json` para `prettier.trailingComma: "all"` e desativei inserção automática de parênteses em sugestões (`typescript.suggest.completeFunctionCalls: false`) — isso melhora a experiência ao aceitar completions sem inserir `()` automaticamente.

4. Arquivo de testes REST Client
   - O arquivo `test-api-authorization.http` foi mantido/atualizado com instruções para registrar usuários, atribuir role ADMIN via Prisma Studio e testar os endpoints com tokens.

