import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface EventMetadata {
  processed_at: Date;
  source: string;
  processor_version: string;
  environment: string;
}

export interface EnrichedEvent {
  id: string;
  event_type: string;
  payload: Record<string, any>;
  origin: string;
  correlation_id: string;
  created_at: Date;
  metadata: EventMetadata;
  version: string;
}

@Injectable()
export class EventEnricherService {
  public enrichEvent(event: any): EnrichedEvent {
    return {
      ...event,
      id: uuidv4(),
      correlation_id: event.correlation_id || uuidv4(),
      created_at: new Date(),
      version: '1.0',
      metadata: {
        processed_at: new Date(),
        source: 'event-manager',
        processor_version: '1.0',
        environment: process.env.NODE_ENV || 'development'
      }
    };
  }
}