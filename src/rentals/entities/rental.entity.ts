import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { BadRequestException } from '@nestjs/common';

@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn()
  rental_id: number;

  @Column({ type: 'timestamp' })
  rental_date: Date;

  @Column()
  inventory_id: number;

  @Column()
  customer_id: number;

  @Column({ type: 'timestamp', nullable: true })
  return_date: Date;

  @Column()
  staff_id: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @BeforeInsert()
  validateRentalDuration() {
    const returnDate = new Date(this.return_date);
    const rentalDate = new Date(this.rental_date);
    const durationInDays = Math.floor(
      (returnDate.getTime() - rentalDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (durationInDays < 7) {
      throw new BadRequestException(
        'La durée minimale de location est de 1 semaine',
      );
    }

    if (durationInDays > 21) {
      throw new BadRequestException(
        'La durée maximale de location est de 3 semaines',
      );
    }
  }
}
