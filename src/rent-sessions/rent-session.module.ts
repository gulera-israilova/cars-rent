import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {RentSessionEntity} from "./entity/rent-session.entity";
import {RentSessionService} from "./rent-session.service";
import {RentSessionController} from "./rent-session.controller";

@Module({
    imports: [TypeOrmModule.forFeature([RentSessionEntity])],
    providers: [RentSessionService],
    controllers: [RentSessionController],
})

export class RentSessionModule {}
