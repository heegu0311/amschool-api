import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @MinLength(2)
  username: string;

  @IsString()
  @MinLength(2)
  nickname: string;

  @IsString()
  intro: string;

  @IsString()
  user_type: string;

  @IsString()
  profile: string;

  @IsBoolean()
  @IsOptional()
  is_cancer_public?: boolean;

  @IsString()
  signin_provider: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;

  @IsString()
  @IsOptional()
  name?: string;
}
