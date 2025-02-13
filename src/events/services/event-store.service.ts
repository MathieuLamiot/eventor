import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EnrichedEvent } from './event-enricher.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventStoreService implements OnModuleInit, OnModuleDestroy {
  private batch: EnrichedEvent[] = [];
  private batchInterval: NodeJS.Timeout;
  private readonly batchSize: number;
  private readonly processingInterval: number;

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.batchSize = this.configService.get<number>('events.batchSize') || 100;
    this.processingInterval = this.configService.get<number>('events.batchInterval') || 5000;
  }

  onModuleInit() {
    this.setupBatchProcessing();
  }

  onModuleDestroy() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
    }
  }

  private setupBatchProcessing(): void {
    this.batchInterval = setInterval(() => this.processBatch(), this.processingInterval);
  }

  public async storeEvent(event: EnrichedEvent): Promise<string> {
    try {
      this.batch.push(event);

      if (this.batch.length >= this.batchSize) {
        await this.processBatch();
      }

      return event.id;
    } catch (error) {
      throw new Error(`Failed to store event: ${error.message}`);
    }
  }

  private async processBatch(): Promise<void> {
    if (this.batch.length === 0) return;

    const currentBatch = [...this.batch];
    this.batch = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.processBatchWithTransaction(queryRunner, currentBatch);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.batch.push(...currentBatch);
      throw new Error(`Batch processing failed: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private async processBatchWithTransaction(
    queryRunner: QueryRunner,
    events: EnrichedEvent[]
  ): Promise<void> {
    for (const event of events) {
      await queryRunner.manager.save(Event, event);
    }
  }
}