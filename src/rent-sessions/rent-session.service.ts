import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { RentSessionEntity } from './entity/rent-session.entity';

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
        return  await this.rentSessionRepository.find({
            where: {
                startedAt: LessThanOrEqual(today),
                endedAt: MoreThanOrEqual(today)
            }
        });

    }


    async rentSessionLimit(startedAt: Date, endedAt: Date): Promise<boolean> {
        let start = new Date(startedAt);
        let end = new Date(endedAt);
        let diffDays: number;
        diffDays = Math.floor((end.valueOf() - start.valueOf()) / 86400000); // days
        return diffDays <=30;
    }

    async create(createRentSessionDto): Promise<RentSessionEntity[]> {
        if(!(await this.rentSessionLimit(createRentSessionDto.startedAt,createRentSessionDto.endedAt))){
            throw new HttpException("Maximum rental period: 30 days.", 500)
        }
        return this.rentSessionRepository.save(createRentSessionDto)
    }



    async destroy(id: string): Promise<void> {
        await this.rentSessionRepository.delete(id);
    }


}
