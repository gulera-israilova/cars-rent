import { HttpException, Injectable } from '@nestjs/common';
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

  async rentSessionLimit(startedAt, endedAt): Promise<boolean> {
    return startedAt.getTime() + 2.592e+9 > endedAt.getTime()
  }

  async create(createRentSessionDto: CreateRentSessionDto): Promise<RentSessionEntity> {
    let start = new Date(createRentSessionDto.startedAt);
    let end = new Date(createRentSessionDto.endedAt);
    if (!(await this.rentSessionLimit(start,end)))
    {
      throw new HttpException("You can't book a car for more than a thirty days.", 500);

    } else
    {
      return await this.rentSessionRepository.save(createRentSessionDto)
    }

  }

  async destroy(id: string): Promise<void> {
    await this.rentSessionRepository.delete(id);
  }

}