import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from 'src/modules/role/role.module';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    JwtService,
  ],
  exports: ['IUserService'],
})
export class UserModule {}
