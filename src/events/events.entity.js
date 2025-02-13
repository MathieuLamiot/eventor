import { EntitySchema } from 'typeorm';

export const EventEntity = new EntitySchema({
  name: 'Event',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    event_type: {
      type: String,
    },
    payload: {
      type: 'jsonb',
    },
    origin: {
      type: String,
    },
    correlation_id: {
      type: 'uuid',
      nullable: true,
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
  },
});
