import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRoleService } from 'src/modules/role/services/role-service.interface';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { AuthDTO } from '../dto/auth.dto';
import { UserRegistrationDTO } from '../dto/user-reg.dto';
import { LoginInfo } from '../entities/auth.entity';
import { IAuthService } from './auth-service.interface';
import { IUserService } from 'src/modules/user/services/user-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoModel: Model<LoginInfo>,
    @Inject('IUserService') private userService: IUserService,
    @Inject('IRoleService') private roleService: IRoleService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDTO: AuthDTO): Promise<LoginInfo> {
    try {
      // const { strEmailOrPhone, strPassword } = authDTO;
      // let user: any;
      // let isEmailLogin = false;
      // if (strEmailOrPhone.includes('@')) {
      //   isEmailLogin = true;
      //   user = await this.userService.findByEmail(strEmailOrPhone);
      // } else {
      //   user = await this.userService.findByPhone(strEmailOrPhone);
      // }
      // if (!user) {
      //   throw new UnauthorizedException(
      //     'User not found with this email or phone!',
      //   );
      // }
      // const passwordMatched = await compare(strPassword, user.strPassword);
      // if (!passwordMatched) {
      //   throw new UnauthorizedException('Wrong password');
      // }
      // const existingUser = await this.loginInfoRepository.findOne({
      //   where: isEmailLogin
      //     ? { strEmail: strEmailOrPhone }
      //     : { strPhone: strEmailOrPhone },
      // });
      // if (!existingUser) {
      //   throw new InternalServerErrorException(
      //     'User data not found in the login repository.',
      //   );
      // }
      // const role = await this.roleService.findById(user.intRoleId);
      // const userAdditionalInfo = await this.loginInfoRepository
      //   .createQueryBuilder('loginInfo')
      //   .leftJoin('tblUser', 'user', 'user.intId = loginInfo.intUserId')
      //   .leftJoin('tblOutlet', 'outlet', 'outlet.intId = user.intOutletId')
      //   .select([
      //     'loginInfo.intUserId AS intId',
      //     'outlet.strName AS strOutletName',
      //     'outlet.intStoreId AS intStoreId',
      //     'outlet.strOutletType AS strOutletType',
      //   ])
      //   .where('loginInfo.intUserId = :intUserId', { intUserId: user.intId })
      //   .getRawOne();
      // const userToken = {
      //   ...existingUser,
      //   intRoleId: user.intRoleId,
      // };
      // const accessToken = await this.generateAccessToken(userToken);
      // const refreshToken = await this.generateRefreshToken(userToken);
      // return {
      //   accessToken: accessToken.accessToken,
      //   accessTokenExpiresIn: accessToken.expiresIn,
      //   refreshToken: refreshToken.refreshToken,
      //   refreshTokenExpiresIn: refreshToken.expiresIn,
      //   strRole: role.strRoleName,
      //   intId: user.intId,
      //   intOrgId: user.intOrgId,
      //   intOutletId: user.intOutletId,
      //   strOutletName: userAdditionalInfo.strOutletName,
      //   strOutletType: userAdditionalInfo.strOutletType,
      //   intStoreId:
      //     userAdditionalInfo.intStoreId === 0
      //       ? user.intOutletId
      //       : userAdditionalInfo.intStoreId,
      //   strName: user.strName,
      //   strEmail: user.strEmail,
      //   strPhone: user.strPhone,
      //   intRoleId: user.intRoleId,
      //   isAllBranch: user.isAllBranch,
      //   isOrderFullAccess: user.isOrderFullAccess,
      // };
      return;
    } catch (error) {
      throw error;
    }
  }

  // async registration(registerDTO: UserRegistrationDTO) {
  //   if (
  //     !registerDTO.strEmail ||
  //     !registerDTO.strPassword ||
  //     !registerDTO.strMobileNumber
  //   ) {
  //     throw new UnauthorizedException('Invalid credentials!');
  //   }
  //   try {
  //     const loginInfo = await this.loginInfoModel.findOne({
  //       where: { strPhone: registerDTO.strMobileNumber },
  //     });
  //     if (!loginInfo) throw new BadRequestException('OTP is not recognized');

  //     const isUserEmailExist = await this.userService.findByEmail(
  //       registerDTO.strEmail,
  //     );
  //     if (isUserEmailExist) {
  //       throw new UnauthorizedException('user already exist with this email!');
  //     }
  //     const isUserPhoneExist = await this.userService.findByPhone(
  //       registerDTO.strMobileNumber,
  //     );
  //     if (isUserPhoneExist) {
  //       throw new UnauthorizedException(
  //         'user already exist with this phone number!',
  //       );
  //     }

  //     const hashedPassword = await hashPassword(registerDTO.strPassword);
  //     const user = await this.userService.createUser({
  //       strName: registerDTO.strName,
  //       strEmail: registerDTO.strEmail,
  //       strPassword: hashedPassword,
  //       strMobileNumber: registerDTO.strMobileNumber,
  //       strUserImage: registerDTO.strUserImage,
  //       strDeviceToken: registerDTO.strDeviceToken,
  //       intRoleId: registerDTO.intRoleId,
  //     });
  //     if (!user) {
  //       throw new InternalServerErrorException('Could not create user');
  //     }

  //     const role = await this.roleService.findById(user.intRoleId);
  //     const payload = {
  //       email: user.strEmail,
  //       intId: user.id,
  //       password: user.strPassword,
  //       role: role.strRoleName,
  //     };

  //     const expiresIn = '30d';
  //     const strRefresh_token = await this.jwtService.signAsync(payload, {
  //       expiresIn,
  //     });

  //     const newUser = await this.loginInfoModel.findByIdAndUpdate(user.id, {
  //       _id: user.id,
  //       strEmail: user.strEmail,
  //       strPassword: user.strPassword,
  //       dteLastLogin: new Date(),
  //       strRefresh_token: strRefresh_token,
  //     });
  //     if (!newUser) {
  //       throw new InternalServerErrorException('Could not create user');
  //     }

  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async userRegistration(registerDTO: UserRegistrationDTO): Promise<User> {
    if (
      !registerDTO.strEmail ||
      !registerDTO.strPassword ||
      !registerDTO.strMobileNumber
    ) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    try {
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

      const isRoleExist = await this.roleService.findById(
        registerDTO.intRoleId,
      );

      if (!isRoleExist) {
        throw new UnauthorizedException('Role does not exist!');
      }

      const hashedPassword = await hashPassword(registerDTO.strPassword);

      const user = await this.userService.createUser({
        strName: registerDTO.strName,
        strEmail: registerDTO.strEmail,
        strUserImage: registerDTO.strUserImage,
        strPassword: hashedPassword,
        strDeviceToken: registerDTO.strDeviceToken,
        strEnroll: registerDTO.strEnroll,
        strMobileNumber: registerDTO.strMobileNumber,
        intRoleId: registerDTO.intRoleId,
        strUnitId: registerDTO.strUnitId,
        strCredential: registerDTO.strCredential,
        strSession: registerDTO.strSession,
      });

      if (!user) {
        throw new InternalServerErrorException('Could not create user');
      }

      // const role = await this.roleService.findById(user.intRoleId);
      // const payload = {
      //   email: user.strEmail,
      //   id: user.id,
      //   password: user.strPassword,
      //   role: role.strRoleName,
      // };

      // const expiresIn = '30d';
      // const strRefresh_token = await this.jwtService.signAsync(payload, {
      //   expiresIn,
      // });

      // const currentDate = new Date();
      // const localDate = new Date(
      //   currentDate.getTime() - currentDate.getTimezoneOffset() * 60000,
      // );

      // const newUser = new this.loginInfoModel({
      //   _id: user.id,
      //   strEmail: user.strEmail,
      //   strPassword: user.strPassword,
      //   strPhone: registerDTO.strMobileNumber,
      //   dteLastLogin: localDate,
      //   strRefresh_token: strRefresh_token,
      // }).save();

      // if (!newUser) {
      //   throw new InternalServerErrorException('Could not create user');
      // }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
