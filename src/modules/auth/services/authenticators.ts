import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginInfo } from '../entities/auth.entity';

export class Authenticators {
  constructor(
    @InjectModel(LoginInfo.name)
    private loginInfoModel: Model<LoginInfo>,
    private readonly jwtService: JwtService,
  ) {}

  public async generateAccessToken(
    existingUser: any,
  ): Promise<{ accessToken: string; expiresIn: Date }> {
    const oldRefToken = existingUser.strRefreshToken;

    try {
      const payload = {
        email: existingUser.strEmail,
        intId: existingUser._id,
        enroll: existingUser.strEnroll,
        roleId: existingUser.strRoleId,
      };

      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 10);

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10h',
      });

      await this.loginInfoModel.findByIdAndUpdate(existingUser._id, {
        strAccess_token: accessToken,
        dteLastLogin: new Date(),
      });

      return { accessToken, expiresIn };
    } catch (error) {
      throw new Error(`Failed to generate access token: ${error.message}`);
    }
  }

  public async generateRefreshToken(
    existingUser: any,
  ): Promise<{ refreshToken: string; expiresIn: Date }> {
    try {
      const payload = {
        email: existingUser.strEmail,
        intId: existingUser._id,
        enroll: existingUser.strEnroll,
        roleId: existingUser.strRoleId,
      };

      const expiresIn = new Date();
      expiresIn.setDate(expiresIn.getDate() + 30);

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      });

      await this.loginInfoModel.findByIdAndUpdate(existingUser._id, {
        strRefreshToken: refreshToken,
        dteUpdatedAt: new Date(),
      });

      return { refreshToken, expiresIn };
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  }
}
