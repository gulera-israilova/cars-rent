import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import {RentSessionEntity} from './entity/rent-session.entity';
import {CreateRentSessionDto} from './dto/create-rent-session.dto';


@Injectable()
export class RentSessionService {
    constructor(
        @InjectRepository(RentSessionEntity)
        private rentSessionRepository: Repository<RentSessionEntity>,
    ) {
    }

    index(): Promise<RentSessionEntity[]> {
        return this.rentSessionRepository.find();
    }

    async getActiveRentSession(): Promise<RentSessionEntity[]> {
        const today = new Date();
        return await this.rentSessionRepository.find({
            where: {
                startedAt: LessThanOrEqual(today),
                endedAt: MoreThanOrEqual(today),
            },
        });
    }

    async rentSessionLimit(startedAt:Date, endedAt:Date):Promise<boolean> {

        let diff = Math.abs(startedAt.valueOf() - endedAt.valueOf());
        return Math.ceil(diff / (1000 * 3600 * 24))<=30;

     }
     async isWeekend(date:Date):Promise<boolean>{
        let day = date.getDay()
         console.log(day + "day of week");
        return (day == 6 || day == 0) //If it's true then this is a day off
     }


    async create(createRentSessionDto: CreateRentSessionDto):Promise<RentSessionEntity> {
        let start = new Date(createRentSessionDto.startedAt)
        let end = new Date(createRentSessionDto.endedAt)

        if (!(await  this.rentSessionLimit(start,end)))
        {
            throw new HttpException("Car rental period maximum 30 days", 500);

        } else if (await this.isWeekend(start) || await this.isWeekend(end))
        {
            throw new HttpException("Weekend, cannot be booked", 500);
        } else  return await this.rentSessionRepository.save(createRentSessionDto);

      }

    async destroy(id: string): Promise<void> {
        await this.rentSessionRepository.delete(id);
    }
}