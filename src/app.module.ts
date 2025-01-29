import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { AddressesModule } from './addresses/addresses.module';
import { StoresModule } from './stores/stores.module';
import { RentalsModule } from './rentals/rentals.module';
import { InventoryModule } from './inventory/inventory.module';
import { StaffModule } from './staff/staff.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'sakila',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    CustomersModule,
    AddressesModule,
    StoresModule,
    RentalsModule,
    InventoryModule,
    StaffModule,
    NotificationsModule,
  ],
})
export class AppModule {}
