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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { success } from 'src/helpers/http';
import { Roles } from 'src/middleware/role/roles.decorator';
import { RolesGuard } from 'src/middleware/role/roles.gaurd';
import { SUCCESS } from 'src/shared/constants/httpCodes';
import { CreateRoleDto } from '../dto/create-role.dto';
import { IRoleService } from '../services/role-service.interface';

@UseGuards(RolesGuard)
@Roles('super-admin')
@Controller('role')
export class RoleController {
  constructor(
    @Inject('IRoleService') private readonly roleService: IRoleService,
  ) {}

  @Get()
  // @UseGuards(RolesGuard)
  // @Roles('super-admin', 'admin')
  async findAll(@Res() response: Response) {
    const data: any = await this.roleService.findAll();
    return response.status(SUCCESS).json(success(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const data: any = await this.roleService.findById(id);
    return response.status(SUCCESS).json(success(data));
  }

  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const data: any = await this.roleService.createRole(createRoleDto);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') intRoleId: number,
    @Body() updateRoleDto: Partial<CreateRoleDto>,
    @Res() response: Response,
  ) {
    const data: any = await this.roleService.updateRole(
      intRoleId,
      updateRoleDto,
    );
    return response.status(SUCCESS).json(success(data));
  }

  @Delete(':id')
  async delete(@Param('id') intRoleId: number, @Res() response: Response) {
    const data: any = await this.roleService.deleteRole(intRoleId);
    return response.status(SUCCESS).json(success(data));
  }
}
