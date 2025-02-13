import { IsString, IsObject, IsOptional, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsString()
  event_type: string;

  @IsString()
  event_version: string;

  @IsObject()
  payload: Record<string, any>;

  @IsString()
  origin: string;

  @IsUUID()
  @IsOptional()
  correlation_id?: string;
}
