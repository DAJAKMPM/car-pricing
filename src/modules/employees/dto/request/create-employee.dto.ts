import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CreateContactInfoDto } from './create-contact-info-dto';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsObject()
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => CreateContactInfoDto)
  contactInfo: CreateContactInfoDto;

  @IsNumber()
  @IsOptional()
  managerId?: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  taskIds?: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  meetingIds?: number[];
}
