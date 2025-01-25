import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsNumber()
  store_id: number;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsNumber()
  address_id: number;

  @IsOptional()
  @IsBoolean()
  activebool?: boolean;

  @IsOptional()
  @IsNumber()
  active?: number;
}
