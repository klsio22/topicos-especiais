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
