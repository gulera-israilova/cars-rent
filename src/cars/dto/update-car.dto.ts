import { IsString } from 'class-validator';

export class UpdateCarDto {
    @IsString()
    readonly carBrand: string

    @IsString()
    readonly model: string

    @IsString()
    readonly stateNumber: string

    @IsString()
    readonly VIN: string
}