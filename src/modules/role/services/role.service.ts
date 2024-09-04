import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from '../dto/create-role.dto';
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
      const allRoles = await this.roleModel.find({});
      return allRoles;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Role> {
    try {
      const roleInfo = await this.roleModel.findById(id);
      if (!roleInfo) throw new NotFoundException('Role Not Found');
      return roleInfo;
    } catch (error) {
      throw error;
    }
  }

  async createRole(roleDto: CreateRoleDto): Promise<Role> {
    try {
      const existingRole = await this.roleModel.findOne({
        strRoleName: roleDto.strRoleName,
      });
      if (existingRole) {
        throw new BadRequestException(
          `Role ${roleDto.strRoleName} already exists`,
        );
      }

      const roleInfo = await this.roleModel.create(roleDto);
      if (!roleInfo) {
        throw new InternalServerErrorException('Could not create role');
      }
      return roleInfo;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(
    id: number,
    updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<Role> {
    try {
      const updatedRole = await this.roleModel.findByIdAndUpdate(
        id,
        {
          ...updateRoleDto,
          dteUpdatedAt: Date.now(),
        },
        { new: true },
      );
      if (!updatedRole) {
        throw new InternalServerErrorException('Could not update role');
      }
      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(id: number): Promise<{ deleted: boolean }> {
    try {
      const deletedRole = await this.roleModel.findByIdAndUpdate(
        id,
        { isActive: false, dteUpdatedAt: Date.now() },
        { new: true },
      );

      if (!deletedRole) {
        throw new InternalServerErrorException('Could not delete role');
      }

      return { deleted: true };
    } catch (error) {
      throw error;
    }
  }
}
