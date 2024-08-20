import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
export class CreateUserDto {
  @IsOptional()
  @IsString()
  strUnitId?: string; // Since `unitId` is BIGINT, we use string to handle large numbers.

  @IsEmail()
  @Length(1, 255)
  strEmail: string; // Must be a valid email and within 1-255 characters.

  @IsOptional()
  @IsString()
  strUserImage?: string; // Optional field for image, voice, PDF, or other links as a string.

  @IsString()
  @Length(1, 255)
  strPassword: string; // Password with a length between 1-255 characters.

  @IsOptional()
  @IsString()
  strCredential?: string; // Optional credential field.

  @IsOptional()
  @IsString()
  strDeviceToken?: string; // Optional device token field.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  strEnroll?: string; // Optional field with a maximum length of 50 characters.

  @IsString()
  @Length(1, 20)
  strMobileNumber: string; // Mobile number with a maximum length of 20 characters.

  @IsOptional()
  @IsString()
  strProfilePicture?: string; // Optional field for profile picture as a string.

  @IsString()
  @Length(1, 50)
  strRole: string; // Role with a maximum length of 50 characters.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  strSession?: string; // Optional session field with a maximum length of 50 characters.

  @IsString()
  @Length(1, 255)
  strUsername: string; // User name with a maximum length of 255 characters.
}
