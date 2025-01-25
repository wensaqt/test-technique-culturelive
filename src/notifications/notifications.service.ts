import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from '../rentals/entities/rental.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron('0 12 * * *') // tous les jours a 12h
  async checkRentalsForNotification() {
    const rentals = await this.rentalsRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.customer', 'customer')
      .where('rental.return_date > :now', { now: new Date() })
      .getMany();

    for (const rental of rentals) {
      const daysUntilReturn = this.calculateDaysUntilReturn(rental.return_date);

      if (daysUntilReturn === 5 || daysUntilReturn === 3) {
        this.sendNotification(rental);
      }
    }
  }

  private calculateDaysUntilReturn(returnDate: Date): number {
    const now = new Date();
    const diff = returnDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private sendNotification(rental: Rental) {
    // simulation d'envoi mail via log
    this.logger.log(
      `Notification envoyée à ${rental.customer.email} pour la location #${rental.rental_id}`,
    );
  }

  async manuallyTriggerNotifications() {
    await this.checkRentalsForNotification();
    return { message: 'Notifications manually triggered' };
  }

  getJobStatus(jobName: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      return {
        jobName,
        lastExecution: job.lastDate(),
        nextExecution: job.nextDate(),
        running: job.running,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { jobName, error: 'Job not found' };
    }
  }
}
