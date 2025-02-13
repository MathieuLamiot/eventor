export interface BaseEvent {
  event_type: string;
  event_version: number;
  payload: Record<string, any>;
  origin: string;
  correlation_id?: string;
}

export interface EventResponse {
  success: boolean;
  event_id?: string;
  correlation_id?: string;
  error?: string;
}
