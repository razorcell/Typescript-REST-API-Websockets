import { IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  public datetime: string;

  @IsString()
  public label: string;
}
