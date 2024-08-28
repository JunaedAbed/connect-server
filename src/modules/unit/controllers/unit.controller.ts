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
import { UpdateUnitDto } from '../dto/update-unit.dto';

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
  findAll() {
    return this.unitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.updateUnit(id, updateUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.deleteUnit(id);
  }

  // @Post()
  // create(@Body() createBlaaaaaaDto: CreateBlaaaaaaDto) {
  //   return this.blaaaaaaService.create(createBlaaaaaaDto);
  // }

  // @Get()
  // findAll() {
  //   return this.blaaaaaaService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.blaaaaaaService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateBlaaaaaaDto: UpdateBlaaaaaaDto,
  // ) {
  //   return this.blaaaaaaService.update(+id, updateBlaaaaaaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.blaaaaaaService.remove(+id);
  // }
}
