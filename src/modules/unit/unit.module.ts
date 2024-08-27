import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitController } from './controllers/unit.controller';
import { Unit, UnitSchema } from './entities/unit.entity';
import { UnitService } from './services/unit.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]),
  ],
  controllers: [UnitController],
  providers: [
    {
      provide: 'IUnitService',
      useClass: UnitService,
    },
  ],
  exports: ['IUnitService'],
})
export class UnitModule {}
