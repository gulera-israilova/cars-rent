import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService { constructor(
  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>,
  private jwtService: JwtService
) {}

  async create(userDto): Promise<UserEntity> {
  userDto.password = await bcrypt.hash(userDto.password,12)
    return this.userRepository.save(userDto)
  }

  async findUser(userDto): Promise<UserEntity>{
   return this.userRepository.findOne({
    where:{
      email:userDto.email
    }
  })
 }


 async login(userDto){
  const user = await this.findUser(userDto)

  if(!user){
    throw new BadRequestException("No such user")
  }
  if(!(bcrypt.compare(userDto.password,user.password))){
    throw new BadRequestException("Passwords do not match")
  }

  return await this.jwtService.signAsync({id:user.id})
}
}

