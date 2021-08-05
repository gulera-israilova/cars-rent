import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {CreateRentSessionService} from "./service/create-rent-session.service";
import {CreateRentSessionDto} from "./dto/create-rent-session.dto";
import {GetRentSessionListService} from "./service/get-rent-session-list.service"
import {DestroyRentSessionService} from "./service/destroy-rent-session.service";
import {FilterRentSessionDto} from "./dto/filter-rent-session.dto";

@Controller('rent-sessions')
export class RentSessionController {
    constructor(private readonly createRentSessionService: CreateRentSessionService,
                private readonly getRentSessionListService: GetRentSessionListService,
                private readonly destroyRentSessionService: DestroyRentSessionService) {
    }

    @Post()
    create(@Body() createRentSessionDto: CreateRentSessionDto) {
        return this.createRentSessionService.execute(createRentSessionDto)
    }

    @Get()
    index(@Query() filterRentSessionDto: FilterRentSessionDto) {
        return this.getRentSessionListService.execute(filterRentSessionDto)
    }

    @Delete(':id')
    destroy(@Param('id') id: string) {
        return this.destroyRentSessionService.execute(id)
    }
}