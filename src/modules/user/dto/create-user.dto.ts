import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
export class CreateUserDto {
  @IsOptional()
  @IsString()
  unitId?: string; // Since `unitId` is BIGINT, we use string to handle large numbers.

  @IsEmail()
  @Length(1, 255)
  email: string; // Must be a valid email and within 1-255 characters.

  @IsOptional()
  @IsString()
  userImage?: string; // Optional field for image, voice, PDF, or other links as a string.

  @IsString()
  @Length(1, 255)
  Password: string; // Password with a length between 1-255 characters.

  @IsOptional()
  @IsString()
  credential?: string; // Optional credential field.

  @IsOptional()
  @IsString()
  device_token?: string; // Optional device token field.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  enroll?: string; // Optional field with a maximum length of 50 characters.

  @IsString()
  @Length(1, 20)
  mobile_number: string; // Mobile number with a maximum length of 20 characters.

  @IsOptional()
  @IsString()
  profile_picture?: string; // Optional field for profile picture as a string.

  @IsString()
  @Length(1, 50)
  role: string; // Role with a maximum length of 50 characters.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  session?: string; // Optional session field with a maximum length of 50 characters.

  @IsString()
  @Length(1, 255)
  user_name: string; // User name with a maximum length of 255 characters.
}
