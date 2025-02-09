import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { InitPaymentDto } from './dto/init-payment.dto';
import { PaymentsService } from './payments.service';
import { PaymentStatusRequestDto } from './dto/payment-status-request.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post()
  initPayment(@Body() body: InitPaymentDto) {
    return this.payments.initPayment(body);
  }

  @Patch('/process')
  processPayment(@Body() body: PaymentStatusRequestDto) {
    return this.payments.processPayment(body);
  }

  @Patch('/complete')
  completePayment(@Body() body: PaymentStatusRequestDto) {
    return this.payments.completePayment(body);
  }

  @Patch('/:clientId/close')
  closeAllPayments(@Param('clientId') clientId) {
    return this.payments.closePayments(clientId);
  }
}
