import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactInfoDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
