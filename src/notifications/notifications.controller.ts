import { Controller, Post, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('jobs')
  listJobs() {
    return this.notificationsService.listAllJobs();
  }

  @Post('trigger')
  triggerManually() {
    return this.notificationsService.manuallyTriggerNotifications();
  }

  @Get('jobs/:name')
  getJobStatus(@Param('name') name: string) {
    return this.notificationsService.getJobStatus(name);
  }
}
