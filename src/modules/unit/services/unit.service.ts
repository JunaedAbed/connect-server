import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(): Promise<Unit[]> {
    try {
      const allUnits = await this.unitModel.find({});
      return allUnits;
    } catch (error) {
      throw error;
    }
  }

  async findOne(strUnitId: string): Promise<Unit> {
    try {
      const unitInfo = await this.unitModel.findOne({ strUnitId });
      if (!unitInfo) {
        throw new NotFoundException('Unit not found');
      }
      return unitInfo;
    } catch (error) {
      throw error;
    }
  }

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
  async updateUnit(
    strUnitId: string,
    updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    try {
      const updatedUnit = await this.unitModel.findOneAndUpdate(
        { strUnitId },
        updateUnitDto,
        { new: true },
      );
      if (!updatedUnit) {
        throw new InternalServerErrorException('Could not update unit');
      }
      return updatedUnit;
    } catch (error) {
      throw error;
    }
  }

  async deleteUnit(strUnitId: string): Promise<{ deleted: boolean }> {
    try {
      const result = await this.unitModel.deleteOne({ strUnitId });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Unit not found');
      }

      return { deleted: true };
    } catch (error) {
      throw error;
    }
  }
}
