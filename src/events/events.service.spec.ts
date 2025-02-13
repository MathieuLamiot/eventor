import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { EventValidatorService } from './services/event-validator.service';
import { EventEnricherService } from './services/event-enricher.service';
import { EventStoreService } from './services/event-store.service';

describe('EventsService', () => {
  let service: EventsService;
  let validatorService: jest.Mocked<EventValidatorService>;
  let enricherService: jest.Mocked<EventEnricherService>;
  let storeService: jest.Mocked<EventStoreService>;

  beforeEach(async () => {
    const mockValidatorService = {
      validateEvent: jest.fn(),
    };
    const mockEnricherService = {
      enrichEvent: jest.fn(),
    };
    const mockStoreService = {
      storeEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: EventValidatorService,
          useValue: mockValidatorService,
        },
        {
          provide: EventEnricherService,
          useValue: mockEnricherService,
        },
        {
          provide: EventStoreService,
          useValue: mockStoreService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    validatorService = module.get(EventValidatorService);
    enricherService = module.get(EventEnricherService);
    storeService = module.get(EventStoreService);
  });

  it('should process event successfully', async () => {
    const testEvent = {
      event_type: 'test',
      payload: {},
      origin: 'test-system',
    };

    const enrichedEvent = {
      ...testEvent,
      id: 'test-id',
      correlation_id: 'test-correlation',
      created_at: new Date(),
      version: '1.0',
      metadata: {
        processed_at: new Date(),
        source: 'event-manager',
        processor_version: '1.0',
        environment: process.env.NODE_ENV || 'development',
      },
    };

    validatorService.validateEvent.mockResolvedValue(true);
    enricherService.enrichEvent.mockReturnValue(enrichedEvent);
    storeService.storeEvent.mockResolvedValue('test-id');

    const result = await service.processEvent(testEvent);

    expect(result).toEqual({
      event_id: 'test-id',
      correlation_id: 'test-correlation',
    });
    expect(validatorService.validateEvent).toHaveBeenCalledWith(testEvent);
    expect(enricherService.enrichEvent).toHaveBeenCalledWith(testEvent);
    expect(storeService.storeEvent).toHaveBeenCalledWith(enrichedEvent);
  });
});