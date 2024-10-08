import { IsString, Length } from 'class-validator';

export class AuthDTO {
  @IsString()
  @Length(1, 255)
  strEmailOrPhone: string;

  @IsString()
  @Length(1, 255)
  strPassword: string;
}
