import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {CreateCarDto} from "./dto/create-car.dto";
import {CarService} from "./car.service";
import {UpdateCarDto} from "./dto/update-car.dto";

import {UpdateResult} from "typeorm";
import {FilterCarSessionsDto} from "./dto/filter-car-sessions.dto";

@Controller('cars')
export class CarController {
    constructor(private readonly carsService: CarService) {
    }

    @Get()
    index() {
        return this.carsService.index()
    }

    @Get('rent-sessions')
    byAllCars(@Query() filterCarSessionsDto: FilterCarSessionsDto) {
        return this.carsService.kilometrage(filterCarSessionsDto)
    }

    @Get(':id/kilometrage')
    byCar(@Query() filterCarSessionsDto: FilterCarSessionsDto, @Param('id') car: number) {
        return this.carsService.kilometrage(filterCarSessionsDto, car)
    }

    @Get(':id')
    show(@Param('id') id: string) {
        return this.carsService.show(id)
    }

    @Post()
    create(@Body() createCarDto: CreateCarDto) {
        return this.carsService.create(createCarDto)
    }

    @Delete(':id')
    destroy(@Param('id') id: string) {
        return this.carsService.destroy(id)
    }

    @Put(':id')
    update(@Body() updateCarDto: UpdateCarDto, @Param('id') id: string): Promise<UpdateResult> {
        return this.carsService.update(id, updateCarDto)
    }
}

