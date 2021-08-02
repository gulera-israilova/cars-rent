import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LessThanOrEqual, MoreThanOrEqual, Repository} from 'typeorm';
import {RentSessionEntity} from './entity/rent-session.entity';
import {CreateRentSessionDto} from './dto/create-rent-session.dto';
import moment from "moment";
import {promises} from "dns";

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
        console.log(Math.ceil(diff / (1000 * 3600 * 24)))
        return Math.ceil(diff / (1000 * 3600 * 24))<=30;

     }
     async isWeekend(date:Date):Promise<boolean>{
        let day = date.getDay()
        return (day === 6 || day === 0) //If it's true then this is a day off
     }


    async create(createRentSessionDto: CreateRentSessionDto) {

        console.log(createRentSessionDto.startedAt, createRentSessionDto.endedAt)

        let start = new Date(createRentSessionDto.startedAt)
        let end = new Date(createRentSessionDto.endedAt)

        console.log(start,end)
        console.log( await  this.rentSessionLimit(start,end))
        console.log(await (this.isWeekend(start) || this.isWeekend(end))) //true - weekend, cannot be booked


        if (!(await  this.rentSessionLimit(start,end)))
        {
            throw new HttpException("Car rental period maximum 30 days", 500);

        } else if (await (this.isWeekend(start) || this.isWeekend(end)))
        {
            throw new HttpException("Weekend, cannot be booked", 500);
        }
        else  return await this.rentSessionRepository.save(createRentSessionDto);

      }

    async destroy(id: string): Promise<void> {
        await this.rentSessionRepository.delete(id);
    }
}