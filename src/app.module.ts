import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {CarModule} from './cars/car.module';

import {Connection} from 'typeorm';
import {RentSessionModule} from './rent-sessions/rent-session.module';


@Module({
  imports: [ DatabaseModule, CarModule, RentSessionModule],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
