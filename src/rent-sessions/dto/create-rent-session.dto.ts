import {CarEntity} from "../../cars/entity/car.entity";


export class CreateRentSessionDto {
    readonly tariff: number
    readonly startedAt: string
    readonly endedAt: string
    readonly carEntity: CarEntity
}