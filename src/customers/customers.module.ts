import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { AddressesModule } from '../addresses/addresses.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    AddressesModule,
    StoresModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
