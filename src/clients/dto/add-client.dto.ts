import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class AddClientDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  quota;
}
