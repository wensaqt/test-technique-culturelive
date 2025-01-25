import { IsNotEmpty, IsNumber, IsISO8601 } from 'class-validator';

export class CreateRentalDto {
  @IsNotEmpty()
  @IsISO8601()
  rental_date: string;

  @IsNotEmpty()
  @IsISO8601()
  return_date: string;

  @IsNotEmpty()
  @IsNumber()
  inventory_id: number;

  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @IsNotEmpty()
  @IsNumber()
  staff_id: number;
}
