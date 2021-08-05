import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Between, getRepository, LessThanOrEqual, MoreThanOrEqual, Repository} from 'typeorm';
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

    private async getRentSessionBy(car: CarEntity, day: Date): Promise<RentSessionEntity | undefined> {
        return await this.rentSessionRepository.findOne({
            where: {
                car: car,
                startedAt: LessThanOrEqual(day),
                endedAt: MoreThanOrEqual(day),
            },
            order: {
                endedAt: "DESC",
            }
        })
    }

    private async rentSessionLimitExceeded(startedAt: Date, endedAt: Date): Promise<boolean> {
        let diff = Math.abs(startedAt.valueOf() - endedAt.valueOf());
        return Math.ceil(diff / (1000 * 3600 * 24)) > 30;
    }

    private async isWeekend(date: Date): Promise<boolean> {
        let day = date.getDay()
        return (day == 6 || day == 0) //If it's true then this is a day off
    }

    private async isThreeDaysPassed(createRentSessionDto: CreateRentSessionDto) {
        const subDays = require('date-fns/subDays')
        let startedAt = new Date(createRentSessionDto.startedAt)

        return await getRepository(RentSessionEntity)
            .findOne({
                where: {
                    car: createRentSessionDto.car,
                    endedAt: Between(subDays(startedAt, 3), startedAt)
                },
            });
    }

    async execute(createRentSessionDto: CreateRentSessionDto) {
        let start = new Date(createRentSessionDto.startedAt)
        let end = new Date(createRentSessionDto.endedAt)

        if (await this.rentSessionLimitExceeded(start, end)) {
            throw new HttpException("Car rental period exceeded (max = 30 days)", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (await this.isWeekend(start)) {
            throw new HttpException("Booking not available due to start date falls on weekend", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (await this.isThreeDaysPassed(createRentSessionDto)) {
            throw new HttpException("Three days have not passed since the last rent session", HttpStatus.UNPROCESSABLE_ENTITY)
        }

        let checkBookedByStart = await this.getRentSessionBy(createRentSessionDto.car, new Date(createRentSessionDto.startedAt))
        if (checkBookedByStart) {
            throw new HttpException(`Already have booked from ${checkBookedByStart.startedAt} to ${checkBookedByStart.endedAt}`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        let checkBookedByEnd = await this.getRentSessionBy(createRentSessionDto.car, new Date(createRentSessionDto.endedAt))
        if (checkBookedByEnd) {
            throw new HttpException(`Already have booked from ${checkBookedByEnd.startedAt} to ${checkBookedByEnd.endedAt}`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        return await this.rentSessionRepository.save(createRentSessionDto);
    }
}