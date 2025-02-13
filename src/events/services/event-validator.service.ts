import { Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class EventValidatorService {
  private schemas: Map<string, z.ZodSchema>;
  private baseSchema: z.ZodSchema;

  constructor() {
    this.schemas = new Map();
    this.initializeSchemas();
  }

  private initializeSchemas(): void {
    // Base schema for all events
    this.baseSchema = z.object({
      event_type: z.string().min(1),
      payload: z.record(z.any()),
      user_id: z.string().optional(),
      correlation_id: z.string().uuid().optional(),
    });

    // Register specific event schemas
    this.registerSchema('credit_reset', z.object({
      remaining_credits: z.number().min(0),
      reset_reason: z.string().optional(),
    }));
  }

  public registerSchema(eventType: string, payloadSchema: z.ZodSchema): void {
    this.schemas.set(eventType, payloadSchema);
  }

  public async validateEvent(event: any): Promise<boolean> {
    try {
      // Validate basic event structure
      const baseValidation = this.baseSchema.parse(event);

      // Validate event-specific payload if schema exists
      const payloadSchema = this.schemas.get(event.event_type);
      if (payloadSchema) {
        payloadSchema.parse(event.payload);
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }
}