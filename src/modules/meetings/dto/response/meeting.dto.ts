import { Expose } from 'class-transformer';

export class MeetingDto {
  @Expose()
  id: number;

  @Expose()
  zoomUrl: string;
}
