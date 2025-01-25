import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { Rental } from './entities/rental.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { StaffModule } from '../staff/staff.module';
import { CustomersModule } from '../customers/customers.module';
import { Customer } from '../customers/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental, Customer]),
    InventoryModule,
    StaffModule,
    CustomersModule,
  ],
  controllers: [RentalsController],
  providers: [RentalsService],
  exports: [TypeOrmModule],
})
export class RentalsModule {}
