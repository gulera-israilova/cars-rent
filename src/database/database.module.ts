import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CarEntity} from "../cars/entity/car.entity";
import {RentSessionEntity} from "../rent-sessions/entity/rent-session.entity";
import {CarModule} from "../cars/car.module";
import {RentSessionModule} from "../rent-sessions/rent-session.module";


@Module({
    imports: [
        CarModule,
        RentSessionModule,
        TypeOrmModule.forRoot(
        {
            "type": "postgres",
            "host": "localhost",
            "port": 5432,
            "username": "postgres",
            "password": "postgres",
            "database": "postgres",
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
