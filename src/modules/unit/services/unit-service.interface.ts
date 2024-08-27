import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { Unit } from '../entities/unit.entity';

export interface IUnitService {
  createUnit(unitDto: CreateUnitDto): Promise<Unit>;
  updateUnit(unitDto: UpdateUnitDto): Promise<Unit>;
  getUnitName(strUnitId: string): Promise<Unit>;
}
