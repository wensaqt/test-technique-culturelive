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

  @Cron('0 12 * * *', {
    name: 'fiveDaysNotification',
  })
  async checkFiveDaysNotifications() {
    const rentals = await this.rentalsRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.customer', 'customer')
      .where('rental.return_date > :now', { now: new Date() })
      .getMany();

    for (const rental of rentals) {
      const daysUntilReturn = this.calculateDaysUntilReturn(rental.return_date);

      if (daysUntilReturn === 5) {
        this.sendNotification(rental, 5);
      }
    }
  }

  @Cron('0 12 * * *', {
    name: 'threeDaysNotification',
  })
  async checkThreeDaysNotifications() {
    const rentals = await this.rentalsRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.customer', 'customer')
      .where('rental.return_date > :now', { now: new Date() })
      .getMany();

    for (const rental of rentals) {
      const daysUntilReturn = this.calculateDaysUntilReturn(rental.return_date);

      if (daysUntilReturn === 3) {
        this.sendNotification(rental, 3);
      }
    }
  }

  private calculateDaysUntilReturn(returnDate: Date): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const return_date = new Date(returnDate);
    return_date.setHours(0, 0, 0, 0);

    const diff = return_date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private sendNotification(rental: Rental, daysRemaining: number) {
    this.logger.log(
      `Notification J-${daysRemaining} envoyée à ${rental.customer.email} pour la location #${rental.rental_id}`,
    );
  }

  async manuallyTriggerNotifications() {
    await this.checkFiveDaysNotifications();
    await this.checkThreeDaysNotifications();
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

  async listAllJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const jobsList = [];

    const rentals = await this.rentalsRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.customer', 'customer')
      .leftJoinAndSelect('rental.inventory', 'inventory')
      .leftJoinAndSelect('inventory.film', 'film')
      .where('rental.return_date > :now', { now: new Date() })
      .getMany();

    this.logger.debug(`Found ${rentals.length} active rentals`);

    const upcomingNotifications = rentals.map((rental) => {
      const daysUntilReturn = this.calculateDaysUntilReturn(rental.return_date);
      this.logger.debug(
        `Rental #${rental.rental_id} has ${daysUntilReturn} days until return`,
      );

      return {
        rental_id: rental.rental_id,
        customer_name: `${rental.customer.first_name} ${rental.customer.last_name}`,
        film_title: rental.inventory.film.title,
        return_date: rental.return_date,
        days_remaining: daysUntilReturn,
        will_notify: daysUntilReturn === 5 || daysUntilReturn === 3,
      };
    });

    jobs.forEach((value, key) => {
      const notifications = upcomingNotifications.filter(
        (n) =>
          (key === 'fiveDaysNotification' && n.days_remaining === 5) ||
          (key === 'threeDaysNotification' && n.days_remaining === 3),
      );

      this.logger.debug(
        `Job ${key} has ${notifications.length} upcoming notifications`,
      );

      jobsList.push({
        jobName: key,
        lastExecution: value.lastDate(),
        nextExecution: value.nextDate(),
        running: value.running,
        upcoming_notifications: notifications,
      });
    });

    return jobsList;
  }
}
