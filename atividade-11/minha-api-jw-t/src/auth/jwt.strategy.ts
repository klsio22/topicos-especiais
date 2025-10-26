import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import type { User } from '../../generated/prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const extractor = ExtractJwt as unknown as {
      fromAuthHeaderAsBearerToken: () => (req: any) => string | null;
    };
    const jwtFromRequest = extractor.fromAuthHeaderAsBearerToken();

    // Some typings from passport-jwt / @nestjs/passport trigger a false-positive for
    // @typescript-eslint/no-unsafe-call when calling into the Passport helper. We
    // disable it for this call only.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'minha_chave_secreta',
    });
  }

  async validate(payload: { sub: number }) {
    const userId = payload.sub;
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado.');
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
    return safeUser;
  }
}
