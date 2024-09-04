import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthDTO } from '../dto/auth.dto';

export interface IAuthService {
  isTokenValid(token: string): Promise<boolean>;
  login(authDTO: AuthDTO): Promise<any>;
  userRegistration(registerDTO: CreateUserDto): Promise<User>;
  validateRefreshToken(refreshToken: string): Promise<any>;
  logout(accessToken: string): Promise<void>;
}
