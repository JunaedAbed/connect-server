import { IsString, Length } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @Length(1, 255)
  strOldPassword: string;

  @IsString()
  @Length(1, 255)
  strNewPassword: string;
}
