import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthDTO } from '../dto/auth.dto';

export interface IAuthService {
  login(authDTO: AuthDTO);
  userRegistration(registerDTO: CreateUserDto): Promise<User>;
}
