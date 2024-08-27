import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
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

  @Post('create')
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
}
