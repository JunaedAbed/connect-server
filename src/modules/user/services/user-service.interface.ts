import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export interface IUserService {
  findByEmail(strEmail: string): Promise<User>;
  findByPhone(strMobileNumber: string): Promise<User>;
  createUser(userDto: CreateUserDto): Promise<User>;
}
