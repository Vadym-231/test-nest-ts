import { Module } from '@nestjs/common';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';
import { PrismaService } from './prisma/prisma.service';
import { QuotasService } from './quotas/quotas.service';
import { ClientsService } from './clients/clients.service';
import { QuotasModule } from './quotas/quotas.module';
import { ClientsModule } from './clients/clients.module';
import { PaymentsService } from './payments/payments.service';

@Module({
  imports: [PaymentsModule, QuotasModule, ClientsModule],
  controllers: [PaymentsController],
  providers: [PrismaService, QuotasService, ClientsService, PaymentsService],
})
export class AppModule {}
