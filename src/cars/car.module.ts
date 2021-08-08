import {Module} from "@nestjs/common";
import {CarService} from "./car.service";
import {CarController} from "./car.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CarEntity} from "./entity/car.entity";
import {RentSessionEntity} from "../rent-sessions/entity/rent-session.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        CarEntity,
        RentSessionEntity,
    ])],
    providers: [
        CarService,
    ],
    controllers: [CarController],
})

export class CarModule {}