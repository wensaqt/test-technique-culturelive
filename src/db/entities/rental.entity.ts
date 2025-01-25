import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rental')
export class Rental {
  @PrimaryGeneratedColumn()
  rental_id: number;

  @Column()
  rental_date: Date;

  @Column('int')
  inventory_id: number;

  @Column('int')
  customer_id: number;

  @Column()
  return_date: Date;

  @Column('int')
  staff_id: number;

  @Column('int')
  last_update: number;
}
