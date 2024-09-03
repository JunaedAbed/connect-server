import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { RoleModule } from 'src/modules/role/role.module';
import { UnitModule } from '../unit/unit.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { LoginInfo, LoginInfoSchema } from './entities/auth.entity';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './services/auth.service';
import { Authenticators } from './services/authenticators';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoginInfo.name, schema: LoginInfoSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // secret: process.env.JWT_SECRET, // secret key
      secret: 'f44fd4f46s4fv64sf5v45f44s5f4v5s44vssd1S2', // secret key
      signOptions: { expiresIn: '8h' }, // Token expiration time
    }),
    UserModule,
    RoleModule,
    UnitModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Authenticators],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
