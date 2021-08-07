import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LessThanOrEqual, MoreThanOrEqual, Repository} from 'typeorm';
import {RentSessionEntity} from '../entity/rent-session.entity';
import {CreateRentSessionDto} from '../dto/create-rent-session.dto';
import {CarEntity} from "../../cars/entity/car.entity";
import {subDays} from "date-fns";
import {differenceInDays} from "date-fns";
import {calculateAmount, calculateKilometrage} from "../enum/tarrif.enum";

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

    private static async isWeekend(date: Date): Promise<boolean> {
        let day = date.getDay()
        return (day == 6 || day == 0) //If it's true then this is a day off
    }

    async execute(createRentSessionDto: CreateRentSessionDto) {
        let start = new Date(createRentSessionDto.startedAt);
        let end = new Date(createRentSessionDto.endedAt);
        let numberOfRentDays = differenceInDays(end, start);

        if (differenceInDays(end, new Date()) < numberOfRentDays) {
            throw new HttpException("Cannot be booked in the past", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (await CreateRentSessionService.isWeekend(start)) {
            throw new HttpException("Booking not available due to start date falls on weekend", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (await CreateRentSessionService.isWeekend(end)) {
            throw new HttpException("Booking not available due to end date falls on weekend", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (numberOfRentDays > 30) {
            throw new HttpException("Car rental period exceeded (max = 30 days)", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        let threeDaysBeforeSessionStart = subDays(new Date(createRentSessionDto.startedAt), 3);
        let lastCarRentSession = await this.getRentSessionBy(createRentSessionDto.car, threeDaysBeforeSessionStart);
        if (lastCarRentSession) {
            throw new HttpException(`Three days have not passed since the last rent session (was ended at ${lastCarRentSession.endedAt})`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        let checkBookedByStart = await this.getRentSessionBy(createRentSessionDto.car, new Date(createRentSessionDto.startedAt))
        if (checkBookedByStart) {
            throw new HttpException(`Already have booked from ${checkBookedByStart.startedAt} to ${checkBookedByStart.endedAt}`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        let checkBookedByEnd = await this.getRentSessionBy(createRentSessionDto.car, new Date(createRentSessionDto.endedAt))
        if (checkBookedByEnd) {
            throw new HttpException(`Already have booked from ${checkBookedByEnd.startedAt} to ${checkBookedByEnd.endedAt}`, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        createRentSessionDto.amount = calculateAmount(numberOfRentDays, createRentSessionDto.tariff)
        createRentSessionDto.kilometrage = calculateKilometrage(numberOfRentDays, createRentSessionDto.tariff)

        return await this.rentSessionRepository.save(createRentSessionDto);
    }
}

// enum 1-первый тариф и так далее, проверка есть ли тариф
// модель тарифа
// все заказы за 30 дней
//все заказы разделить по машинам и для каждой машины
// фит - все заказы фит за 30 дней, складываем все километры делим на 30
// 5. 10-3=7



