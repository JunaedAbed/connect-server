import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './controllers/role.controller';
import { Role, RoleSchema } from './entities/role.entity';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RoleController],

  providers: [
    {
      provide: 'IRoleService',
      useClass: RoleService,
    },
  ],
  exports: ['IRoleService'],
})
export class RoleModule {}
