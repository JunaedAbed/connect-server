import { PartialType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { CreateUnitDto } from './create-unit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @IsString()
  @Length(1, 255)
  strUnitName: string;
}
