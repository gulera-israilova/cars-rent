import {CarEntity} from "../../cars/entity/car.entity";


export class CreateRentSessionDto {
    readonly tariffId: number
    readonly start: string
    readonly end: string
    readonly carsEntity: CarEntity
}