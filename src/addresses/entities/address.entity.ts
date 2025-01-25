import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  address_id: number;

  @Column({ length: 50 })
  address: string;

  @Column({ length: 50, nullable: true })
  address2: string;

  @Column({ length: 20 })
  district: string;

  @Column()
  city_id: number;

  @Column({ length: 10, nullable: true })
  postal_code: string;

  @Column({ length: 20 })
  phone: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;
}
