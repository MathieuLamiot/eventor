import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EventValidatorService } from './event-validator.service';

describe('EventValidatorService', () => {
  let service: EventValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventValidatorService],
    }).compile();

    service = module.get<EventValidatorService>(EventValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a valid event', async () => {
    const validEvent = {
      event_type: 'credit_reset',
      payload: {
        remaining_credits: 100,
        reset_reason: 'monthly',
      },
      origin: 'test-system',
    };

    await expect(service.validateEvent(validEvent)).resolves.toBeTruthy();
  });

  it('should reject an invalid event', async () => {
    const invalidEvent = {
      event_type: 'credit_reset',
      payload: {
        remaining_credits: 'not-a-number', // Should be a number
      },
      origin: 'test-system',
    };

    await expect(service.validateEvent(invalidEvent)).rejects.toThrow(BadRequestException);
  });
});