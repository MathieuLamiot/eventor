import { Injectable } from '@nestjs/common';
import { EventValidatorService } from './services/event-validator.service';
import { EventEnricherService } from './services/event-enricher.service';
import { EventStoreService } from './services/event-store.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly validator: EventValidatorService,
    private readonly enricher: EventEnricherService,
    private readonly store: EventStoreService
  ) {}

  async processEvent(eventData: any) {
    await this.validator.validateEvent(eventData);
    const enrichedEvent = this.enricher.enrichEvent(eventData);
    const eventId = await this.store.storeEvent(enrichedEvent);

    return {
      event_id: eventId,
      correlation_id: enrichedEvent.correlation_id
    };
  }
}