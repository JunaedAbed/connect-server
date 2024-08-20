import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRegistrationDTO } from '../dto/user-reg.dto';
import { LoginInfo } from '../entities/auth.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { hashPassword } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoRepository: Model<LoginInfo>,
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registration(registerDTO: UserRegistrationDTO) {
    if (
      !registerDTO.strEmail ||
      !registerDTO.strPassword ||
      !registerDTO.strMobileNumber
    ) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    try {
      const loginInfo = await this.loginInfoRepository.findOne({
        where: { strPhone: registerDTO.strMobileNumber },
      });
      if (!loginInfo) throw new BadRequestException('OTP is not recognized');

      const isUserEmailExist = await this.userService.findByEmail(
        registerDTO.strEmail,
      );
      if (isUserEmailExist) {
        throw new UnauthorizedException('user already exist with this email!');
      }
      const isUserPhoneExist = await this.userService.findByPhone(
        registerDTO.strMobileNumber,
      );
      if (isUserPhoneExist) {
        throw new UnauthorizedException(
          'user already exist with this phone number!',
        );
      }
      const hashedPassword = await hashPassword(registerDTO.strPassword);
      const user = await this.userService.createUser({
        strEmail: registerDTO.strEmail,
        strPassword: hashedPassword,
        strPhone: registerDTO.strMobileNumber,
        intRoleId: registerDTO.strRole,
        isAllBranch: registerDTO.isAllBranch,
        isOrderFullAccess: registerDTO.isOrderFullAccess,
      });
      if (!user) {
        throw new InternalServerErrorException('Could not create user');
      }

      const role = await this.roleService.findById(user.intRoleId);
      const payload = {
        email: user.strEmail,
        intId: user.intId,
        password: user.strPassword,
        role: role.strRoleName,
      };

      const expiresIn = '30d';
      const strRefresh_token = await this.jwtService.signAsync(payload, {
        expiresIn,
      });

      const newUser = await this.loginInfoRepository.update(loginInfo.intId, {
        intUserId: user.intId,
        strEmail: user.strEmail,
        strPassword: user.strPassword,
        dteLastLogin: new Date(),
        strRefresh_token: strRefresh_token,
      });
      if (!newUser) {
        throw new InternalServerErrorException('Could not create user');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
