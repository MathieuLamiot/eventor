import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EventsModule } from './../src/events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('EventsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'eventuser',
          password: 'eventpass',
          database: 'eventdb_test',
          entities: ['./**/*.entity.ts'],
          synchronize: true,
        }),
        EventsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/events/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/events/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.timestamp).toBeDefined();
      });
  });

  it('/events (POST)', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        event_type: 'credit_reset',
        payload: {
          remaining_credits: 100,
          reset_reason: 'monthly',
        },
        origin: 'test-system',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.event_id).toBeDefined();
        expect(res.body.correlation_id).toBeDefined();
      });
  });
});