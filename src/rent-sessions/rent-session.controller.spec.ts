import { Test, TestingModule } from '@nestjs/testing';
import { RentSessionController } from './rent-session.controller';

describe('RentSessionsController', () => {
  let controller: RentSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentSessionController],
    }).compile();

    controller = module.get<RentSessionController>(RentSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
