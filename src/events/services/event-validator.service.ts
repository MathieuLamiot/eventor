import { Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

type SchemaKey = `${string}_v${number}`; // e.g., "credit_reset_v1"
@Injectable()
export class EventValidatorService {
  private schemas: Map<SchemaKey, z.ZodSchema>;
  private baseSchema: z.ZodSchema;

  constructor() {
    this.schemas = new Map();
    this.initializeSchemas();
  }

  private initializeSchemas(): void {
    // Base schema for all events
    this.baseSchema = z.object({
      event_type: z.string().min(1),
      event_version: z.number().int().positive(),
      payload: z.record(z.any()),
      origin: z.string(),
      correlation_id: z.string().uuid().optional(),
    });

    // Register specific event schemas
    this.registerSchema(
      'credit_reset',
      1,
      z.object({
        remaining_credits: z.number().min(0),
        reset_reason: z.string().optional(),
      }),
    );
  }

  private getSchemaKey(eventType: string, version: number): SchemaKey {
    return `${eventType}_v${version}` as SchemaKey;
  }

  public registerSchema(eventType: string, eventVersion: number, payloadSchema: z.ZodSchema): void {
    const key = this.getSchemaKey(eventType, eventVersion);
    this.schemas.set(key, payloadSchema);
  }

  public async validateEvent(event: any): Promise<boolean> {
    try {
      // Validate basic event structure
      const _baseValidation = this.baseSchema.parse(event);

      // Validate event-specific payload
      const schemaKey = this.getSchemaKey(event.event_type, event.event_version);
      const payloadSchema = this.schemas.get(schemaKey);
      if (!payloadSchema) {
        throw new BadRequestException(`Validation failed: ${schemaKey} schemaKey is unknown.`);
      }
      payloadSchema.parse(event.payload);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(
          `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }
      throw error;
    }
  }
  // Helper method to get all registered event types and versions
  public getRegisteredSchemas(): Array<{ eventType: string; version: number }> {
    return Array.from(this.schemas.keys()).map((key) => {
      const [eventType, versionStr] = key.split('_v');
      return {
        eventType,
        version: parseInt(versionStr, 10),
      };
    });
  }

  // Get the latest version for an event type
  public getLatestVersion(eventType: string): number {
    const versions = Array.from(this.schemas.keys())
      .filter((key) => key.startsWith(eventType))
      .map((key) => parseInt(key.split('_v')[1], 10));

    return Math.max(...versions, 0);
  }
}
