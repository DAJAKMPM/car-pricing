import { IsString, IsUrl } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  @IsUrl()
  zoomUrl: string;
}
