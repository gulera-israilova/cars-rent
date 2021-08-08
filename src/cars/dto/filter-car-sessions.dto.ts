import {IsDate} from 'class-validator';
import {Type} from "class-transformer";

export class FilterCarSessionsDto {
    @IsDate()
    @Type(() => Date)
    readonly startedAt: Date

    @IsDate()
    @Type(() => Date)
    readonly endedAt: Date
}