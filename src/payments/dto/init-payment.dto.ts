import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class InitPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  clientId;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount;
}
