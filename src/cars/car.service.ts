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

    async carKilometrage(filterCarSessionsDto: FilterCarSessionsDto, car: CarEntity): Promise<{ car: CarEntity; kilometrage: number }> {
        let options = {
            where: {
                car: car,
            },
            andWhere: [
                {
                    startedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
                },
                {
                    endedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
                }
            ]
        }

        let rentSessions = await this.rentSessionRepository.find(options);
        let kilometrage = 0;
        rentSessions.forEach(rentSession => {
            let days: number;
            if (filterCarSessionsDto.startedAt > rentSession.startedAt) {
                days = differenceInDays(rentSession.endedAt, filterCarSessionsDto.startedAt)
            } else if (filterCarSessionsDto.endedAt < rentSession.endedAt) {
                days = differenceInDays(filterCarSessionsDto.endedAt, rentSession.startedAt)
            } else {
                days = differenceInDays(rentSession.endedAt, rentSession.startedAt)
            }

            kilometrage += calculateKilometrage(days, rentSession.tariff)
        })

        return {
            car: car,
            kilometrage: kilometrage
        }
    }

    async carsKilometrage(filterCarSessionsDto: FilterCarSessionsDto) {
        let options = {
            where: [
                {
                    startedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
                },
                {
                    endedAt: Between(filterCarSessionsDto.startedAt, filterCarSessionsDto.endedAt),
                },
            ],
        }

        let rentSessions = await this.rentSessionRepository.find(options);
        let kilometrage = 0;
        rentSessions.forEach(rentSession => {
            let days: number;
            if (filterCarSessionsDto.startedAt > rentSession.startedAt) {
                days = differenceInDays(rentSession.endedAt, filterCarSessionsDto.startedAt)
            } else if (filterCarSessionsDto.endedAt < rentSession.endedAt) {
                days = differenceInDays(filterCarSessionsDto.endedAt, rentSession.startedAt)
            } else {
                days = differenceInDays(rentSession.endedAt, rentSession.startedAt)
            }

            kilometrage += calculateKilometrage(days, rentSession.tariff)
        })

        return kilometrage
    }
}