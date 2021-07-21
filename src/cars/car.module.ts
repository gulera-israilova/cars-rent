import {Module} from "@nestjs/common";
import {CarService} from "./car.service";
import {CarController} from "./car.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CarEntity} from "./entity/car.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CarEntity])],
    providers: [CarService],
    controllers: [CarController],
})

export class CarModule {}