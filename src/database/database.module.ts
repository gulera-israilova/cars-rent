import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CarEntity} from "../cars/entity/car.entity";
import {RentSessionEntity} from "../rent-sessions/entity/rent-session.entity";
import {CarModule} from "../cars/car.module";
import {RentSessionModule} from "../rent-sessions/rent-session.module";
import { ConfigModule } from "@nestjs/config";


@Module({
    imports: [
        CarModule,
        RentSessionModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(
        {
            "type": "postgres",
            "host": process.env.DB_HOST,
            "port": +process.env.DB_PORT,
            "username": process.env.DB_USERNAME,
            "password": process.env.DB_PASSWORD,
            "database": process.env.DB_DATABASE,
            "autoLoadEntities": true,
            "synchronize": true,
            "entities": [CarEntity, RentSessionEntity]
        }),
    ],
    controllers: [],
    providers: [],
})
export class DatabaseModule {
}
