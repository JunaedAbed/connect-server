import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/entities/user.entity';
import { LoginInfo } from './entities/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(LoginInfo.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'f44fd4f46s4fv64sf5v45f44s5f4v5s44vssd1S2',
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findById(payload.intId);

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user._id,
      name: user.strName,
      email: user.strEmail,
      roleId: user.strRoleId,
    };
  }
}
