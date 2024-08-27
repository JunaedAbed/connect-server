import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../entities/role.entity';
import { IRoleService } from './role-service.interface';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    try {
      const roleInfo = await this.roleModel.find();
      if (roleInfo.length === 0) throw new NotFoundException('No Role found');
      return roleInfo;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<Role> {
    try {
      const roleInfo = await this.roleModel.findOne({ intRoleId: id });
      if (!roleInfo) throw new NotFoundException('Role Not Found');
      return roleInfo;
    } catch (error) {
      throw error;
    }
  }
}
