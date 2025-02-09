import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { QuotasService } from '../quotas/quotas.service';
import { ClientsService } from '../clients/clients.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, QuotasService, ClientsService],
})
export class PaymentsModule {}
