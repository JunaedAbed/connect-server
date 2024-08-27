import { Test, TestingModule } from '@nestjs/testing';
import { UnitController } from '../controllers/unit.controller';
import { UnitService } from '../services/unit.service';

describe('UnitController', () => {
  let controller: UnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitController],
      providers: [UnitService],
    }).compile();

    controller = module.get<UnitController>(UnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
