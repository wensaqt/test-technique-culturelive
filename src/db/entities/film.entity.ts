import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { Category } from './category.entity';

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn()
  film_id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  release_year: number;

  @Column('int')
  rental_duration: number;

  @Column('decimal')
  rental_rate: number;

  @Column('decimal')
  replacement_cost: number;

  @Column()
  rating: string;

  //   @ManyToOne(() => Category, (category) => category.films)
  //   @JoinColumn({ name: 'category_id' })
  //   category: Category;
}
