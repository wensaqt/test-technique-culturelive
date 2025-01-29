import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column()
  store_id: number;

  @Column({ length: 45 })
  first_name: string;

  @Column({ length: 45 })
  last_name: string;

  @Column({ length: 50, nullable: true })
  email: string;

  @Column()
  address_id: number;

  @Column({ name: 'activebool', default: true })
  activebool: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  create_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;

  @Column({ nullable: true })
  active: number;

  @Column({ length: 50, nullable: false, default: 'UTC' })
  timezone: string;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
