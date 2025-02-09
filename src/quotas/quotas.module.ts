import { Module } from '@nestjs/common';
import { QuotasController } from './quotas.controller';
import { QuotasService } from './quotas.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuotasController],
  providers: [QuotasService, PrismaService],
})
export class QuotasModule {}
