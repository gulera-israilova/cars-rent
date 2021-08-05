import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {getRepository, LessThanOrEqual, MoreThanOrEqual, Repository} from 'typeorm';
import {RentSessionEntity} from '../entity/rent-session.entity';
import {CreateRentSessionDto} from '../dto/create-rent-session.dto';
import {CarEntity} from "../../cars/entity/car.entity";


@Injectable()
export class CreateRentSessionService {
    constructor(
        @InjectRepository(RentSessionEntity)
        private rentSessionRepository: Repository<RentSessionEntity>,
    ) {
    }

    async getActiveRentSession(car: CarEntity) {
        let today = new Date();
        return await this.rentSessionRepository.find({
            where: {
                car: car,
                startedAt: LessThanOrEqual(today),
                endedAt: MoreThanOrEqual(today),
            },
        });
    }

    async rentSessionLimitExceeded(startedAt: Date, endedAt: Date): Promise<boolean> {
        let diff = Math.abs(startedAt.valueOf() - endedAt.valueOf());
        return Math.ceil(diff / (1000 * 3600 * 24)) > 30;
    }

    async isWeekend(date: Date): Promise<boolean> {
        let day = date.getDay()
        return (day == 6 || day == 0) //If it's true then this is a day off
    }

    async isThreeDaysPassed(carId: CarEntity) {
        let lastRent = await getRepository(RentSessionEntity)
            .findOne({
                order: {
                    endedAt: 'DESC',
                },
                where: {
                    car: carId,
                }
            })
        if (lastRent) {
            return lastRent.endedAt;
        } else {
            let carEntity = await getRepository(CarEntity).findOne(carId)

            return `No rent sessions with car ${carEntity.carBrand} ${carEntity.model} not found`
        }
    }

    //   async carBook(date: Date): Promise<boolean> {
    //    let newBookDate = Math.ceil(date.valueOf() / (1000 * 3600 * 24))-3
    //
    //   const orders = await this.rentSessionRepository.find({
    //    where: {
    //      endedAt: LessThanOrEqual(newBookDate)
    //    }
    //  })
    //  return orders.length > 0;
    // }

    async execute(createRentSessionDto: CreateRentSessionDto) {
        console.log(createRentSessionDto)
        let start = new Date(createRentSessionDto.startedAt)
        let end = new Date(createRentSessionDto.endedAt)

        if (await this.rentSessionLimitExceeded(start, end)) {
            throw new HttpException("Car rental period exceeded (max = 30 days)", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (await this.isWeekend(start)) {
            throw new HttpException("Booking not available due to start date falls on weekend", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        // if (await this.is3DaysPassed(createRentSessionDto.car)) {
        //     throw new HttpException("Not yet 3 days", HttpStatus.UNPROCESSABLE_ENTITY);
        // }

        console.log(await this.isThreeDaysPassed(createRentSessionDto.car));
        //     else if (!(await this.carBook(start))
        //     {
        //       throw new HttpException("This car is not available.", 500);
        // }
        return await this.rentSessionRepository.save(createRentSessionDto);

    }
}