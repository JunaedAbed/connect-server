import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUnitDto } from '../dto/create-unit.dto';
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

  async findOne(id: string): Promise<Unit> {
    try {
      const unitInfo = await this.unitModel.findById(id);
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
      const existingUnit = await this.unitModel.findOne({
        strUnitName: unitDto.strUnitName,
      });
      if (existingUnit) {
        throw new BadRequestException(
          `Unit with name ${unitDto.strUnitName} already exists`,
        );
      }

      const unitInfo = await this.unitModel.create(unitDto);
      if (!unitInfo) {
        throw new InternalServerErrorException('Could not create unit');
      }
      return unitInfo;
    } catch (error) {
      throw error;
    }
  }

  async updateUnit(id: string, updateUnitDto: CreateUnitDto): Promise<Unit> {
    try {
      const updatedUnit = await this.unitModel.findByIdAndUpdate(
        id,
        updateUnitDto,
        { new: true },
      );
      if (!updatedUnit) {
        throw new BadRequestException('Could not update unit');
      }
      return updatedUnit;
    } catch (error) {
      throw error;
    }
  }

  async deleteUnit(id: string): Promise<{ deleted: boolean }> {
    try {
      const result = await this.unitModel.findByIdAndUpdate(
        id,
        { isActive: false, dteUpdatedAt: Date.now() },
        { new: true },
      );

      if (!result) {
        throw new NotFoundException('Unit not found');
      }

      return { deleted: true };
    } catch (error) {
      throw error;
    }
  }
}
