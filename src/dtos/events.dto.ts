import { IsBoolean, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  public datetime: string;

  @IsString()
  public label: string;

  @IsBoolean()
  public processed: boolean;
}

export class UpdateEventDto {
  @IsString()
  public datetime?: string;

  @IsString()
  public label?: string;

  @IsBoolean()
  public processed?: boolean;
}
