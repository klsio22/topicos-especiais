# Sistema de Roles (Autorização) — jwt-auth-service

Data: 1 de novembro de 2025

Documentação da implementação do sistema de autorização baseado em roles (papéis/funções) na API `jwt-auth-service`.

---

## Resumo da implementação

O projeto agora suporta autorização baseada em roles. Usuários podem ter dois papéis:
- **USER** — papel padrão, acesso limitado
- **ADMIN** — acesso total, incluindo rotas administrativas

Quando um usuário faz login, o rol é incluído no JWT. Guards validam o rol ao acessar rotas protegidas.

---

## Arquivos criados/alterados

### 1. `prisma/schema.prisma`
Adicionado enum `Role` e campo `role` ao modelo `User`:

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)    // novo campo
  createdAt DateTime @default(now())
}
```

Migration executada: `20251101180445_add_roles` — adiciona coluna `role` ao banco.

### 2. `src/auth/roles.decorator.ts` (novo)
Decorator que marca rotas com roles necessários:

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

Uso: `@Roles('ADMIN')` em um método de controller.

### 3. `src/auth/roles.guard.ts` (novo)
Guard que valida o role do usuário:

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;  // sem @Roles = acesso livre (autenticado)

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found');
    }

    if (!requiredRoles.some((role) => user.role === role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

Lógica: se uma rota tem `@Roles('ADMIN')` e o usuário tem role `USER`, retorna 403 Forbidden.

### 4. `src/auth/auth.service.ts` (atualizado)
Método `login()` agora inclui `role` no payload JWT:

```typescript
const payload = { sub: user.id, email: user.email, role: user.role };
const access_token = await this.jwtService.signAsync(payload);
```

### 5. `src/auth/jwt.strategy.ts` (atualizado)
Método `validate()` agora captura `role` do JWT:

```typescript
async validate(payload: { sub: number; email: string; role: string }) {
  // ... valida usuário
  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,    // novo
    createdAt: user.createdAt,
  };
  return safeUser;
}
```

### 6. `src/admin/admin.controller.ts` (novo)
Controller com rotas administrativas protegidas:

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get()
  @Roles('ADMIN')
  getAdminData(@Req() req: Request & { user?: {...} }) {
    return {
      message: 'Bem-vindo, Admin!',
      user: req.user,
    };
  }

  @Get('users')
  @Roles('ADMIN')
  getUsers() {
    return { message: 'Lista de usuários (apenas para ADMINs)', users: [] };
  }
}
```

### 7. `src/admin/admin.module.ts` (novo)
Módulo que exporta AdminController.

### 8. `src/app.module.ts` (atualizado)
Registra AdminModule:

```typescript
@Module({
  imports: [PrismaModule, AuthModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## Fluxo de uso

### Cenário 1: Usuário com role USER tentando acessar /admin

1. Usuário registra em POST /auth/register (recebe role `USER` por padrão).
2. Faz login em POST /auth/login com as credenciais.
3. Recebe JWT com payload: `{ sub: 1, email: "...", role: "USER" }`.
4. Tenta GET /admin com header `Authorization: Bearer <token>`.
5. Resultado: **403 Forbidden** — "Insufficient permissions".

### Cenário 2: Usuário com role ADMIN acessando /admin

1. Um usuário foi criado e seu role alterado para `ADMIN` (via Prisma Studio).
2. Faz login e recebe JWT com: `{ sub: 2, email: "...", role: "ADMIN" }`.
3. Tenta GET /admin com header `Authorization: Bearer <token>`.
4. Resultado: **200 OK** — retorna dados com mensagem "Bem-vindo, Admin!" e user object.

---

## Como testar

### Passo 1: Criar usuários de teste

**Registrar user normal:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456","name":"Usuário Normal"}'
```

Resultado: 201 Created, role = `USER` (padrão).

**Criar ADMIN via Prisma Studio:**
```bash
npx prisma studio
```
- Abra http://localhost:5555
- Edite o registro do usuário normal ou crie novo
- Altere campo `role` para `ADMIN`
- Salve

### Passo 2: Fazer login com USER

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

Copie o `access_token`.

### Passo 3: Tentar acessar /admin (deve falhar)

```bash
USER_TOKEN="<copie_aqui>"
curl -i -H "Authorization: Bearer $USER_TOKEN" http://localhost:3000/admin
```

**Resposta esperada: 403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

### Passo 4: Fazer login com ADMIN

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

Copie o `access_token`.

### Passo 5: Acessar /admin (deve passar)

```bash
ADMIN_TOKEN="<copie_aqui>"
curl -i -H "Authorization: Bearer $ADMIN_TOKEN" http://localhost:3000/admin
```

**Resposta esperada: 200 OK**
```json
{
  "message": "Bem-vindo, Admin!",
  "user": {
    "id": 2,
    "email": "admin@example.com",
    "name": "Usuário Admin",
    "role": "ADMIN",
    "createdAt": "2025-11-01T15:00:00Z"
  }
}
```

---

## Desafio extra (opcional)

Crie uma rota que apenas USERs podem acessar (ADMINs não):

```typescript
@Get('user-only')
@Roles('USER')
getUserOnly(@Req() req: any) {
  return { message: 'Apenas USERs conseguem acessar aqui', user: req.user };
}
```

Teste:
- Com token USER: **200 OK**
- Com token ADMIN: **403 Forbidden**

---

## Comportamento de guards em cascata

Quando você usar múltiplos guards em uma rota:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Get()
@Roles('ADMIN')
method() { ... }
```

1. **JwtAuthGuard** — verifica se token é válido; se não, retorna **401 Unauthorized**.
2. **RolesGuard** — verifica se role está em `@Roles(...)`; se não, retorna **403 Forbidden**.

---

## Observações

- Por padrão (sem `@Roles` na rota), uma rota protegida com `JwtAuthGuard` é acessível por qualquer usuário autenticado, independentemente do role.
- ADMINs não herdam privilégios de USERs automaticamente (cada role deve ser validado especificamente).
- O campo `role` no banco é uma enum, garantindo apenas valores válidos (`USER` ou `ADMIN`).

---

Implementação completa do sistema de autorização baseado em roles.
