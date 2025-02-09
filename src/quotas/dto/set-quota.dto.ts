import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class SetQuotaDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quotaTypeA: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  quotaTypeB: number;

  // blocking D;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  blockingPercent: number;
}
