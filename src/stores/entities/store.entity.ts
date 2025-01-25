import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('store')
export class Store {
  @PrimaryGeneratedColumn()
  store_id: number;

  @Column()
  manager_staff_id: number;

  @Column()
  address_id: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;
}
