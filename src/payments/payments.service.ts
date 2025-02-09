import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitPaymentDto } from './dto/init-payment.dto';
import { PaymentStatusRequestDto } from './dto/payment-status-request.dto';
import { Payment, PaymentStatus } from '@prisma/client';
import { QuotasService } from '../quotas/quotas.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private quotas: QuotasService,
    private clients: ClientsService,
  ) {}

  async initPayment(payment: InitPaymentDto) {
    const { id } = await this.prisma.payment.create({
      data: payment,
    });
    return { id };
  }

  async processPayment({ ids }: PaymentStatusRequestDto) {
    const { id: activeQuotaId, blockingPercent } =
      await this.quotas.getActiveQuota();
    const payments = await this._validatePaymentIds(
      ids,
      PaymentStatus.RECIEVED,
    );

    await Promise.all(
      payments.map(async ({ amount, id }) => {
        await this.prisma.payment.update({
          where: {
            id,
          },
          data: {
            blockedAmount: amount * (blockingPercent / 100),
            status: PaymentStatus.PROCESSED,
            quotaId: activeQuotaId,
            updatedAt: new Date(),
          },
        });
      }),
    );
    return ids;
  }

  async completePayment({ ids }: PaymentStatusRequestDto) {
    await this._validatePaymentIds(ids, PaymentStatus.PROCESSED);
    await this.prisma.payment.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        blockedAmount: 0,
        status: PaymentStatus.COMPLETED,
      },
    });
    return ids;
  }

  async closePayments(clientId: number) {
    const client = await this.clients.getClientById(clientId);
    if (!client) throw new BadRequestException('Shop is not found!');
    const payments = await this.prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        quotaId: true,
        clientId: true,
      },
      where: {
        clientId: Number(clientId),
        status: PaymentStatus.COMPLETED,
      },
    });
    
    // if we need to process failed payments we can use Promise.allSettled
    // as all in transaction will not lose money & payment will not move to done (PAYED) status;
    const precessedAmounted = await Promise.all(
      payments.map(
        ({ amount: paymentAmount, clientId, id: paymentId, quotaId }) =>
          this.prisma.$transaction(async (prisma) => {
            const { quotaTypeA, quotaTypeB } =
              await this.prisma.quotas.findFirstOrThrow({
                select: {
                  quotaTypeA: true,
                  quotaTypeB: true,
                },
                where: {
                  id: quotaId as number,
                },
              });
            const quotaTypeC = client.quotasPercent;
            const amountAfterTax =
              paymentAmount -
                (quotaTypeA +
                (paymentAmount * (quotaTypeB / 100)) +
                (paymentAmount * (quotaTypeC / 100)));
            await prisma.client.update({
              where: {
                id: clientId,
              },
              data: {
                balance: {
                  increment: amountAfterTax,
                },
              },
            });
            await prisma.payment.update({
              where: {
                id: paymentId,
              },
              data: {
                status: PaymentStatus.PAYED,
              },
            });
            return {
              amount: amountAfterTax,
              id: paymentId,
            };
          }),
      ),
    );

    const totalAmount = precessedAmounted.reduce(
      (totalAmount, { amount }) => totalAmount + amount,
      0,
    );
    return {
      total: totalAmount,
      payments: precessedAmounted,
    };
  }

  private async _validatePaymentIds(
    ids: number[],
    status: PaymentStatus,
  ): Promise<Pick<Payment, 'amount' | 'status' | 'id'>[]> {
    const payments = await this.prisma.payment.findMany({
      select: {
        amount: true,
        status: true,
        id: true,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
    const invalidPaymentsStatuses = payments.filter(
      ({ status: _status }) => _status !== status,
    );
    const invalidPaymentId = ids.filter(
      (id) => !payments.find((payment) => payment.id === id),
    );

    if (invalidPaymentsStatuses.length)
      throw new BadRequestException(
        `Impossible process payments: [${invalidPaymentsStatuses.map(({ id }) => id).join(',')}]`,
      );

    if (invalidPaymentId.length)
      throw new BadRequestException(
        `Payment(s) not found: [${invalidPaymentId.join(',')}]`,
      );

    return payments;
  }
}
