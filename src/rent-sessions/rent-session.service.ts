import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RentSessionEntity} from "./entity/rent-session.entity";

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

    async create(createRentSessionDto): Promise<RentSessionEntity[]> {
        return this.rentSessionRepository.save(createRentSessionDto)
    }

    async destroy(id: string): Promise<void> {
        await this.rentSessionRepository.delete(id);
    }


}
