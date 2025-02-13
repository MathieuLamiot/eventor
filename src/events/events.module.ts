import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../config/configuration';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventValidatorService } from './services/event-validator.service';
import { EventEnricherService } from './services/event-enricher.service';
import { EventStoreService } from './services/event-store.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Event])
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    EventValidatorService,
    EventEnricherService,
    EventStoreService
  ],
})
export class EventsModule {}