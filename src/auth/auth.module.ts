import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),
  JwtModule.register({
    secret:'secret',
    signOptions:{expiresIn:'1d'}
  })],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
