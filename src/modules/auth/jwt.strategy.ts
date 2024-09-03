// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       // ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     });
//   }

//   async validate(payload: any) {
//     return {
//       name: payload.name,
//       email: payload.email,
//       password: payload.password,
//     };
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/entities/user.entity';
import { LoginInfo } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(LoginInfo.name) private userModel: Model<User>) {
    // Inject UsersService
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: process.env.JWT_SECRET,
      secretOrKey: 'f44fd4f46s4fv64sf5v45f44s5f4v5s44vssd1S2',
    });
  }

  async validate(payload: any) {
    // Fetch the user from the database
    const user = await this.userModel.findById(payload.intId);

    // Check if the user exists and is active
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Return only the necessary fields
    return {
      id: user._id,
      name: user.strName,
      email: user.strEmail,
      roleId: user.strRoleId,
    };
  }
}
