import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { IRoleService } from 'src/modules/role/services/role-service.interface';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { IUserService } from 'src/modules/user/services/user-service.interface';
import { hashPassword } from 'src/utils/bcrypt';
import { AuthDTO } from '../dto/auth.dto';
import { LoginInfo } from '../entities/auth.entity';
import { IAuthService } from './auth-service.interface';
import { IUnitService } from 'src/modules/unit/services/unit-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoModel: Model<LoginInfo>,
    @Inject('IUserService') private userService: IUserService,
    @Inject('IRoleService') private roleService: IRoleService,
    @Inject('IUnitService') private unitService: IUnitService,
    private readonly jwtService: JwtService,
  ) {}

  public async generateAccessToken(
    existingUser: any,
  ): Promise<{ accessToken: string; expiresIn: Date }> {
    const oldRefToken = existingUser.strRefreshToken;
    if (!oldRefToken) {
      throw new NotFoundException(
        'Refresh token not found to generate Access token',
      );
    }
    try {
      const decodedRefToken: any = this.jwtService.decode(oldRefToken);
      if (!decodedRefToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      const { email, intId, password } = decodedRefToken;
      const payload = {
        email: email,
        intId: intId,
        password: password,
        roleId: existingUser.strRoleId,
      };

      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 10); // Expire in 8 hour

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10h',
      });

      await this.loginInfoModel.findByIdAndUpdate(existingUser.intId, {
        strAccess_token: accessToken,
        dteLastLogin: new Date(),
      });
      return { accessToken, expiresIn };
    } catch (error) {
      throw error;
    }
  }

  public async generateRefreshToken(
    existingUser: any,
  ): Promise<{ refreshToken: string; expiresIn: Date }> {
    const oldRefToken = existingUser.strRefresh_token;
    if (!oldRefToken) {
      throw new NotFoundException(
        'Refresh token not found in the existing user.',
      );
    }
    try {
      const decodedRefToken: any = this.jwtService.decode(oldRefToken);
      if (!decodedRefToken) {
        throw new BadRequestException(
          'Invalid refresh token in the decoded token.',
        );
      }

      const { email, id, password } = decodedRefToken;
      const payload = {
        email: email,
        intId: id,
        password: password,
        roleId: existingUser.intRoleId,
      };

      const expiresIn = new Date();
      expiresIn.setDate(expiresIn.getDate() + 30); // Expire in 30 days

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      });

      await this.loginInfoModel.findByIdAndUpdate(existingUser.id, {
        strRefreshToken: refreshToken,
      });

      return { refreshToken, expiresIn };
    } catch (error) {
      throw error;
    }
  }

  async login(authDTO: AuthDTO) {
    try {
      const { strEmailOrPhone, strPassword } = authDTO;
      let user: any;
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
      // const existingUser = await this.loginInfoModel.findOne({
      //   where: isEmailLogin
      //     ? { strEmail: strEmailOrPhone }
      //     : { strPhone: strEmailOrPhone },
      // });
      // if (!existingUser) {
      //   throw new NotFoundException('User data not found');
      // }
      const role = await this.roleService.findById(user.strRoleId);

      const userAdditionalInfo = await this.loginInfoModel.aggregate([
        {
          $match: {
            strEmail: user.strEmail, // Adjust the matching field as needed
          },
        },
        {
          $lookup: {
            from: 'tblUser', // The MongoDB collection name for users
            localField: 'strEmail', // Field from LoginInfo
            foreignField: 'strEmail', // Field from User
            as: 'user',
          },
        },
        {
          $unwind: '$user', // Unwind the user array to a single document
        },
        {
          $project: {
            intId: '$user._id', // The user's MongoDB ObjectId
            strName: '$user.strName',
            strMobileNumber: '$user.strMobileNumber',
            strRoleId: '$user.strRoleId',
            // Add any other fields you need from the User schema
          },
        },
      ]);

      const result = userAdditionalInfo[0];

      const userToken = {
        ...user,
        strRoleId: user.strRoleId,
      };
      const accessToken = await this.generateAccessToken(userToken);
      const refreshToken = await this.generateRefreshToken(userToken);
      return {
        strAccessToken: accessToken.accessToken,
        accessTokenExpiresIn: accessToken.expiresIn,
        refreshToken: refreshToken.refreshToken,
        refreshTokenExpiresIn: refreshToken.expiresIn,
        strRole: role.strRoleName,
        intId: user.intId,
        intOrgId: user.intOrgId,
        strName: user.strName,
        strEmail: user.strEmail,
        strPhone: user.strPhone,
        strRoleId: user.strRoleId,
      };
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
