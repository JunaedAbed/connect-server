import { CreateUnitDto } from '../dto/create-unit.dto';
import { Unit } from '../entities/unit.entity';

export interface IUnitService {
  createUnit(unitDto: CreateUnitDto): Promise<Unit>;
  updateUnit(id: string, unitDto: CreateUnitDto): Promise<Unit>;
  findAll(): Promise<Unit[]>;
  findOne(id: string): Promise<Unit>;
  deleteUnit(id: string): Promise<{ deleted: boolean }>;
}
