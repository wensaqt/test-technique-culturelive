import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Customer } from '../customers/entities/customer.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createRentalDto: CreateRentalDto): Promise<Rental> {
    const customer = await this.customersRepository.findOne({
      where: { customer_id: createRentalDto.customer_id },
    });

    if (!customer) {
      throw new BadRequestException(
        `Client #${createRentalDto.customer_id} non trouvé`,
      );
    }

    const rentalDate = moment.tz(
      createRentalDto.rental_date,
      customer.timezone,
    );
    const returnDate = moment.tz(
      createRentalDto.return_date,
      customer.timezone,
    );

    const durationInDays = returnDate.diff(rentalDate, 'days');

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

    const rental = this.rentalsRepository.create({
      ...createRentalDto,
      rental_date: rentalDate.toDate(),
      return_date: returnDate.toDate(),
    });

    try {
      return await this.rentalsRepository.save(rental);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Impossible de créer la location');
    }
  }

  async findAll(): Promise<Rental[]> {
    return await this.rentalsRepository.find({
      relations: ['customer', 'inventory', 'inventory.film', 'staff'],
    });
  }

  async findOne(id: number): Promise<Rental> {
    const rental = await this.rentalsRepository.findOne({
      where: { rental_id: id },
      relations: ['customer', 'inventory', 'inventory.film', 'staff'],
    });

    if (!rental) {
      throw new BadRequestException(`Location #${id} non trouvée`);
    }

    return rental;
  }

  private async isRentalModifiable(rental: Rental): Promise<boolean> {
    const now = new Date();
    const rentalDate = new Date(rental.rental_date);

    // Une location ne peut pas être modifiée si elle a déjà commencé
    if (rentalDate <= now) {
      return false;
    }

    return true;
  }

  async update(id: number, updateRentalDto: UpdateRentalDto): Promise<Rental> {
    const rental = await this.findOne(id);

    if (!(await this.isRentalModifiable(rental))) {
      throw new BadRequestException(
        'Impossible de modifier une location en cours ou terminée',
      );
    }

    // Vérifier la durée si les dates sont modifiées
    if (updateRentalDto.rental_date || updateRentalDto.return_date) {
      const rentalDate = new Date(
        updateRentalDto.rental_date || rental.rental_date,
      );
      const returnDate = new Date(
        updateRentalDto.return_date || rental.return_date,
      );

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

    Object.assign(rental, updateRentalDto);
    return await this.rentalsRepository.save(rental);
  }
}
