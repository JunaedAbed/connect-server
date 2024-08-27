import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { Unit } from '../entities/unit.entity';
import { IUnitService } from './unit-service.interface';

@Injectable()
export class UnitService implements IUnitService {
  constructor(
    @InjectModel(Unit.name)
    private unitModel: Model<Unit>,
  ) {}

  async createUnit(unitDto: CreateUnitDto): Promise<Unit> {
    try {
      const unitInfo = await this.unitModel.create(unitDto);

      if (!unitInfo) {
        throw new InternalServerErrorException('Could not create unit');
      }
      return unitInfo;
    } catch (error) {
      throw error;
    }
  }
  async updateUnit(unitDto: UpdateUnitDto): Promise<Unit> {
    throw new Error('Method not implemented.');
  }
  async getUnitName(strUnitId: string): Promise<Unit> {
    throw new Error('Method not implemented.');
  }
}
