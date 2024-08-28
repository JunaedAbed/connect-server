import { IsString, Length } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @Length(1, 255)
  strUnitName: string;
}
