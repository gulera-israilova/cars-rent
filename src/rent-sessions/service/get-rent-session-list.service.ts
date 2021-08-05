import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LessThanOrEqual, MoreThanOrEqual, Repository} from 'typeorm';
import {RentSessionEntity} from '../entity/rent-session.entity';
import {FilterRentSessionDto} from "../dto/filter-rent-session.dto";

@Injectable()
export class GetRentSessionListService {
    constructor(
        @InjectRepository(RentSessionEntity)
        private rentSessionRepository: Repository<RentSessionEntity>,
    ) {
    }

    execute(filterRentSessionDto: FilterRentSessionDto): Promise<RentSessionEntity[]> {
        let today = new Date();

        let options = filterRentSessionDto.onlyActive === 'true'
            ? ({
                where: {
                    startedAt: LessThanOrEqual(today),
                    endedAt: MoreThanOrEqual(today),
                },
            })
            : null;
        return this.rentSessionRepository.find(options);
    }
}