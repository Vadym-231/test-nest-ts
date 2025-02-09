import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuotasService } from './quotas.service';
import { SetQuotaDto } from './dto/set-quota.dto';

@Controller('quotas')
export class QuotasController {
  constructor(private quotas: QuotasService) {}

  @Get()
  getQuotasHistory() {
    return this.quotas.getQuotaHistory();
  }

  @Post()
  setQuota(@Body() quotaPayload: SetQuotaDto) {
    return this.quotas.setQuota(quotaPayload);
  }

  @Get('/active')
  getActiveQuota() {
    return this.quotas.getActiveQuota();
  }
}
