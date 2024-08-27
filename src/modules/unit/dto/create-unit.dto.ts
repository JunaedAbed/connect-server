import { IsString, Length } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  strUnitId?: string;

  @IsString()
  @Length(1, 255)
  strUnitName: string;
}
