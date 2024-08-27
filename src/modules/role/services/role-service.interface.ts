import { Role } from '../entities/role.entity';

export interface IRoleService {
  findAll(): Promise<Role[]>;
  findById(id: number): Promise<Role>;
}
