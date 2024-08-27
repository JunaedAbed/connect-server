import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { success } from 'src/helpers/http';
import { Roles } from 'src/middleware/role/roles.decorator';
import { RolesGuard } from 'src/middleware/role/roles.gaurd';
import { SUCCESS } from 'src/shared/constants/httpCodes';
import { IRoleService } from '../services/role-service.interface';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: IRoleService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('super-admin')
  async findAll(@Req() request: Request, @Res() response: Response) {
    try {
      const data: any = await this.roleService.findAll();
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }
}
