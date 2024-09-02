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
    // if (!oldRefToken) {
    //   throw new NotFoundException(
    //     'Refresh token not found to generate Access token',
    //   );
    // }
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
    try {
      const { strEmail, _id, strPassword, strRoleId } = existingUser;

      const payload = {
        email: strEmail,
        intId: _id,
        password: strPassword,
        roleId: strRoleId,
      };

      const expiresIn = new Date();
      expiresIn.setDate(expiresIn.getDate() + 30);

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      });

      await this.loginInfoModel.findByIdAndUpdate(_id, {
        strRefreshToken: refreshToken,
        dteUpdatedAt: new Date(),
      });

      return { refreshToken, expiresIn };
    } catch (error) {
      throw new Error(`Failed to generate refresh token: ${error.message}`);
    }
  }
}
