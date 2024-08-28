import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { Unit } from '../entities/unit.entity';

export interface IUnitService {
  createUnit(unitDto: CreateUnitDto): Promise<Unit>;
  updateUnit(id: string, unitDto: UpdateUnitDto): Promise<Unit>;
  findAll(): Promise<Unit[]>;
  findOne(strUnitId: string): Promise<Unit>;
  deleteUnit(strUnitId: string): Promise<{ deleted: boolean }>;
}
