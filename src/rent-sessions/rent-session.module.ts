import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RentSessionEntity} from "./entity/rent-session.entity";
import {CreateRentSessionService} from "./service/create-rent-session.service";
import {GetRentSessionListService} from "./service/get-rent-session-list.service";
import {RentSessionController} from "./rent-session.controller";
import {DestroyRentSessionService} from "./service/destroy-rent-session.service";

@Module({
    imports: [TypeOrmModule.forFeature([RentSessionEntity])],
    providers: [
        CreateRentSessionService,
        GetRentSessionListService,
        DestroyRentSessionService,
    ],
    controllers: [RentSessionController],
})

export class RentSessionModule {
}
