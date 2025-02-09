import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Quotas } from '@prisma/client';
import { SetQuotaDto } from './dto/set-quota.dto';

@Injectable()
export class QuotasService {
  constructor(private prisma: PrismaService) {}
  async setQuota(quota: SetQuotaDto) {
    return this.prisma.quotas.create({
      data: quota,
    });
  }
  async getActiveQuota(): Promise<Quotas> {
    const [activeQuota] = (await this.prisma
      .$queryRaw`SELECT * FROM "Quotas" q WHERE q.id > 0 ORDER BY q."createdAt" DESC`) as Quotas[];
    return activeQuota;
  }
  async getQuotaHistory() {
    const activeQuota = await this.getActiveQuota();
    const quotaHistory = await this.prisma.quotas.findMany({
      select: {
        quotaTypeA: true,
        quotaTypeB: true,
        blockingPercent: true,
      },
      where: {
        id: {
          not: activeQuota.id,
        },
      },
    });
    return {
      activeQuota,
      history: quotaHistory,
    };
  }
}
