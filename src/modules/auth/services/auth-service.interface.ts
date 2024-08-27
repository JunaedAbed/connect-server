import { User } from 'src/modules/user/entities/user.entity';
import { AuthDTO } from '../dto/auth.dto';
import { UserRegistrationDTO } from '../dto/user-reg.dto';
import { LoginInfo } from '../entities/auth.entity';

export interface IAuthService {
  login(authDTO: AuthDTO): Promise<LoginInfo>;
  userRegistration(registerDTO: UserRegistrationDTO): Promise<User>;
}
