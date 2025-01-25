import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from '../../films/entities/film.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column()
  film_id: number;

  @Column()
  store_id: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_update: Date;

  @ManyToOne(() => Film)
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @ManyToOne(() => Store)
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
