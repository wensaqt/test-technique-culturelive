import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { Rental } from '../rentals/entities/rental.entity';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Rental])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
