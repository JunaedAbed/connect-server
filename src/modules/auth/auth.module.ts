import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LoginInfo, LoginInfoSchema } from './entities/auth.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from 'src/modules/role/role.module';
import { RoleService } from 'src/modules/role/services/role.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoginInfo.name, schema: LoginInfoSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'f44fd4f46s4fv64sf5v45f44s5f4v5s44vssd1S2', // secret key
      signOptions: { expiresIn: '8h' }, // Token expiration time
    }),
    UserModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
