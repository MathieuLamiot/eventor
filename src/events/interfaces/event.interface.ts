export interface BaseEvent {
    event_type: string;
    payload: Record<string, any>;
    user_id?: string;
    correlation_id?: string;
  }
  
  export interface EventResponse {
    success: boolean;
    event_id?: string;
    correlation_id?: string;
    error?: string;
  }