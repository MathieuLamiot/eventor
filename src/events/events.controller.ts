import { Controller, Post, Get, Body } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() event: any) {
    try {
      const result = await this.eventsService.processEvent(event);
      return {
        status: 'success',
        ...result
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date(),
      version: '1.0'
    };
  }
}