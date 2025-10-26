import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { join } from 'node:path';
import type { PrismaClient as GeneratedPrismaClient } from '../../generated/prisma';

// Dynamically require the generated client from the project root. We cast via
// `unknown` to avoid `any` flowing into the rest of the file and to satisfy
// the stricter @typescript-eslint rules.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PrismaPkg = require(
  join(process.cwd(), 'generated', 'prisma'),
) as unknown as {
  PrismaClient: new (...args: any[]) => GeneratedPrismaClient;
};
const PrismaClientRuntime =
  PrismaPkg.PrismaClient as unknown as new () => GeneratedPrismaClient;

@Injectable()
export class PrismaService
  extends (PrismaClientRuntime as unknown as new () => GeneratedPrismaClient)
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
