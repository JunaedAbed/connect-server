import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false,
      secretOrKey: 'f44fd4f46s4fv64sf5v45f44s5f4v5s44vssd1S2', // Use the same secret key as in the JwtModule
    });
  }

  async validate(payload: any) {
    return {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    };
  }
}
