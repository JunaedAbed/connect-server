import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { IRoleService } from 'src/modules/role/services/role-service.interface';
import { IUnitService } from 'src/modules/unit/services/unit-service.interface';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { IUserService } from 'src/modules/user/services/user-service.interface';
import { hashPassword } from 'src/utils/bcrypt';
import { AuthDTO } from '../dto/auth.dto';
import { LoginInfo } from '../entities/auth.entity';
import { IAuthService } from './auth-service.interface';
import { Authenticators } from './authenticators';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoModel: Model<LoginInfo>,
    @Inject('IUserService') private userService: IUserService,
    @Inject('IRoleService') private roleService: IRoleService,
    @Inject('IUnitService') private unitService: IUnitService,
    private readonly authenticator: Authenticators,
  ) {}

  async login(authDTO: AuthDTO) {
    try {
      const { strEmailOrPhone, strPassword } = authDTO;
      let user: User;
      let isEmailLogin = false;
      if (strEmailOrPhone.includes('@')) {
        isEmailLogin = true;
        user = await this.userService.findByEmail(strEmailOrPhone);
      } else {
        user = await this.userService.findByPhone(strEmailOrPhone);
      }
      if (!user) {
        throw new NotFoundException('User not found with this email or phone!');
      }

      const passwordMatched = await compare(strPassword, user.strPassword);
      if (!passwordMatched) {
        throw new UnauthorizedException('Wrong password');
      }

      const role: Role = await this.roleService.findById(user.strRoleId);

      const userToken = {
        ...user,
        strRoleId: user.strRoleId,
      };

      const accessToken =
        await this.authenticator.generateAccessToken(userToken);
      const refreshToken =
        await this.authenticator.generateRefreshToken(userToken);

      return {
        strAccessToken: accessToken.accessToken,
        accessTokenExpiresIn: accessToken.expiresIn,
        refreshToken: refreshToken.refreshToken,
        refreshTokenExpiresIn: refreshToken.expiresIn,
        strRole: role.strRoleName,
        strName: user.strName,
        strEmail: user.strEmail,
      };
    } catch (error) {
      throw error;
    }
  }

  async userRegistration(registerDTO: CreateUserDto): Promise<User> {
    if (
      !registerDTO.strEmail ||
      !registerDTO.strPassword ||
      !registerDTO.strMobileNumber
    ) {
      throw new BadRequestException('Invalid credentials');
    }

    try {
      const isUserEmailExist = await this.userService.findByEmail(
        registerDTO.strEmail,
      );
      if (isUserEmailExist) {
        throw new ConflictException('user already registered with this email');
      }

      const isUserPhoneExist = await this.userService.findByPhone(
        registerDTO.strMobileNumber,
      );
      if (isUserPhoneExist) {
        throw new ConflictException(
          'user already registered with this phone number',
        );
      }

      const isRoleExist = await this.roleService.findById(
        registerDTO.strRoleId,
      );
      if (!isRoleExist) {
        throw new BadRequestException('Role does not exist');
      }

      const isUnitExist = await this.unitService.findOne(registerDTO.strUnitId);
      if (!isUnitExist) {
        throw new BadRequestException('Unit does not exist');
      }

      const hashedPassword = await hashPassword(registerDTO.strPassword);

      const user: User = await this.userService.createUser({
        ...registerDTO,
        strPassword: hashedPassword,
      });

      if (!user) {
        throw new InternalServerErrorException('Could not create user');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
