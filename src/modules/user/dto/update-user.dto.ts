import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  strUnitId?: string; // Since `unitId` is BIGINT, we use string to handle large numbers.

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
  strProfilePicture?: string; // Optional field for profile picture as a string.

  @IsString()
  @Length(1, 50)
  strRole: string; // Role with a maximum length of 50 characters.
}
