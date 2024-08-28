import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';

export interface IRoleService {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role>;
  createRole(roleDto: CreateRoleDto): Promise<Role>;
  updateRole(
    intRoleId: number,
    updateRoleDto: Partial<CreateRoleDto>,
  ): Promise<Role>;
  deleteRole(intRoleId: number): Promise<{ deleted: boolean }>;
}
