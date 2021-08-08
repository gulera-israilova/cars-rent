import {Injectable} from "@nestjs/common";
import {Between, LessThanOrEqual, MoreThanOrEqual, Repository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UpdateCarDto} from "./dto/update-car.dto";
import {CarEntity} from "./entity/car.entity";
import {FilterCarSessionsDto} from "./dto/filter-car-sessions.dto";
import {RentSessionEntity} from "../rent-sessions/entity/rent-session.entity";
import {calculateKilometrage} from "../rent-sessions/enum/tarrif.enum";
import {differenceInDays} from "date-fns";

@Injectable()
export class CarService {

    constructor(
        @InjectRepository(CarEntity)
        private carsRepository: Repository<CarEntity>,
        @InjectRepository(RentSessionEntity)
        private rentSessionRepository: Repository<RentSessionEntity>,
    ) {
    }

    index(): Promise<CarEntity[]> {
        return this.carsRepository.find();
    }

    show(id: string): Promise<CarEntity> {
        return this.carsRepository.findOne(id);
    }

    async destroy(id: string): Promise<void> {
        await this.carsRepository.delete(id);
    }

    async create(createCarDto): Promise<CarEntity[]> {
        return this.carsRepository.save(createCarDto)
    }

    async update(id: string, cartDto: UpdateCarDto): Promise<UpdateResult> {
        return this.carsRepository.update(id, cartDto)
    }

    async kilometrage(filterCarSessionsDto: FilterCarSessionsDto, car?: number): Promise<Number> {
        let options = {
            where: {
                startedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
                endedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
            },
            orWhere: {
                startedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
                endedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
            }
        }

        if (car) {
            options.where['car'] = car;
        }

        let rentSessions = await this.rentSessionRepository.find(options);
        let kilometrage = 0;
        rentSessions.forEach(rentSession => {
            let days = differenceInDays(rentSession.endedAt, rentSession.startedAt)
            kilometrage += calculateKilometrage(days, rentSession.tariff)
        })

        return kilometrage
    }
}