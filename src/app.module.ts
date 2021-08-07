import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {CarModule} from './cars/car.module';

import {Connection} from 'typeorm';
import {RentSessionModule} from './rent-sessions/rent-session.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ DatabaseModule, CarModule, RentSessionModule, AuthModule],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
