import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserUpdateDTO {
  @IsOptional()
  @IsString()
  strUnitId?: string; // Since `unitId` is BIGINT, we use string to handle large numbers.

  @IsString()
  @Length(1, 255)
  strName: string; // User name with a maximum length of 255 characters.

  @IsEmail()
  @Length(1, 255)
  strEmail: string; // Must be a valid email and within 1-255 characters.

  @IsOptional()
  @IsString()
  strUserImage?: string; // Optional field for image, voice, PDF, or other links as a string.

  @IsOptional()
  @IsString()
  @Length(1, 50)
  strEnroll?: string; // Optional field with a maximum length of 50 characters.

  @IsString()
  @Length(1, 20)
  strMobileNumber: string; // Mobile number with a maximum length of 20 characters.

  @IsOptional()
  @IsString()
  strRoleId: string;
}
