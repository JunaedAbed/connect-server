import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/modules/user/services/user.service';
import { RoleService } from 'src/modules/role/services/role.service';
import { hashPassword } from 'src/utils/bcrypt';
import { UserRegistrationDTO } from '../dto/user-reg.dto';
import { LoginInfo } from '../entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoModel: Model<LoginInfo>,
    private userService: UserService,
    private roleService: RoleService,
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
      // const loginInfo = await this.loginInfoModel.findOne({
      //   where: { strPhone: registerDTO.strMobileNumber },
      // });
      // if (!loginInfo) throw new BadRequestException('OTP is not recognized');

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
        strName: registerDTO.strName,
        strEmail: registerDTO.strEmail,
        strPassword: hashedPassword,
        strMobileNumber: registerDTO.strMobileNumber,
        strUserImage: registerDTO.strUserImage,
        strDeviceToken: registerDTO.strDeviceToken,
        intRoleId: registerDTO.intRoleId,
      });
      if (!user) {
        throw new InternalServerErrorException('Could not create user');
      }

      const role = await this.roleService.findById(user.intRoleId);
      const payload = {
        email: user.strEmail,
        intId: user.intUserID,
        password: user.strPassword,
        role: role.strRoleName,
      };

      const expiresIn = '30d';
      const strRefresh_token = await this.jwtService.signAsync(payload, {
        expiresIn,
      });

      const newUser = await this.loginInfoModel.findByIdAndUpdate(
        user.intUserID,
        {
          intUserId: user.intUserID,
          strEmail: user.strEmail,
          strPassword: user.strPassword,
          dteLastLogin: new Date(),
          strRefresh_token: strRefresh_token,
        },
      );
      if (!newUser) {
        throw new InternalServerErrorException('Could not create user');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
