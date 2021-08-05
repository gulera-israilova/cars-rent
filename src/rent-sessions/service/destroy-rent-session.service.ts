import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {RentSessionEntity} from '../entity/rent-session.entity';


@Injectable()
export class DestroyRentSessionService {
    constructor(
        @InjectRepository(RentSessionEntity)
        private rentSessionRepository: Repository<RentSessionEntity>,
    ) {
    }

    async execute(id: string): Promise<void> {
        await this.rentSessionRepository.delete(id);
    }
}