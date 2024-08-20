import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDTO } from './dto/register.dto';
import { LoginInfo } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoRepository: Model<LoginInfo>,
    private readonly jwtService: JwtService,
  ) {}

  async registration(registerDTO: RegisterDTO) {
    try {
      var date = new Date();

      const isUserExist = await this.primaryInfoService.findOneUser(
        registerDTO.strEmail,
      );
      if (isUserExist) {
        throw new UnauthorizedException(
          'user with this email already exist! Login or Please try with another email.',
        );
      }

      const org = await this.orgSeßrvice.createOrganization({
        strCreatedBy: registerDTO.strEmail,
        ...registerDTO.RegOrg,
      });

      const primaryInfoDTO = new PrimaryInformationDTO();
      primaryInfoDTO.strEmail = registerDTO.strEmail;
      primaryInfoDTO.strPassword = registerDTO.strPassword;
      primaryInfoDTO.strEmployeeName = registerDTO.strEmployeeName;

      primaryInfoDTO.intOrgId = org.intId;
      primaryInfoDTO.intEnroll = 1;
      primaryInfoDTO.intRoleId = 1; // roleID = 1 for Admin
      primaryInfoDTO.intSupervisorId = 0;

      const user =
        await this.primaryInfoService.createNewEmployee(primaryInfoDTO);
      if (!user) {
        throw new InternalServerErrorException(
          'Failed to create user in primary info',
        );
      }
      console.log(user);
      await this.primaryInfoService.updateOrgIdInPrimaryInfo(
        user.intId,
        org.intId,
      );
      await this.subscriptionService.createSubscription({
        intOrgId: org.intId,
        dteStartDate: new Date(),
        dteEndDate: new Date(date.setDate(date.getDate() + 30)),
        intSubscriptionPlanId: 1,
        isActive: true,
      });

      // find RoleName to generate refresh_token
      const role = await this.roleService.findById(user.intRoleId);
      const payload = {
        email: user.strEmail,
        orgId: user.intOrgId,
        intEmployeeId: user.intId,
        password: user.strPassword,
        role: role.strRoleName,
      };

      const expiresIn = '30d';
      let refresh_token: any;
      try {
        refresh_token = await this.jwtService.signAsync(payload, { expiresIn });
      } catch (error) {
        console.error('Error signing JWT:', error);
        return { message: 'Error signing JWT: ', error };
      }

      await this.loginInfoRepository.update(
        { strEmail: user.strEmail },
        {
          intEmployeeId: user.intId,
          strPassword: user.strPassword,
          dteLastLogin: new Date(),
          intEnroll: user.intEnroll,
          refresh_token: refresh_token,
        },
      );

      return { message: 'account created!' };
    } catch (error) {
      console.log(error);
      return {
        Status: 500,
        message: error.message,
        error: 'Internal Server Error',
      };
    }
  }
}
