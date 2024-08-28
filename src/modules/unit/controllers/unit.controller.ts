import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { success } from 'src/helpers/http';
import { SUCCESS } from 'src/shared/constants/httpCodes';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { IUnitService } from '../services/unit-service.interface';

@Controller('unit')
export class UnitController {
  constructor(
    @Inject('IUnitService') private readonly unitService: IUnitService,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Body() unitDto: CreateUnitDto,
  ) {
    try {
      const data: any = await this.unitService.createUnit(unitDto);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    const data: any = await this.unitService.findAll();
    return response.status(SUCCESS).json(success(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const data: any = await this.unitService.findOne(id);
    return response.status(SUCCESS).json(success(data));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUnitDto: CreateUnitDto,
    @Res() response: Response,
  ) {
    try {
      const data: any = await this.unitService.updateUnit(id, updateUnitDto);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const data: any = await this.unitService.deleteUnit(id);
    return response.status(SUCCESS).json(success(data));
  }
}
