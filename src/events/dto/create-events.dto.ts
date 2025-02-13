import { IsString, IsObject, IsOptional, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsString()
  event_type: string;

  @IsObject()
  payload: Record<string, any>;

  @IsString()
  @IsOptional()
  user_id?: string;

  @IsUUID()
  @IsOptional()
  correlation_id?: string;
}