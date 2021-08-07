import {CarEntity} from "../../cars/entity/car.entity";
import {IsDate, IsEmpty, IsEnum, IsNumber} from 'class-validator';
import {Tariff} from "../enum/tarrif.enum";
import {Type} from "class-transformer";


export class CreateRentSessionDto {
    @IsEnum(Tariff)
    readonly tariff: Tariff

    @IsDate()
    @Type(() => Date)
    readonly startedAt: Date

    @IsDate()
    @Type(() => Date)
    readonly endedAt: Date

    @IsNumber()
    readonly car: CarEntity

    @IsEmpty()
    amount: number

    @IsEmpty()
    kilometrage: number
}