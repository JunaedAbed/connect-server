import { BadRequestException } from '@nestjs/common';
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
      // Decode the refresh token
      //   const decodedRefToken: any = this.jwtService.decode(oldRefToken);

      //   if (!decodedRefToken) {
      //     throw new BadRequestException('Invalid refresh token');
      //   }

      // Extract necessary fields from the decoded refresh token
      //   const { email, intId, password, strEnroll } = decodedRefToken;

      // Create a payload for the JWT
      const payload = {
        email: existingUser.strEmail,
        intId: existingUser._id,
        enroll: existingUser.strEnroll,
        password: existingUser.strPassword,
        roleId: existingUser.strRoleId,
      };

      // Set expiration date for 10 hours from now
      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 10);

      // Generate the access token with 10 hours expiration
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '10h',
      });

      // Update the user's access token and last login date in the database
      await this.loginInfoModel.findByIdAndUpdate(existingUser._id, {
        strAccess_token: accessToken,
        dteLastLogin: new Date(),
      });

      // Return the access token and its expiration date
      return { accessToken, expiresIn };
    } catch (error) {
      throw new Error(`Failed to generate access token: ${error.message}`);
    }
  }

  public async generateRefreshToken(
    existingUser: any,
  ): Promise<{ refreshToken: string; expiresIn: Date }> {
    try {
      //   const { strEmail, _id, strPassword, strRoleId, strEnroll } = existingUser;

      const payload = {
        email: existingUser.strEmail,
        intId: existingUser._id,
        enroll: existingUser.strEnroll,
        password: existingUser.strPassword,
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
