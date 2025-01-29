import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn()
  film_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  release_year: number;

  @Column()
  language_id: number;

  @Column({ nullable: true })
  original_language_id: number;

  @Column({ type: 'smallint', default: 3 })
  rental_duration: number;

  @Column({ type: 'numeric', precision: 4, scale: 2, default: 4.99 })
  rental_rate: number;

  @Column({ type: 'smallint', nullable: true })
  length: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 19.99 })
  replacement_cost: number;

  @Column({ type: 'text', array: true, nullable: true })
  special_features: string[];

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;
}
