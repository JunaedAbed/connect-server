import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/role.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],
  providers: [RoleService, JwtService],
  exports: [RoleService],
})
export class RoleModule {}
