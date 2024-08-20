import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UserUpdateDTO {
  @IsOptional()
  @IsString()
  unitId?: string; // Optional update for unitId.

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string; // Optional update for email with email validation.

  @IsOptional()
  @IsString()
  userImage?: string; // Optional update for userImage.

  @IsOptional()
  @IsString()
  Password?: string; // Optional update for Password.

  @IsOptional()
  @IsString()
  credential?: string; // Optional update for credential.

  @IsOptional()
  @IsString()
  device_token?: string; // Optional update for device_token.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  enroll?: string; // Optional update for enroll.

  @IsOptional()
  @IsString()
  @Length(1, 20)
  mobile_number?: string; // Optional update for mobile_number.

  @IsOptional()
  @IsString()
  profile_picture?: string; // Optional update for profile_picture.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  role?: string; // Optional update for role.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  session?: string; // Optional update for session.

  @IsOptional()
  @IsString()
  @Length(1, 255)
  user_name?: string; // Optional update for user_name.
}
