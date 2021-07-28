import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {RentSessionService} from "./rent-session.service";
import {CreateRentSessionDto} from "./dto/create-rent-session.dto";

@Controller('rent-sessions')
export class RentSessionController {
    constructor(private readonly rentSessionService: RentSessionService) {
    }

    @Post()
    create(@Body() createRentSessionDto: CreateRentSessionDto) {
        return this.rentSessionService.create(createRentSessionDto)
    }

    @Get()
    index() {
        return this.rentSessionService.index()
    }

    @Get('active')
    getActiveRentSession() {
        return this.rentSessionService.getActiveRentSession();
    }

    @Delete(':id')
    destroy(@Param('id') id: string) {
        return this.rentSessionService.destroy(id)
    }

}

