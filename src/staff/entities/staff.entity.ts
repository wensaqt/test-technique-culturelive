import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn()
  staff_id: number;

  @Column({ length: 45 })
  first_name: string;

  @Column({ length: 45 })
  last_name: string;

  @Column()
  address_id: number;

  @Column({ length: 50, nullable: true })
  email: string;

  @Column()
  store_id: number;

  @Column({ default: true })
  active: boolean;

  @Column({ length: 16 })
  username: string;

  @Column({ length: 40, nullable: true })
  password: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;
}
