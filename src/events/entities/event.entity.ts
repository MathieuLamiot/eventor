import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_type: string;

  @Column()
  event_version: number;

  @Column('jsonb')
  payload: Record<string, any>;

  @Column()
  origin: string;

  @Column('uuid', { nullable: true })
  correlation_id?: string;

  @CreateDateColumn()
  created_at: Date;
}
