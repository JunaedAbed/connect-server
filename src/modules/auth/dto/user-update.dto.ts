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
  @Length(1, 20)
  mobile_number?: string; // Optional update for mobile_number.

  @IsOptional()
  @IsString()
  profile_picture?: string; // Optional update for profile_picture.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  role?: string; // Optional update for role.
}
