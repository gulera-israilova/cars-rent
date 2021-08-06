import {CarEntity} from "../../cars/entity/car.entity";
import { IsDate, IsDateString, IsEmpty, IsNumber, IsString } from 'class-validator';



export class CreateRentSessionDto {
    @IsNumber()
    readonly tariff: number

    @IsDateString()
    readonly startedAt: Date

    @IsDateString()
    readonly endedAt: Date

    @IsNumber()
    readonly car: CarEntity

    @IsEmpty()
    price:number

    @IsNumber()
    kilometrage:number
}