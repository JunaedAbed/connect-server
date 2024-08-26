import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async findAll() {
    try {
      const roleInfo = await this.roleModel.find();
      if (roleInfo.length === 0) throw new NotFoundException('No Role found');
      return roleInfo;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number) {
    try {
      const roleInfo = await this.roleModel.findOne({ intRoleId: id });
      console.log('role', roleInfo);
      if (!roleInfo) throw new NotFoundException('Role Not Found');
      return roleInfo;
    } catch (error) {
      throw error;
    }
  }
}
