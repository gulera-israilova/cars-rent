import { Test, TestingModule } from '@nestjs/testing';
import { RentSessionService } from './rent-session.service';

describe('RentSessionsService', () => {
  let service: RentSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentSessionService],
    }).compile();

    service = module.get<RentSessionService>(RentSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
