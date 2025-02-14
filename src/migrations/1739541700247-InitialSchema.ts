import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1739541700247 implements MigrationInterface {
    name = 'InitialSchema1739541700247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_type" character varying NOT NULL, "event_version" integer NOT NULL, "payload" jsonb NOT NULL, "origin" character varying NOT NULL, "correlation_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
