import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { RentSessionEntity } from './entity/rent-session.entity';
import { CreateRentSessionDto } from './dto/create-rent-session.dto';

@Injectable()
export class RentSessionService {
  constructor(
    @InjectRepository(RentSessionEntity)
    private rentSessionRepository: Repository<RentSessionEntity>,
  ) {
  }

  index(): Promise<RentSessionEntity[]> {
    return this.rentSessionRepository.find();
  }

  async getActiveRentSession(): Promise<RentSessionEntity[]> {
    const today = new Date();
    return await this.rentSessionRepository.find({
      where: {
        startedAt: LessThanOrEqual(today),
        endedAt: MoreThanOrEqual(today),
      },
    });
  }

  async rentSessionLimit(startedAt, endedAt) {
    let diff = Math.abs(startedAt.valueOf() - endedAt.valueOf());
    return Math.ceil(diff / (1000 * 3600 * 24));
    // return diffInDays;
  }

  async create(createRentSessionDto: CreateRentSessionDto):Promise<RentSessionEntity> {
    let start = Date.parse(createRentSessionDto.startedAt);
    let end = Date.parse(createRentSessionDto.endedAt);
    console.log(start, end);
    console.log(this.rentSessionLimit(start, end));
    //console.log(this.rentSessionLimit(start, end));
    // if (!(await this.rentSessionLimit(createRentSessionDto.startedAt, createRentSessionDto.endedAt)))
    // {
    //   throw new HttpException("You can't book a car for more than a thirty days.", 500);
    //
    // } else
    // {
    return await this.rentSessionRepository.save(createRentSessionDto)
    // }
  }

  async destroy(id: string): Promise<void> {
    await this.rentSessionRepository.delete(id);
  }

}