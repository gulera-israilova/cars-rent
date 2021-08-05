import { Test, TestingModule } from '@nestjs/testing';
import { CreateRentSessionService } from './service/create-rent-session.service';

describe('RentSessionsService', () => {
  let service: CreateRentSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateRentSessionService],
    }).compile();

    service = module.get<CreateRentSessionService>(CreateRentSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
